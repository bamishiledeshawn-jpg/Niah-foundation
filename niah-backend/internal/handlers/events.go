package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
)

type eventRecord struct {
	ID          int64   `json:"id"`
	Title       string  `json:"title"`
	Category    string  `json:"category"`
	Location    string  `json:"location"`
	Description string  `json:"description"`
	EventDate   string  `json:"event_date"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
	CreatedAt   string  `json:"created_at,omitempty"`
}

type eventsListResponse struct {
	Count  int           `json:"count"`
	Events []eventRecord `json:"events"`
}

// GET /api/events — public
func ListEvents(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const query = `
			SELECT id, title, category, location, description,
			       event_date, latitude, longitude, created_at
			FROM   events
			WHERE  event_date >= date('now')
			ORDER  BY event_date ASC
		`
		rows, err := db.QueryContext(r.Context(), query)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"failed to query events"})
			return
		}
		defer rows.Close()

		records := make([]eventRecord, 0)
		for rows.Next() {
			var e eventRecord
			if err := rows.Scan(
				&e.ID, &e.Title, &e.Category, &e.Location,
				&e.Description, &e.EventDate, &e.Latitude, &e.Longitude, &e.CreatedAt,
			); err != nil {
				writeJSON(w, http.StatusInternalServerError, errorResponse{"failed to read event row"})
				return
			}
			records = append(records, e)
		}
		if err := rows.Err(); err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"error iterating events"})
			return
		}

		writeJSON(w, http.StatusOK, eventsListResponse{Count: len(records), Events: records})
	}
}

// POST /api/admin/events — protected
func CreateEvent(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req eventRecord
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeJSON(w, http.StatusBadRequest, errorResponse{"invalid JSON body"})
			return
		}

		req.Title       = strings.TrimSpace(req.Title)
		req.Category    = strings.TrimSpace(req.Category)
		req.Location    = strings.TrimSpace(req.Location)
		req.Description = strings.TrimSpace(req.Description)
		req.EventDate   = strings.TrimSpace(req.EventDate)

		switch {
		case req.Title == "":
			writeJSON(w, http.StatusUnprocessableEntity, errorResponse{"title is required"})
			return
		case req.EventDate == "":
			writeJSON(w, http.StatusUnprocessableEntity, errorResponse{"event_date is required"})
			return
		}

		const query = `
			INSERT INTO events (title, category, location, description, event_date, latitude, longitude)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`
		result, err := db.ExecContext(r.Context(), query,
			req.Title, req.Category, req.Location,
			req.Description, req.EventDate, req.Latitude, req.Longitude,
		)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not save event"})
			return
		}

		id, _ := result.LastInsertId()
		req.ID = id
		writeJSON(w, http.StatusCreated, req)
	}
}

// DELETE /api/admin/events/:id — protected
func DeleteEvent(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		if id == "" {
			writeJSON(w, http.StatusBadRequest, errorResponse{"missing event id"})
			return
		}

		result, err := db.ExecContext(r.Context(), `DELETE FROM events WHERE id = ?`, id)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not delete event"})
			return
		}

		rows, _ := result.RowsAffected()
		if rows == 0 {
			writeJSON(w, http.StatusNotFound, errorResponse{"event not found"})
			return
		}

		writeJSON(w, http.StatusOK, map[string]string{"message": "event deleted"})
	}
}