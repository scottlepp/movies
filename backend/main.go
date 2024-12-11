package main

import (
	"context"
	"log"

	"github.com/scottlepp/movies/movies"
)

func main() {
	movies.Init()

	ctx := context.Background()
	err := movies.Serve(ctx)
	if err != nil {
		log.Fatal("Failed to start the server: ", err)
		panic(err)
	}
}
