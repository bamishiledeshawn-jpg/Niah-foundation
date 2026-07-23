package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type Story struct {
	ID        int64  `json:"id"`
	StoryText string `json:"story"`
	Duration  string `json:"duration"`
	Support   string `json:"support"`
	Pseudonym string `json:"pseudonym"`
	FinalNote string `json:"final_note"`
	CreatedAt string `json:"created_at"`
}

type submitStoryRequest struct {
	Story     string `json:"story"`
	Duration  string `json:"duration"`
	Support   string `json:"support"`
	Pseudonym string `json:"pseudonym"`
	FinalNote string `json:"finalNote"`
}

// SubmitStory handles POST /api/stories — public, no auth.
func SubmitStory(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req submitStoryRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
			return
		}

		if req.Story == "" || req.Duration == "" {
			http.Error(w, `{"error":"story and duration are required"}`, http.StatusBadRequest)
			return
		}

		_, err := db.Exec(
			`INSERT INTO stories (story, duration, support, pseudonym, final_note)
			 VALUES (?, ?, ?, ?, ?)`,
			req.Story, req.Duration, req.Support, req.Pseudonym, req.FinalNote,
		)
		if err != nil {
			http.Error(w, `{"error":"could not save story"}`, http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{"status": "received"})
	}
}

// ListStories handles GET /api/admin/stories — Bearer auth required.
func ListStories(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(
			`SELECT id, story, duration, support, pseudonym, final_note, created_at
			 FROM stories ORDER BY created_at DESC`,
		)
		if err != nil {
			http.Error(w, `{"error":"could not fetch stories"}`, http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		stories := []Story{}
		for rows.Next() {
			var s Story
			if err := rows.Scan(&s.ID, &s.StoryText, &s.Duration, &s.Support, &s.Pseudonym, &s.FinalNote, &s.CreatedAt); err != nil {
				continue
			}
			stories = append(stories, s)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"stories": stories,
			"count":   len(stories),
		})
	}
}
