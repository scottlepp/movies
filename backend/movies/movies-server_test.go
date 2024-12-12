package movies

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func TestCreateMovie(t *testing.T) {
	r := setupRouter()

	movie := Movie{
		Title:       "Test Movie",
		Description: "Test Description",
		ReleaseDate: "2024-01-01",
		Genre:       "Drama",
		Director:    "Test Director",
		PosterURL:   "http://example.com/poster.jpg",
	}
	jsonBody, _ := json.Marshal(movie)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest("POST", "/movies", bytes.NewBuffer(jsonBody)))

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status OK, got %d", w.Code)
	}
}

func TestGetMovieByID(t *testing.T) {
	r := setupRouter()

	// Seed database with a movie
	movie := Movie{
		Title:       "Test Movie",
		Description: "Test Description",
		ReleaseDate: "2024-01-01",
		Genre:       "Drama",
		Director:    "Test Director",
		PosterURL:   "http://example.com/poster.jpg",
	}
	db.Create(&movie)

	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest("GET", "/movies/1", nil))

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status OK, got %d", w.Code)
	}
}

func TestGetMovies(t *testing.T) {
	r := setupRouter()
	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest("GET", "/movies", nil))

	if w.Code != http.StatusOK {
		t.Fatalf("Expected status OK, got %d", w.Code)
	}
}

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open(""), &gorm.Config{})
	db.AutoMigrate(&Movie{})
	return db
}

func setupRouter() *mux.Router {
	Init()
	initDB := func() {
		db = setupTestDB()
	}
	initDB()

	r := mux.NewRouter()
	r.HandleFunc("/movies", getMovies).Methods("GET")
	r.HandleFunc("/movies/{id}", getMovieByID).Methods("GET")
	r.HandleFunc("/movies", createMovie).Methods("POST")
	return r
}
