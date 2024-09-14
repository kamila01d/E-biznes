package main

import (
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	server := echo.New()
	server.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE},
	}))

	initializeDatabase()

	server.POST("/items", createItem)
	server.GET("/items", fetchAllItems)
	server.GET("/items/:id", fetchItem)
	server.PUT("/items/:id", modifyItem)
	server.DELETE("/items/:id", removeItem)

	server.POST("/shopping_carts", newCart)
	server.GET("/shopping_carts/:id", fetchCart)
	server.POST("/shopping_carts/add", appendToCart)
	server.PUT("/shopping_carts/:id", modifyCart)
	server.DELETE("/shopping_carts/:id", removeCart)

	server.POST("/categories", createCategory)
	server.GET("/categories/:id", fetchCategory)
	server.PUT("/categories/:id", modifyCategory)
	server.DELETE("/categories/:id", removeCategory)
	server.GET("/categories/:category_id/items", getItemsByCategory)

	server.Logger.Fatal(server.Start(":8080"))
}

func initializeDatabase() {
	var err error
	dsn := "host=localhost user=user password=password dbname=dbname port=5432 sslmode=disable TimeZone=Europe/Warsaw"
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to the database")
	}

	err = db.AutoMigrate(&Item{}, &ShoppingCart{}, &ProductCategory{})
	if err != nil {
		return
	}
}
