package main

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type ProductCategory struct {
	gorm.Model
	CategoryName string  `json:"category_name"`
	Items        []Item  `gorm:"many2many:category_items;"`
}

func createCategory(c echo.Context) error {
	var productCategory ProductCategory
	if err := c.Bind(&productCategory); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	db.Create(&productCategory)
	return c.JSON(http.StatusCreated, productCategory)
}

func fetchCategory(c echo.Context) error {
	id := c.Param("id")
	var productCategory ProductCategory
	if err := db.Preload("Items").First(&productCategory, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Category not found")
	}
	return c.JSON(http.StatusOK, productCategory)
}

func ItemsByCategory(categoryID uint) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Joins("JOIN category_items ON category_items.item_id = items.id").
			Where("category_items.category_id = ?", categoryID)
	}
}

func modifyCategory(c echo.Context) error {
	id := c.Param("id")
	var productCategory ProductCategory
	if err := db.First(&productCategory, id).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Category not found")
	}

	if err := c.Bind(&productCategory); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	db.Save(&productCategory)
	return c.JSON(http.StatusOK, productCategory)
}

func removeCategory(c echo.Context) error {
	id := c.Param("id")
	db.Delete(&ProductCategory{}, id)
	return c.NoContent(http.StatusNoContent)
}

func getItemsByCategory(c echo.Context) error {
	categoryIDParam := c.Param("category_id")
	categoryID, err := strconv.ParseUint(categoryIDParam, 10, 64)
	if err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid category ID")
	}

	var items []Item
	db.Scopes(ItemsByCategory(uint(categoryID))).Find(&items)
	return c.JSON(http.StatusOK, items)
}
