package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"

	"github.com/niah-foundation/backend/config"
	"github.com/niah-foundation/backend/internal/db"
	"github.com/niah-foundation/backend/internal/handlers"
	"github.com/niah-foundation/backend/internal/middleware"
)

func main() {
	cfg := config.Load()

	database, err := db.Open(cfg.DBPath)
	if err != nil {
		log.Fatalf("[startup] database: %v", err)
	}
	defer database.Close()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.CORS(cfg.AllowedOrigin))

	// Every unauthenticated POST gets a body-size cap and a per-IP rate limit.
	// The limits are deliberately loose enough that a real person filling in a
	// form never meets them, and tight enough that a script cannot flood the
	// table. Payment verification is the exception: a donor whose first verify
	// fails will retry, so it allows a larger burst that refills quickly.
	publicPost := func(burst int, refill time.Duration, maxBody int64) []func(http.Handler) http.Handler {
		return []func(http.Handler) http.Handler{
			middleware.MaxBytes(maxBody),
			middleware.RateLimit(burst, refill, cfg.TrustProxy),
		}
	}

	r.Route("/api", func(r chi.Router) {
		// ── Public ────────────────────────────────────────────────────
		r.Get("/health", handlers.HealthCheck)
		r.Get("/events", handlers.ListEvents(database))

		r.With(publicPost(5, 2*time.Minute, 16<<10)...).
			Post("/register", handlers.RegisterVolunteer(database))
		r.With(publicPost(3, 5*time.Minute, 64<<10)...).
			Post("/stories", handlers.SubmitStory(database))
		r.With(publicPost(5, 2*time.Minute, 32<<10)...).
			Post("/contact", handlers.SubmitMessage(database))
		r.With(publicPost(20, 10*time.Second, 4<<10)...).
			Post("/payments/verify", handlers.VerifyPayment(database, cfg.PaystackSecretKey))

		// ── Admin (token required) ────────────────────────────────────
		r.Group(func(r chi.Router) {
			r.Use(middleware.AdminAuth(cfg.AdminToken))

			r.Get("/admin/registrations", handlers.ListRegistrations(database))
			r.Post("/admin/events",       handlers.CreateEvent(database))
			r.Delete("/admin/events/{id}", handlers.DeleteEvent(database))
			r.Get("/admin/payments",      handlers.ListPayments(database))
			r.Get("/admin/stories",       handlers.ListStories(database))
			r.Get("/admin/messages",      handlers.ListMessages(database))
		})
	})

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("[startup] listening on http://localhost:%s", cfg.Port)
		if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("[server] %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[shutdown] signal received, draining connections…")

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("[shutdown] forced: %v", err)
	}

	log.Println("[shutdown] clean exit")
}