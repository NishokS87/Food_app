package loadbalancer

import (
	"net/http"
	"sync"
)

type RoundRobin struct {
	servers []string
	index   int
	mu      sync.Mutex
}

func NewRoundRobin(servers []string) *RoundRobin {
	return &RoundRobin{servers: servers}
}

func (r *RoundRobin) GetNextServer() string {
	r.mu.Lock()
	defer r.mu.Unlock()

	server := r.servers[r.index]
	r.index = (r.index + 1) % len(r.servers)
	return server
}

func (r *RoundRobin) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	nextServer := r.GetNextServer()
	req.URL.Host = nextServer
	req.URL.Scheme = "http"
	http.Redirect(w, req, req.URL.String(), http.StatusTemporaryRedirect)
}