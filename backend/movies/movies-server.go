package movies

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

// metrics
var (
	httpRequests = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "endpoint"},
	)
)

// tracing
var tracer trace.Tracer

// Init initializes the observability instrumentation
func Init() {
	if (tracer) != nil {
		return
	}
	// capture metrics
	prometheus.MustRegister(httpRequests)
	// init tracing
	initTracer()
}

func initTracer() {
	exporter, err := stdouttrace.New(stdouttrace.WithPrettyPrint())
	if err != nil {
		log.Fatalf("Failed to initialize stdout trace exporter: %v", err)
	}

	// Set global tracer provider
	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
	)
	otel.SetTracerProvider(tp)

	tracer = tp.Tracer("movie-backend")
}

// Serve starts the movies server
func Serve(ctx context.Context) error {
	err := initDB(ctx)
	if err != nil {
		return err
	}
	r := mux.NewRouter()
	r.HandleFunc("/movies", getMovies).Methods("GET")
	r.HandleFunc("/movies/{id}", getMovieByID).Methods("GET")
	r.HandleFunc("/movies", createMovie).Methods("POST")

	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	allowed := strings.Split(allowedOrigins, ",")
	// Apply CORS settings
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins(allowed),
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	log.Println("Server started on :5000")
	return http.ListenAndServe(":5000", corsHandler(r))
}

type Movie struct {
	ID          uint   `gorm:"primaryKey"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ReleaseDate string `json:"release_date"`
	Genre       string `json:"genre"`
	Director    string `json:"director"`
	PosterURL   string `json:"poster_url"`
}

func getMovies(w http.ResponseWriter, r *http.Request) {
	_, span := tracer.Start(r.Context(), "getMovies")
	defer span.End()
	var movies []Movie
	tx := db.Find(&movies)
	if tx.Error != nil {
		log.Println("Error: ", tx.Error)
		http.Error(w, "Failed to fetch movies", http.StatusInternalServerError)
		return
	}
	err := json.NewEncoder(w).Encode(movies)
	if err != nil {
		log.Println("Error: ", err)
		return
	}
}

func getMovieByID(w http.ResponseWriter, r *http.Request) {
	_, span := tracer.Start(r.Context(), "getMovieByID")
	defer span.End()
	params := mux.Vars(r)
	var movie Movie
	if err := db.First(&movie, params["id"]).Error; err != nil {
		log.Println("Error: ", err)
		http.Error(w, "Movie not found", http.StatusNotFound)
		return
	}
	err := json.NewEncoder(w).Encode(movie)
	if err != nil {
		log.Println("Error: ", err)
		return
	}
}

func createMovie(w http.ResponseWriter, r *http.Request) {
	_, span := tracer.Start(r.Context(), "createMovie")
	defer span.End()
	var movie Movie
	if err := json.NewDecoder(r.Body).Decode(&movie); err != nil {
		log.Println("Error: ", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	if err := db.Create(&movie).Error; err != nil {
		log.Println("Error: ", err)
		http.Error(w, "Failed to create movie", http.StatusInternalServerError)
		return
	}
	err := json.NewEncoder(w).Encode(movie)
	if err != nil {
		log.Println("Error: ", err)
		return
	}
}
