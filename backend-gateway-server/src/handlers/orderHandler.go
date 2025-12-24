package handlers

import (
    "encoding/json"
    "net/http"
    "backend-gateway-server/src/services"
)

type OrderRequest struct {
    UserID    string `json:"userId"`
    RestaurantID string `json:"restaurantId"`
    Items     []OrderItem `json:"items"`
}

type OrderItem struct {
    MenuItemID string `json:"menuItemId"`
    Quantity   int    `json:"quantity"`
}

func HandleOrder(w http.ResponseWriter, r *http.Request) {
    var orderRequest OrderRequest

    if err := json.NewDecoder(r.Body).Decode(&orderRequest); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    response, err := services.PlaceOrder(orderRequest)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(response)
}