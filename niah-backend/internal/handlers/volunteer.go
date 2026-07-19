package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"regexp"
	"strings"
)

// volunteerRequest mirrors the JSON body sent by the React frontend's
// Volunteer page form.
type volunteerRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Role    string `json:"role"`
	Message string `json:"message"`
}

// volunteerResponse is the JSON shape returned on success.
type volunteerResponse struct {
	ID      int64  `json:"id"`
	Message string `json:"message"`
}

// errorResponse is the JSON shape returned on any error.
type errorResponse struct {
	Error string `json:"error"`
}

var emailRE = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

// RegisterVolunteer returns an http.HandlerFunc that handles POST /api/register.
// It depends on a *sql.DB injected at construction time (dependency injection),
// keeping the handler testable and the database layer swappable.
func RegisterVolunteer(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// ── 1. Decode ──────────────────────────────────────────────────────
		var req volunteerRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{"invalid JSON body"})
			return
		}

		// ── 2. Sanitise ────────────────────────────────────────────────────
		req.Name    = strings.TrimSpace(req.Name)
		req.Email   = strings.TrimSpace(strings.ToLower(req.Email))
		req.Phone   = strings.TrimSpace(req.Phone)
		req.Role    = strings.TrimSpace(req.Role)
		req.Message = strings.TrimSpace(req.Message)

		// ── 3. Validate ────────────────────────────────────────────────────
		if err := validate(req); err != nil {
			writeJSON(w, http.StatusUnprocessableEntity, errorResponse{err.Error()})
			return
		}

		// ── 4. Persist ─────────────────────────────────────────────────────
		const query = `
			INSERT INTO volunteers (name, email, phone, role, message)
			VALUES (?, ?, ?, ?, ?)
		`
		result, err := db.ExecContext(r.Context(), query,
			req.Name, req.Email, req.Phone, req.Role, req.Message,
		)
		if err != nil {
			// Surface duplicate-email as a 409 rather than a 500.
			if strings.Contains(err.Error(), "UNIQUE constraint failed") {
				writeJSON(w, http.StatusConflict, errorResponse{"this email is already registered"})
				return
			}
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not save registration"})
			return
		}

		id, _ := result.LastInsertId()

		// ── 5. Respond ─────────────────────────────────────────────────────
		writeJSON(w, http.StatusCreated, volunteerResponse{
			ID:      id,
			Message: "Registration successful — we'll be in touch shortly.",
		})
	}
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// validate returns the first validation error found, or nil.
func validate(req volunteerRequest) error {
	switch {
	case req.Name == "":
		return errors.New("name is required")
	case len(req.Name) < 2:
		return errors.New("name must be at least 2 characters")
	case req.Email == "":
		return errors.New("email is required")
	case !emailRE.MatchString(req.Email):
		return errors.New("email address is invalid")
	case req.Phone == "":
		return errors.New("phone is required")
	case len(req.Phone) < 7:
		return errors.New("phone number is too short")
	}
	return nil
}

// writeJSON serialises v as JSON and writes it with the given status code.
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
