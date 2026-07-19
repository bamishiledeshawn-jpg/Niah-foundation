package handlers

import (
	"database/sql"
	"net/http"
)

// volunteerRecord is the shape returned to the admin dashboard.
// It includes all fields, including created_at for sorting context.
type volunteerRecord struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Role      string `json:"role"`
	Message   string `json:"message"`
	CreatedAt string `json:"created_at"`
}

// listResponse wraps the slice so the frontend always receives an object,
// never a bare array — easier to extend later (e.g. add pagination metadata).
type listResponse struct {
	Count      int               `json:"count"`
	Volunteers []volunteerRecord `json:"volunteers"`
}

// ListRegistrations handles GET /api/admin/registrations.
// Returns all volunteers ordered by submission date, newest first.
func ListRegistrations(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const query = `
			SELECT id, name, email, phone, role, message, created_at
			FROM   volunteers
			ORDER  BY created_at DESC
		`

		rows, err := db.QueryContext(r.Context(), query)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"failed to query registrations"})
			return
		}
		defer rows.Close()

		records := make([]volunteerRecord, 0) // non-nil slice → JSON [] not null
		for rows.Next() {
			var v volunteerRecord
			if err := rows.Scan(
				&v.ID, &v.Name, &v.Email, &v.Phone,
				&v.Role, &v.Message, &v.CreatedAt,
			); err != nil {
				writeJSON(w, http.StatusInternalServerError, errorResponse{"failed to read row"})
				return
			}
			records = append(records, v)
		}

		// rows.Err() catches any error that occurred during iteration
		// that wouldn't be caught by rows.Next() returning false.
		if err := rows.Err(); err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"error reading results"})
			return
		}

		writeJSON(w, http.StatusOK, listResponse{
			Count:      len(records),
			Volunteers: records,
		})
	}
}
