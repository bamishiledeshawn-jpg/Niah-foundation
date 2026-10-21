package middleware

import (
	"fmt"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

// RateLimit returns middleware that throttles requests per client IP using a
// token bucket: a client may make `burst` requests immediately, then regains
// one allowance every `refill`.
//
// State is held in memory, which means it resets when the process restarts and
// is not shared between processes. That is the right trade-off while the API is
// a single instance backed by a SQLite file; if it is ever run behind a load
// balancer, this needs to move to Redis or the limit becomes per-instance.
//
// trustProxy must only be true when the server really does sit behind a proxy
// that sets X-Forwarded-For. A client can put anything in that header, so
// trusting it on a directly exposed server lets anyone bypass the limit by
// sending a different value on each request.
func RateLimit(burst int, refill time.Duration, trustProxy bool) func(http.Handler) http.Handler {
	l := &limiter{
		buckets:    make(map[string]*bucket),
		burst:      float64(burst),
		refill:     refill,
		trustProxy: trustProxy,
	}
	go l.janitor()

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if ok, wait := l.allow(l.clientIP(r)); !ok {
				w.Header().Set("Retry-After", fmt.Sprintf("%d", int(wait.Seconds())+1))
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusTooManyRequests)
				w.Write([]byte(`{"error":"too many requests — please wait a moment and try again"}`))
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

type bucket struct {
	tokens float64
	last   time.Time
}

type limiter struct {
	mu         sync.Mutex
	buckets    map[string]*bucket
	burst      float64
	refill     time.Duration
	trustProxy bool
}

// allow consumes one token for ip. When none is available it reports how long
// the caller must wait for the next one.
func (l *limiter) allow(ip string) (bool, time.Duration) {
	now := time.Now()

	l.mu.Lock()
	defer l.mu.Unlock()

	b, seen := l.buckets[ip]
	if !seen {
		l.buckets[ip] = &bucket{tokens: l.burst - 1, last: now}
		return true, 0
	}

	b.tokens += now.Sub(b.last).Seconds() / l.refill.Seconds()
	if b.tokens > l.burst {
		b.tokens = l.burst
	}
	b.last = now

	if b.tokens < 1 {
		return false, time.Duration((1 - b.tokens) * float64(l.refill))
	}

	b.tokens--
	return true, 0
}

// janitor drops buckets for IPs that have been quiet for an hour, so the map
// does not grow without bound over a long uptime.
func (l *limiter) janitor() {
	for range time.Tick(10 * time.Minute) {
		cutoff := time.Now().Add(-time.Hour)

		l.mu.Lock()
		for ip, b := range l.buckets {
			if b.last.Before(cutoff) {
				delete(l.buckets, ip)
			}
		}
		l.mu.Unlock()
	}
}

func (l *limiter) clientIP(r *http.Request) string {
	if l.trustProxy {
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			if first := strings.TrimSpace(strings.Split(xff, ",")[0]); first != "" {
				return first
			}
		}
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
