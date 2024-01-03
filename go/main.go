package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"
)

type FactResponse struct {
	YearOfBirth int    `json:"year_of_birth"`
	Fact        string `json:"fact"`
}

func readResponseBody(resp *http.Response) (string, error) {
	var body []byte
	// Read the response body into the 'body' slice
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

func getFactAboutYear(year int) (string, error) {
	// Query the Numbers API for a fact about the year
	url := fmt.Sprintf("http://numbersapi.com/%d/year", year)
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Read and log the response
	body, err := readResponseBody(resp)
	if err != nil {
		return "", err
	}

	return body, nil
}

func getFactHandler(w http.ResponseWriter, r *http.Request) {
	// Parse the age from the query parameter
	ageParam := r.URL.Query().Get("age")
	age, err := strconv.Atoi(ageParam)
	if err != nil {
		http.Error(w, "Invalid age parameter", http.StatusBadRequest)
		return
	}

	// Calculate the year of birth based on the current year and age
	currentYear := time.Now().Year()
	yearOfBirth := currentYear - age

	// Get a fact about the year from the Numbers API
	fact, err := getFactAboutYear(yearOfBirth)
	if err != nil {
		http.Error(w, "Error fetching fact", http.StatusInternalServerError)
		return
	}

	// Create the response
	response := FactResponse{
		YearOfBirth: yearOfBirth,
		Fact:        fact,
	}

	// Convert the response to JSON and send it
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	// Register the handler for the /getFact endpoint
	http.HandleFunc("/getFact", getFactHandler)

	// Start the server on port 8080
	fmt.Println("Go Server listening on http://127.0.0.1:8080/")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
