import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Gateway service URLs - Load balanced endpoints
const GATEWAY_URLS = [
  'http://localhost:8001'
];

let currentGatewayIndex = 0;

// Simple round-robin load balancer
function getNextGateway(): string {
  const gateway = GATEWAY_URLS[currentGatewayIndex];
  currentGatewayIndex = (currentGatewayIndex + 1) % GATEWAY_URLS.length;
  return gateway;
}

// Restaurant endpoints
app.get('/api/restaurants', async (req: Request, res: Response) => {
  try {
    const gateway = getNextGateway();
    const response = await axios.get(`${gateway}/restaurants`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

app.get('/api/restaurants/:id/menu', async (req: Request, res: Response) => {
  try {
    const gateway = getNextGateway();
    const response = await axios.get(`${gateway}/restaurants/${req.params.id}/menu`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Order endpoints
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const gateway = getNextGateway();
    const response = await axios.post(`${gateway}/orders`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/:id/track', async (req: Request, res: Response) => {
  try {
    const gateway = getNextGateway();
    const response = await axios.get(`${gateway}/orders/${req.params.id}/track`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'api-server' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});

export default app;