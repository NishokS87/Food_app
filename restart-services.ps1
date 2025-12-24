# Restart Services Script
Write-Host "🔄 Restarting all services..." -ForegroundColor Green

# Kill existing node and go processes
Write-Host "Stopping existing services..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "Restaurant Service|Order Service|API Server" } | Stop-Process -Force
Get-Process -Name "go" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowTitle -match "Gateway Server" } | Stop-Process -Force

Start-Sleep -Seconds 2

# Update PATH for Go
$env:Path = "C:\Program Files\Go\bin;" + $env:Path

# Function to start service in new window
function Start-ServiceInNewWindow {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory
    )
    
    Write-Host "Starting $Title..." -ForegroundColor Cyan
    $escapedCommand = "cd '$WorkingDirectory'; Write-Host '=== $Title ===' -ForegroundColor Yellow; $Command"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $escapedCommand
}

# Start Restaurant Service 1
Start-ServiceInNewWindow -Title "Restaurant Service 1" -Command "node server.js" -WorkingDirectory "c:\Download\food_app\food-delivery-app\services\restaurant-service"

Start-Sleep -Seconds 2

# Start Restaurant Service 2
$cmd2 = '$env:PORT="5002"; node server.js'
Start-ServiceInNewWindow -Title "Restaurant Service 2" -Command $cmd2 -WorkingDirectory "c:\Download\food_app\food-delivery-app\services\restaurant-service"

Start-Sleep -Seconds 2

# Start Order Service 1
Start-ServiceInNewWindow -Title "Order Service 1" -Command "node server.js" -WorkingDirectory "c:\Download\food_app\food-delivery-app\services\order-service"

Start-Sleep -Seconds 2

# Start Order Service 2
$cmd4 = '$env:PORT="6002"; node server.js'
Start-ServiceInNewWindow -Title "Order Service 2" -Command $cmd4 -WorkingDirectory "c:\Download\food_app\food-delivery-app\services\order-service"

Start-Sleep -Seconds 2

# Start Gateway Server
$cmd5 = '$env:Path = "C:\Program Files\Go\bin;" + $env:Path; go run src/main.go'
Start-ServiceInNewWindow -Title "Gateway Server" -Command $cmd5 -WorkingDirectory "c:\Download\food_app\food-delivery-app\backend-gateway-server"

Start-Sleep -Seconds 3

# Start API Server
Start-ServiceInNewWindow -Title "API Server (Frontend Facing)" -Command "npm run dev" -WorkingDirectory "c:\Download\food_app\food-delivery-app\backend-api-server"

Write-Host ""
Write-Host "✅ All services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Service URLs:" -ForegroundColor Yellow
Write-Host "   API Server:         http://localhost:3000" -ForegroundColor White
Write-Host "   Gateway Server:     http://localhost:8001" -ForegroundColor White
Write-Host "   Restaurant Svc 1:   http://localhost:5001" -ForegroundColor White
Write-Host "   Restaurant Svc 2:   http://localhost:5002" -ForegroundColor White
Write-Host "   Order Svc 1:        http://localhost:6001" -ForegroundColor White
Write-Host "   Order Svc 2:        http://localhost:6002" -ForegroundColor White
Write-Host ""
Write-Host "Frontend should already be running on http://localhost:3001" -ForegroundColor Cyan

