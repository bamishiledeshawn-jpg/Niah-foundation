package middleware

import "net/http"

// MaxBytes caps how much of a request body the handlers will read, so a large
// upload cannot be used to exhaust memory before validation ever runs.
//
// Exceeding the cap makes the next Read fail, which surfaces to the client as
// the handler's own "invalid JSON body" 400 rather than a dedicated status.
// That is accurate enough — an over-long body is a malformed request — and
// keeps the handlers free of size-checking code.
func MaxBytes(n int64) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			r.Body = http.MaxBytesReader(w, r.Body, n)
			next.ServeHTTP(w, r)
		})
	}
}
