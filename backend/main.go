package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

var userCollection *mongo.Collection
var taskCollection *mongo.Collection
var jwtKey = []byte("super_secret_key")

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email    string             `json:"email" bson:"email"`
	Password string             `json:"password,omitempty" bson:"password"`
}

type Task struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email     string             `json:"email" bson:"email"`
	Title     string             `json:"title" bson:"title"`
	Completed bool               `json:"completed" bson:"completed"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
}

type Claims struct {
	Email string `json:"email"`
	jwt.RegisteredClaims
}

func main() {

	client, err := mongo.Connect(context.TODO(),
		options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}

	userCollection = client.Database("todoDB").Collection("users")
	taskCollection = client.Database("todoDB").Collection("tasks")

	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}))

	r.Post("/register", register)
	r.Post("/login", login)

	r.Group(func(r chi.Router) {
		r.Use(authMiddleware)
		r.Post("/task", addTask)
		r.Get("/tasks", getTasks)
		r.Put("/complete/{id}", completeTask)
		r.Delete("/delete/{id}", deleteTask)
		r.Get("/analytics", analytics)
	})

	log.Println("Server running on http://localhost:5000")
	log.Fatal(http.ListenAndServe(":5000", r))
}

func register(w http.ResponseWriter, r *http.Request) {
	var user User
	json.NewDecoder(r.Body).Decode(&user)

	if user.Email == "" || user.Password == "" {
		http.Error(w, "Email and Password required", 400)
		return
	}

	err := userCollection.FindOne(context.TODO(),
		bson.M{"email": user.Email}).Err()

	if err == nil {
		http.Error(w, "Email already exists", 400)
		return
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	user.Password = string(hash)

	userCollection.InsertOne(context.TODO(), user)
	w.Write([]byte("Registered Successfully"))
}

func login(w http.ResponseWriter, r *http.Request) {
	var input User
	var dbUser User

	json.NewDecoder(r.Body).Decode(&input)

	err := userCollection.FindOne(context.TODO(),
		bson.M{"email": input.Email}).Decode(&dbUser)

	if err != nil {
		http.Error(w, "User not found", 401)
		return
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(dbUser.Password),
		[]byte(input.Password),
	)

	if err != nil {
		http.Error(w, "Invalid password", 401)
		return
	}

	claims := &Claims{
		Email: dbUser.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString(jwtKey)

	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing token", 401)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims,
			func(token *jwt.Token) (interface{}, error) {
				return jwtKey, nil
			})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", 401)
			return
		}

		ctx := context.WithValue(r.Context(), "email", claims.Email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func addTask(w http.ResponseWriter, r *http.Request) {
	email := r.Context().Value("email").(string)

	var task Task
	json.NewDecoder(r.Body).Decode(&task)

	task.Email = email
	task.Completed = false
	task.CreatedAt = time.Now()

	taskCollection.InsertOne(context.TODO(), task)
	w.Write([]byte("Task Added"))
}

func getTasks(w http.ResponseWriter, r *http.Request) {
	email := r.Context().Value("email").(string)

	cursor, _ := taskCollection.Find(context.TODO(),
		bson.M{"email": email})

	var tasks []Task
	cursor.All(context.TODO(), &tasks)

	json.NewEncoder(w).Encode(tasks)
}

func completeTask(w http.ResponseWriter, r *http.Request) {
	email := r.Context().Value("email").(string)
	id := chi.URLParam(r, "id")

	objID, _ := primitive.ObjectIDFromHex(id)

	taskCollection.UpdateOne(context.TODO(),
		bson.M{"_id": objID, "email": email},
		bson.M{"$set": bson.M{"completed": true}},
	)

	w.Write([]byte("Completed"))
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	email := r.Context().Value("email").(string)
	id := chi.URLParam(r, "id")

	objID, _ := primitive.ObjectIDFromHex(id)

	taskCollection.DeleteOne(context.TODO(),
		bson.M{"_id": objID, "email": email},
	)

	w.Write([]byte("Deleted"))
}

func analytics(w http.ResponseWriter, r *http.Request) {
	email := r.Context().Value("email").(string)

	cursor, _ := taskCollection.Find(context.TODO(),
		bson.M{"email": email})

	var tasks []Task
	cursor.All(context.TODO(), &tasks)

	total := len(tasks)
	completed := 0

	for _, t := range tasks {
		if t.Completed {
			completed++
		}
	}

	percentage := 0
	if total > 0 {
		percentage = (completed * 100) / total
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"total":      total,
		"completed":  completed,
		"percentage": percentage,
	})
}