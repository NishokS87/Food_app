# Food Delivery Application - Startup Guide

## Architecture Overview

This food delivery application consists of:
- **Frontend (React)** - Port 3001
- **Backend API Server (Node.js/TypeScript)** - Port 3000 (communicates with frontend)
- **Backend Gateway Server (Go)** - Port 8001 (load balances microservices)
- **Restaurant Service** - Ports 5001, 5002 (2 instances)
- **Order Service** - Ports 6001, 6002 (2 instances)

## Starting All Services

### Option 1: PowerShell Script (Recommended)
```powershell
cd c:\Download\food_app\food-delivery-app
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\start-all.ps1
```

### Option 2: Manual Startup

#### 1. Start Microservices
```powershell
# Terminal 1 - Restaurant Service Instance 1
cd c:\Download\food_app\food-delivery-app\services\restaurant-service
node server.js

# Terminal 2 - Restaurant Service Instance 2
cd c:\Download\food_app\food-delivery-app\services\restaurant-service
$env:PORT=5002; node server.js

# Terminal 3 - Order Service Instance 1
cd c:\Download\food_app\food-delivery-app\services\order-service
node server.js

# Terminal 4 - Order Service Instance 2
cd c:\Download\food_app\food-delivery-app\services\order-service
$env:PORT=6002; node server.js
```

#### 2. Start Gateway Server (Go)
```powershell
# Terminal 5
cd c:\Download\food_app\food-delivery-app\backend-gateway-server\src
go run main.go
```

#### 3. Start API Server
```powershell
# Terminal 6
cd c:\Download\food_app\food-delivery-app\backend-api-server
npm start
```

#### 4. Start Frontend
```powershell
# Terminal 7
cd c:\Download\food_app\food-delivery-app\frontend
npm start
```

## Frontend Troubleshooting

If the frontend fails to start due to OpenSSL errors with Node.js v17+, use:

```powershell
cd c:\Download\food_app\food-delivery-app\frontend
$env:NODE_OPTIONS='--openssl-legacy-provider'
$env:PORT='3001'
npm start
```

## Verifying Services

Check health endpoints:
```powershell
# API Server
Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing

# Gateway Server
Invoke-WebRequest -Uri "http://localhost:8001/health" -UseBasicParsing

# Restaurant Service
Invoke-WebRequest -Uri "http://localhost:5001/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:5002/health" -UseBasicParsing

# Order Service
Invoke-WebRequest -Uri "http://localhost:6001/health" -UseBasicParsing
Invoke-WebRequest -Uri "http://localhost:6002/health" -UseBasicParsing
```

## Testing Load Balancing

Restaurant service load balancing:
```powershell
# Make multiple requests - should alternate between ports 5001 and 5002
Invoke-WebRequest -Uri "http://localhost:3000/api/restaurants" -UseBasicParsing
```

Order service load balancing:
```powershell
# Make multiple POST requests - should alternate between ports 6001 and 6002
$body = @{
    items = @(
        @{ name = "Burger"; quantity = 1; price = 9.99 }
    )
    total = 9.99
    customerInfo = @{
        name = "Test User"
        phone = "555-1234"
        address = "123 Test St"
    }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/orders" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing
```

## UI/UX Features

The frontend includes:
- **Home Page**: Browse restaurants with modern gradient design
- **Menu Page**: View restaurant menus with category filtering
- **Cart**: Add/remove items with quantity controls
- **Checkout**: Complete order form with delivery information
- **Order Tracking**: Real-time visual order status timeline

## API Endpoints

### Restaurants
- `GET /api/restaurants` - List all restaurants
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders/:id/track` - Track order status

## Technology Stack

- **Frontend**: React 17, TypeScript, React Router DOM
- **Backend API**: Node.js, Express, TypeScript
- **Gateway**: Go with reverse proxy and round-robin load balancing
- **Microservices**: Node.js, Express
- **Styling**: Modern CSS with gradients and animations
