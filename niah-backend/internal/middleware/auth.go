package middleware

import (
	"crypto/subtle"
	"net/http"
	"strings"
)

// AdminAuth returns middleware that enforces a Bearer token check on every
// request that passes through it.
//
// The caller must send the token as a standard Authorization header:
//
//	Authorization: Bearer <your-secret-token>
//
// Using the standard Authorization header (rather than a custom X-Admin-Token)
// means the browser's CORS preflight does not need to whitelist an extra header,
// because Authorization is already in the Access-Control-Allow-Headers list.
//
// Why crypto/subtle.ConstantTimeCompare?
// A plain == comparison short-circuits on the first mismatched byte, making it
// theoretically vulnerable to timing attacks. ConstantTimeCompare always takes
// the same amount of time regardless of where the mismatch is.
func AdminAuth(token string) func(http.Handler) http.Handler {
	expected := []byte(token)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Extract the Bearer token from "Authorization: Bearer <token>"
			authHeader := r.Header.Get("Authorization")
			got := strings.TrimPrefix(authHeader, "Bearer ")

			if len(expected) == 0 || subtle.ConstantTimeCompare([]byte(got), expected) != 1 {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte(`{"error":"unauthorized"}`))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
