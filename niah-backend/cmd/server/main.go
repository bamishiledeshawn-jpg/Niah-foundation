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

	r.Route("/api", func(r chi.Router) {
		// ── Public ────────────────────────────────────────────────────
		r.Get("/health",           handlers.HealthCheck)
		r.Post("/register",        handlers.RegisterVolunteer(database))
		r.Get("/events",           handlers.ListEvents(database))
		r.Post("/payments/verify", handlers.VerifyPayment(database, cfg.PaystackSecretKey))
		r.Post("/stories",         handlers.SubmitStory(database))

		// ── Admin (token required) ────────────────────────────────────
		r.Group(func(r chi.Router) {
			r.Use(middleware.AdminAuth(cfg.AdminToken))

			r.Get("/admin/registrations", handlers.ListRegistrations(database))
			r.Post("/admin/events",       handlers.CreateEvent(database))
			r.Delete("/admin/events/{id}", handlers.DeleteEvent(database))
			r.Get("/admin/payments",      handlers.ListPayments(database))
			r.Get("/admin/stories",       handlers.ListStories(database))
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