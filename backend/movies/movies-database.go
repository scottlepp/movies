package movies

import (
	"context"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func getDB(ctx context.Context) (*gorm.DB, error) {
	if db == nil {
		return initDB(ctx)
	}
	return db, nil
}

func initDB(ctx context.Context) (*gorm.DB, error) {
	_, span := tracer.Start(ctx, "initDB")
	defer span.End()

	log.Println("Connecting to Database")

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", host, user, password, dbname, port)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database: ", err)
		return nil, err
	}

	log.Println("connected to Database")

	err = db.AutoMigrate(&Movie{})
	if err != nil {
		log.Fatal("Failed to auto migrate: ", err)
		return nil, err
	}
	return db, nil
}
