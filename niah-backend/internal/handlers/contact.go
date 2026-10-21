package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

// Per-field caps. The body-size middleware rejects anything enormous before it
// reaches here; these keep one field from swallowing an otherwise legal body.
const (
	maxContactName    = 120
	maxContactEmail   = 200
	maxContactSubject = 120
	maxContactMessage = 5000
)

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

type contactResponse struct {
	ID      int64  `json:"id"`
	Message string `json:"message"`
}

// messageRecord is the shape returned to the admin dashboard's Messages tab.
type messageRecord struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Subject   string `json:"subject"`
	Message   string `json:"message"`
	CreatedAt string `json:"created_at"`
}

// SubmitMessage handles POST /api/contact — public, no auth.
func SubmitMessage(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req contactRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{"invalid JSON body"})
			return
		}

		req.Name    = strings.TrimSpace(req.Name)
		req.Email   = strings.TrimSpace(strings.ToLower(req.Email))
		req.Subject = strings.TrimSpace(req.Subject)
		req.Message = strings.TrimSpace(req.Message)

		if err := validateContact(req); err != nil {
			writeJSON(w, http.StatusUnprocessableEntity, errorResponse{err.Error()})
			return
		}

		const query = `
			INSERT INTO messages (name, email, subject, message)
			VALUES (?, ?, ?, ?)
		`
		result, err := db.ExecContext(r.Context(), query,
			req.Name, req.Email, req.Subject, req.Message,
		)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not send your message"})
			return
		}

		id, _ := result.LastInsertId()

		writeJSON(w, http.StatusCreated, contactResponse{
			ID:      id,
			Message: "Message received — we'll respond within 2 business days.",
		})
	}
}

// ListMessages handles GET /api/admin/messages — Bearer auth required.
// Newest first, same as the other admin lists.
func ListMessages(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const query = `
			SELECT id, name, email, subject, message, created_at
			FROM   messages
			ORDER  BY created_at DESC
		`
		rows, err := db.QueryContext(r.Context(), query)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"failed to query messages"})
			return
		}
		defer rows.Close()

		records := make([]messageRecord, 0)
		for rows.Next() {
			var m messageRecord
			if err := rows.Scan(
				&m.ID, &m.Name, &m.Email, &m.Subject, &m.Message, &m.CreatedAt,
			); err != nil {
				writeJSON(w, http.StatusInternalServerError, errorResponse{"failed to read message row"})
				return
			}
			records = append(records, m)
		}
		if err := rows.Err(); err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"error iterating messages"})
			return
		}

		writeJSON(w, http.StatusOK, map[string]any{
			"count":    len(records),
			"messages": records,
		})
	}
}

// validateContact returns the first validation error found, or nil.
// Subject is optional — the form offers a preset list but does not force one.
func validateContact(req contactRequest) error {
	switch {
	case req.Name == "":
		return errors.New("name is required")
	case len(req.Name) < 2:
		return errors.New("name must be at least 2 characters")
	case overLimit(req.Name, maxContactName):
		return errors.New("name is too long")
	case req.Email == "":
		return errors.New("email is required")
	case !emailRE.MatchString(req.Email):
		return errors.New("email address is invalid")
	case overLimit(req.Email, maxContactEmail):
		return errors.New("email address is too long")
	case overLimit(req.Subject, maxContactSubject):
		return errors.New("subject is too long")
	case req.Message == "":
		return errors.New("message is required")
	case overLimit(req.Message, maxContactMessage):
		return errors.New("message is too long — please keep it under 5000 characters")
	}
	return nil
}
