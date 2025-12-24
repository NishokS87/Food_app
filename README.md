# Food Delivery Application

## Overview
This project is a food delivery application that consists of a frontend built with React and two backend servers: one for the API and another as a gateway server. The gateway server handles load balancing and communication between the frontend and the API server.

## Project Structure
```
food-delivery-app
├── frontend                # Frontend application
│   ├── src                 # Source files for the frontend
│   ├── package.json        # Frontend dependencies and scripts
│   └── tsconfig.json       # TypeScript configuration for the frontend
├── backend-api-server      # Backend API server
│   ├── src                 # Source files for the API server
│   ├── package.json        # API server dependencies and scripts
│   └── tsconfig.json       # TypeScript configuration for the API server
├── backend-gateway-server   # Backend gateway server
│   ├── src                 # Source files for the gateway server
│   ├── go.mod              # Go module dependencies
│   └── go.sum              # Go module checksums
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js and npm (for the frontend and backend API server)
- Go (for the backend gateway server)
- Docker (for container orchestration)

### Installation

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd food-delivery-app
   ```

2. **Frontend Setup:**
   - Navigate to the frontend directory:
     ```
     cd frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```

3. **Backend API Server Setup:**
   - Navigate to the backend API server directory:
     ```
     cd ../backend-api-server
     ```
   - Install dependencies:
     ```
     npm install
     ```

4. **Backend Gateway Server Setup:**
   - Navigate to the backend gateway server directory:
     ```
     cd ../backend-gateway-server
     ```
   - Initialize Go modules:
     ```
     go mod tidy
     ```

### Running the Application

- **Using Docker Compose:**
  From the root of the project, run:
  ```
  docker-compose up
  ```

- **Without Docker:**
  - Start the backend API server:
    ```
    cd backend-api-server
    npm start
    ```
  - Start the backend gateway server:
    ```
    cd ../backend-gateway-server
    go run main.go
    ```
  - Start the frontend application:
    ```
    cd ../frontend
    npm start
    ```

## Usage
- Access the application in your web browser at `http://localhost:3000`.
- The application allows users to browse restaurants, view menus, add items to their cart, and track their orders.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.