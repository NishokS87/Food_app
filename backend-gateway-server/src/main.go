package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"sync"
	"time"
)

// Service represents a backend service
type Service struct {
	URL          *url.URL
	Alive        bool
	mu           sync.RWMutex
	ReverseProxy *httputil.ReverseProxy
}

// LoadBalancer manages multiple backend services
type LoadBalancer struct {
	services []*Service
	current  uint64
	mu       sync.Mutex
}

// Restaurant service backends
var restaurantServices = []string{
	"http://localhost:5001",
	"http://localhost:5002",
}

// Order service backends
var orderServices = []string{
	"http://localhost:6001",
	"http://localhost:6002",
}

var restaurantLB *LoadBalancer
var orderLB *LoadBalancer

// NewLoadBalancer creates a new load balancer
func NewLoadBalancer(backends []string) *LoadBalancer {
	lb := &LoadBalancer{
		services: make([]*Service, len(backends)),
	}

	for i, backend := range backends {
		serverURL, err := url.Parse(backend)
		if err != nil {
			log.Fatal(err)
		}

		proxy := httputil.NewSingleHostReverseProxy(serverURL)

		// Custom error handler
		proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
			log.Printf("Proxy error: %v", err)
			w.WriteHeader(http.StatusServiceUnavailable)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Service temporarily unavailable",
			})
		}

		lb.services[i] = &Service{
			URL:          serverURL,
			Alive:        true,
			ReverseProxy: proxy,
		}
	}

	return lb
}

// GetNextService returns next available service (Round Robin)
func (lb *LoadBalancer) GetNextService() *Service {
	lb.mu.Lock()
	defer lb.mu.Unlock()

	// Round-robin load balancing
	attempts := 0
	for attempts < len(lb.services) {
		idx := int(lb.current) % len(lb.services)
		lb.current++
		attempts++

		service := lb.services[idx]
		if service.IsAlive() {
			log.Printf("Selected service: %s", service.URL)
			return service
		}
	}
	return nil
}

// IsAlive checks if service is alive
func (s *Service) IsAlive() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.Alive
}

// SetAlive sets service alive status
func (s *Service) SetAlive(alive bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Alive = alive
}

// Health check for services
func healthCheck(services []*Service) {
	ticker := time.NewTicker(10 * time.Second)
	for range ticker.C {
		for _, service := range services {
			client := &http.Client{
				Timeout: 2 * time.Second,
			}
			resp, err := client.Get(service.URL.String() + "/health")
			if err != nil || resp.StatusCode != 200 {
				service.SetAlive(false)
				log.Printf("Service %s is DOWN", service.URL)
			} else {
				service.SetAlive(true)
				log.Printf("Service %s is UP", service.URL)
				resp.Body.Close()
			}
		}
	}
}

// Restaurant handlers
func restaurantHandler(w http.ResponseWriter, r *http.Request) {
	service := restaurantLB.GetNextService()
	if service == nil {
		http.Error(w, "No available restaurant services", http.StatusServiceUnavailable)
		return
	}
	log.Printf("Routing restaurant request [%s %s] to %s", r.Method, r.URL.Path, service.URL)
	service.ReverseProxy.ServeHTTP(w, r)
}

// Order handlers
func orderHandler(w http.ResponseWriter, r *http.Request) {
	service := orderLB.GetNextService()
	if service == nil {
		http.Error(w, "No available order services", http.StatusServiceUnavailable)
		return
	}
	log.Printf("Routing order request [%s %s] to %s", r.Method, r.URL.Path, service.URL)
	service.ReverseProxy.ServeHTTP(w, r)
}

// Health endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "healthy",
		"service": "gateway-server",
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8001"
	}

	// Initialize load balancers
	restaurantLB = NewLoadBalancer(restaurantServices)
	orderLB = NewLoadBalancer(orderServices)

	// Start health checks
	go healthCheck(restaurantLB.services)
	go healthCheck(orderLB.services)

	// Routes
	http.HandleFunc("/restaurants", restaurantHandler)
	http.HandleFunc("/restaurants/", restaurantHandler)
	http.HandleFunc("/orders", orderHandler)
	http.HandleFunc("/orders/", orderHandler)
	http.HandleFunc("/health", healthHandler)

	log.Printf("🚀 Gateway server starting on port %s", port)
	log.Printf("Restaurant services: %v", restaurantServices)
	log.Printf("Order services: %v", orderServices)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}