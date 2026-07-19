package middleware

import "net/http"

// CORS returns an http.Handler middleware that adds the correct
// Access-Control headers for the specified frontend origin.
//
// It handles OPTIONS preflight requests inline so no additional
// route registration is needed.
func CORS(allowedOrigin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")

			// Only set ACAO for the configured origin; never use wildcard
			// when credentials might be sent.
			if origin == allowedOrigin {
				w.Header().Set("Access-Control-Allow-Origin", origin)
			}

			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Max-Age", "86400") // cache preflight 24 h

			// Respond immediately to preflight; do not call next handler.
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}