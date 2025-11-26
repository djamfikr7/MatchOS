package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"sort"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// User entity (Provider)
type User struct {
	ID     string         `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Email  string
	Role   string
	Skills pq.StringArray `gorm:"type:text[]"`
}

func (User) TableName() string {
	return "users"
}

// Request entity
type Request struct {
	ID          string `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	Title       string
	Description string
	Location    string
	Budget      float64
	Status      string
	UserId      string
}

func (Request) TableName() string {
	return "request"
}

var db *gorm.DB

func main() {
	// Database connection string
	dsn := "host=localhost user=matchos password=devpass dbname=matchos_db port=5433 sslmode=disable"
	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Initialize Gin
	r := gin.Default()

	// CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "MatchOS Matching Engine 🐹 (AI Enabled)"})
	})

	r.POST("/matches", findMatches)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3003"
	}

	log.Println("Matching Engine running on port " + port)
	r.Run(":" + port)
}

type MatchRequest struct {
	RequestId string `json:"requestId"`
}

type AIResponse struct {
	Score       float64 `json:"score"`
	Explanation string  `json:"explanation"`
}

type ScoredProvider struct {
	User  User    `json:"user"`
	Score float64 `json:"score"`
}

func findMatches(c *gin.Context) {
	var input MatchRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println("Received matching request for ID:", input.RequestId)

	// 1. Get the Request
	var req Request
	if result := db.First(&req, "id = ?", input.RequestId); result.Error != nil {
		log.Println("Error finding request:", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
		return
	}
	log.Println("Found request:", req.Title)

	// 2. Find Providers
	var providers []User
	// Fetch providers with their skills
	if result := db.Raw("SELECT id, email, role, skills FROM users WHERE role = 'provider'").Scan(&providers); result.Error != nil {
		log.Println("Error finding providers:", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch providers"})
		return
	}
	log.Println("Found providers:", len(providers))

	// 3. Score Providers using AI Core
	var scoredProviders []ScoredProvider

	for _, provider := range providers {
		score := 0.0

		// Prepare payload for AI Core
		aiPayload := map[string]interface{}{
			"requestId":          req.ID,
			"providerId":         provider.ID,
			"requestDescription": req.Description + " " + req.Title, // Enrich context
			"providerSkills":     provider.Skills,
		}

		jsonData, _ := json.Marshal(aiPayload)
		resp, err := http.Post("http://localhost:3004/score", "application/json", bytes.NewBuffer(jsonData))
		if err == nil {
			defer resp.Body.Close()
			var aiResp AIResponse
			if err := json.NewDecoder(resp.Body).Decode(&aiResp); err == nil {
				score = aiResp.Score
			} else {
				log.Println("Error decoding AI response:", err)
			}
		} else {
			log.Println("Error calling AI Core:", err)
		}

		scoredProviders = append(scoredProviders, ScoredProvider{
			User:  provider,
			Score: score,
		})
	}

	// 4. Sort by Score (Descending)
	sort.Slice(scoredProviders, func(i, j int) bool {
		return scoredProviders[i].Score > scoredProviders[j].Score
	})

	// 5. Return matches
	c.JSON(http.StatusOK, gin.H{
		"request": req,
		"matches": scoredProviders,
	})
}
