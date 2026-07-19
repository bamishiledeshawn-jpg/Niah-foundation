package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

type verifyRequest struct {
	Reference string `json:"reference"`
}

type paystackData struct {
	Amount   int    `json:"amount"`
	Currency string `json:"currency"`
	Status   string `json:"status"`
	Customer struct {
		Email string `json:"email"`
	} `json:"customer"`
}

type paystackResponse struct {
	Status  bool         `json:"status"`
	Message string       `json:"message"`
	Data    paystackData `json:"data"`
}

type paymentRecord struct {
	ID        int64  `json:"id"`
	Reference string `json:"reference"`
	Email     string `json:"email"`
	Amount    int    `json:"amount"`
	Status    string `json:"status"`
	CreatedAt string `json:"created_at"`
}

// POST /api/payments/verify — public
// Accepts a Paystack reference from the frontend popup callback,
// verifies it against the Paystack API, and records the result in SQLite.
func VerifyPayment(db *sql.DB, secretKey string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// ── 1. Decode request body ─────────────────────────────────────
		var req verifyRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{"invalid JSON body"})
			return
		}

		req.Reference = strings.TrimSpace(req.Reference)
		if req.Reference == "" {
			writeJSON(w, http.StatusUnprocessableEntity, errorResponse{"reference is required"})
			return
		}

		// ── 2. Verify with Paystack ────────────────────────────────────
		psURL := fmt.Sprintf("https://api.paystack.co/transaction/verify/%s", req.Reference)
		psReq, err := http.NewRequestWithContext(r.Context(), http.MethodGet, psURL, nil)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not build verification request"})
			return
		}
		psReq.Header.Set("Authorization", "Bearer "+secretKey)

		client := &http.Client{}
		psRes, err := client.Do(psReq)
		if err != nil {
			writeJSON(w, http.StatusBadGateway, errorResponse{"could not reach Paystack"})
			return
		}
		defer psRes.Body.Close()

		var psBody paystackResponse
		if err := json.NewDecoder(psRes.Body).Decode(&psBody); err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not parse Paystack response"})
			return
		}

		if !psBody.Status || psBody.Data.Status != "success" {
			writeJSON(w, http.StatusPaymentRequired, errorResponse{"payment not successful"})
			return
		}

		// ── 3. Persist to SQLite ───────────────────────────────────────
		// ON CONFLICT DO NOTHING prevents duplicate records if the frontend
		// calls verify more than once for the same reference.
		const query = `
			INSERT INTO payments (reference, email, amount, status)
			VALUES (?, ?, ?, ?)
			ON CONFLICT(reference) DO NOTHING
		`
		result, err := db.ExecContext(r.Context(), query,
			req.Reference,
			psBody.Data.Customer.Email,
			psBody.Data.Amount,
			psBody.Data.Status,
		)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not record payment"})
			return
		}

		id, _ := result.LastInsertId()

		writeJSON(w, http.StatusOK, paymentRecord{
			ID:        id,
			Reference: req.Reference,
			Email:     psBody.Data.Customer.Email,
			Amount:    psBody.Data.Amount,
			Status:    psBody.Data.Status,
		})
	}
}

// GET /api/admin/payments — protected
// Returns all recorded payments sorted newest first.
func ListPayments(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const query = `
			SELECT id, reference, email, amount, status, created_at
			FROM   payments
			ORDER  BY created_at DESC
		`
		rows, err := db.QueryContext(r.Context(), query)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"failed to query payments"})
			return
		}
		defer rows.Close()

		records := make([]paymentRecord, 0)
		for rows.Next() {
			var p paymentRecord
			if err := rows.Scan(&p.ID, &p.Reference, &p.Email, &p.Amount, &p.Status, &p.CreatedAt); err != nil {
				writeJSON(w, http.StatusInternalServerError, errorResponse{"failed to read payment row"})
				return
			}
			records = append(records, p)
		}
		if err := rows.Err(); err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"error iterating payments"})
			return
		}

		writeJSON(w, http.StatusOK, map[string]any{
			"count":    len(records),
			"payments": records,
		})
	}
}