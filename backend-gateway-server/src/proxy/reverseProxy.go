package proxy

import (
    "net/http"
    "net/http/httputil"
    "net/url"
)

// ReverseProxy sets up a reverse proxy to forward requests to the backend API server.
func ReverseProxy(target string) http.Handler {
    url, _ := url.Parse(target)
    proxy := httputil.NewSingleHostReverseProxy(url)

    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        r.Host = url.Host
        proxy.ServeHTTP(w, r)
    })
}