package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

// Per-field caps. story was unbounded before, which let a single request write
// an arbitrarily large row; 8000 characters is far more than the form's own
// textarea invites while still leaving room for someone who needs to write at
// length. The body-size middleware stops anything bigger than the whole set.
const (
	maxStoryText      = 8000
	maxStoryDuration  = 60
	maxStorySupport   = 2000
	maxStoryPseudonym = 60
	maxStoryFinalNote = 2000
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
			writeJSON(w, http.StatusBadRequest, errorResponse{"invalid request body"})
			return
		}

		req.Story     = strings.TrimSpace(req.Story)
		req.Duration  = strings.TrimSpace(req.Duration)
		req.Support   = strings.TrimSpace(req.Support)
		req.Pseudonym = strings.TrimSpace(req.Pseudonym)
		req.FinalNote = strings.TrimSpace(req.FinalNote)

		if err := validateStory(req); err != nil {
			writeJSON(w, http.StatusUnprocessableEntity, errorResponse{err.Error()})
			return
		}

		_, err := db.Exec(
			`INSERT INTO stories (story, duration, support, pseudonym, final_note)
			 VALUES (?, ?, ?, ?, ?)`,
			req.Story, req.Duration, req.Support, req.Pseudonym, req.FinalNote,
		)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not save story"})
			return
		}

		writeJSON(w, http.StatusCreated, map[string]string{"status": "received"})
	}
}

// validateStory returns the first validation error found, or nil.
// Only story and duration are required; the rest of the form is optional by
// design, so that someone can share as little as they are comfortable with.
func validateStory(req submitStoryRequest) error {
	switch {
	case req.Story == "":
		return errors.New("story is required")
	case overLimit(req.Story, maxStoryText):
		return errors.New("story is too long — please keep it under 8000 characters")
	case req.Duration == "":
		return errors.New("duration is required")
	case overLimit(req.Duration, maxStoryDuration):
		return errors.New("duration is too long")
	case overLimit(req.Support, maxStorySupport):
		return errors.New("support answer is too long")
	case overLimit(req.Pseudonym, maxStoryPseudonym):
		return errors.New("pseudonym is too long")
	case overLimit(req.FinalNote, maxStoryFinalNote):
		return errors.New("final note is too long")
	}
	return nil
}

// ListStories handles GET /api/admin/stories — Bearer auth required.
func ListStories(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(
			`SELECT id, story, duration, support, pseudonym, final_note, created_at
			 FROM stories ORDER BY created_at DESC`,
		)
		if err != nil {
			writeJSON(w, http.StatusInternalServerError, errorResponse{"could not fetch stories"})
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

		writeJSON(w, http.StatusOK, map[string]any{
			"stories": stories,
			"count":   len(stories),
		})
	}
}
