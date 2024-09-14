package main

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"net/http"
)

type ShoppingCart struct {
	gorm.Model
	Items []Item `gorm:"many2many:cart_items;"`
}

func newCart(c echo.Context) error {
	var shoppingCart ShoppingCart
	if err := c.Bind(&shoppingCart); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	db.Create(&shoppingCart)
	return c.JSON(http.StatusCreated, shoppingCart)
}

type AddItemRequest struct {
	ProductID int    `json:"product_id"`
	CartID    string `json:"cart_id"`
}

func appendToCart(c echo.Context) error {
	req := new(AddItemRequest)
	if err := c.Bind(req); err != nil {
		return c.JSON(http.StatusBadRequest, "Invalid input")
	}

	productID := req.ProductID
	cartID := req.CartID

	var item Item
	if err := db.First(&item, productID).Error; err != nil {
		return c.JSON(http.StatusNotFound, "Item not found")
	}

	var shoppingCart ShoppingCart
	if cartID == "" {
		shoppingCart = ShoppingCart{}
		db.Create(&shoppingCart)
		cartID = fmt.Sprintf("%d", shoppingCart.ID)
	} else {
		if err := db.First(&shoppingCart, cartID).Error; err != nil {
			return c.JSON(http.StatusNotFound, "Shopping cart not found")
		}
	}

	db.Model(&shoppingCart).Association("Items").Append(&item)

	return c.JSON(http.StatusOK, map[string]interface{}{
		"cart_id": shoppingCart.ID,
		"cart":    shoppingCart
