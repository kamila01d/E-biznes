package main

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
)

type Item struct {
	gorm.Model
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

func createItem(c echo.Context) error {
	var item Item
	if err := c.Bind(&item); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	db.Create(&item)
	return c.JSON(http.StatusCreated, item)
}

func fetchAllItems(c echo.Context) error {
	var items []Item
	db.Find(&items)
	return c.JSON(http.StatusOK, items)
}

func fetchItem(c echo.Context) error {
	id := c.Param("id")
	var item Item
	if err := db.First(&item, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Item not found")
	}
	return c.JSON(http.StatusOK, item)
}

func modifyItem(c echo.Context) error {
	id := c.Param("id")
	var item Item
	if err := db.First(&item, id).Error; err != nil {
		return c.JSON(http.StatusNotFound,
