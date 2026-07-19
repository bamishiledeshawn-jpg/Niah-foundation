package config

import (
	"log"
	"os"
)

type Config struct {
	Port             string
	DBPath           string
	AllowedOrigin    string
	AdminToken       string
	PaystackSecretKey string
}

func Load() Config {
	token := getEnv("ADMIN_TOKEN", "")
	if token == "" {
		log.Fatal("[config] ADMIN_TOKEN env var is required but not set")
	}

	paystackKey := getEnv("PAYSTACK_SECRET_KEY", "")
	if paystackKey == "" {
		log.Fatal("[config] PAYSTACK_SECRET_KEY env var is required but not set")
	}

	return Config{
		Port:              getEnv("PORT", "8080"),
		DBPath:            getEnv("DB_PATH", "./niah.db"),
		AllowedOrigin:     getEnv("ALLOWED_ORIGIN", "http://localhost:5173"),
		AdminToken:        token,
		PaystackSecretKey: paystackKey,
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}