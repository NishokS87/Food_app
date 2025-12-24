const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 6001;

app.use(cors());
app.use(express.json());

// In-memory order storage
const orders = new Map();
let orderCounter = 1;

// Order status enum
const OrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Create new order
app.post('/orders', (req, res) => {
  console.log(`[${PORT}] POST /orders`, req.body);
  
  const { customerId, restaurantId, items, deliveryAddress, totalAmount } = req.body;
  
  if (!customerId || !restaurantId || !items || !deliveryAddress) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }
  
  const orderId = `ORD-${String(orderCounter).padStart(6, '0')}`;
  orderCounter++;
  
  const order = {
    id: orderId,
    customerId,
    restaurantId,
    items,
    deliveryAddress,
    totalAmount: totalAmount || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    status: OrderStatus.PENDING,
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 40 * 60000).toISOString()
  };
  
  orders.set(orderId, order);
  
  // Simulate order status progression
  setTimeout(() => updateOrderStatus(orderId, OrderStatus.CONFIRMED), 2000);
  setTimeout(() => updateOrderStatus(orderId, OrderStatus.PREPARING), 5000);
  setTimeout(() => updateOrderStatus(orderId, OrderStatus.OUT_FOR_DELIVERY), 10000);
  
  res.status(201).json({
    success: true,
    data: order,
    server: `order-service:${PORT}`
  });
});

// Get order by ID
app.get('/orders/:id', (req, res) => {
  console.log(`[${PORT}] GET /orders/${req.params.id}`);
  
  const order = orders.get(req.params.id);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      error: 'Order not found' 
    });
  }
  
  res.json({
    success: true,
    data: order,
    server: `order-service:${PORT}`
  });
});

// Track order
app.get('/orders/:id/track', (req, res) => {
  console.log(`[${PORT}] GET /orders/${req.params.id}/track`);
  
  const order = orders.get(req.params.id);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      error: 'Order not found' 
    });
  }
  
  const trackingInfo = {
    orderId: order.id,
    status: order.status,
    estimatedDelivery: order.estimatedDelivery,
    currentLocation: getTrackingLocation(order.status),
    statusHistory: [
      { status: OrderStatus.PENDING, timestamp: order.createdAt },
      ...(order.confirmedAt ? [{ status: OrderStatus.CONFIRMED, timestamp: order.confirmedAt }] : []),
      ...(order.preparingAt ? [{ status: OrderStatus.PREPARING, timestamp: order.preparingAt }] : []),
      ...(order.outForDeliveryAt ? [{ status: OrderStatus.OUT_FOR_DELIVERY, timestamp: order.outForDeliveryAt }] : [])
    ]
  };
  
  res.json({
    success: true,
    data: trackingInfo,
    server: `order-service:${PORT}`
  });
});

// Get all orders for a customer
app.get('/orders/customer/:customerId', (req, res) => {
  console.log(`[${PORT}] GET /orders/customer/${req.params.customerId}`);
  
  const customerOrders = Array.from(orders.values())
    .filter(order => order.customerId === req.params.customerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({
    success: true,
    data: customerOrders,
    server: `order-service:${PORT}`
  });
});

// Cancel order
app.put('/orders/:id/cancel', (req, res) => {
  console.log(`[${PORT}] PUT /orders/${req.params.id}/cancel`);
  
  const order = orders.get(req.params.id);
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      error: 'Order not found' 
    });
  }
  
  if (order.status === OrderStatus.OUT_FOR_DELIVERY || order.status === OrderStatus.DELIVERED) {
    return res.status(400).json({ 
      success: false, 
      error: 'Cannot cancel order in current status' 
    });
  }
  
  order.status = OrderStatus.CANCELLED;
  order.cancelledAt = new Date().toISOString();
  
  res.json({
    success: true,
    data: order,
    server: `order-service:${PORT}`
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'order-service',
    port: PORT,
    totalOrders: orders.size
  });
});

// Helper function to update order status
function updateOrderStatus(orderId, status) {
  const order = orders.get(orderId);
  if (order && order.status !== OrderStatus.CANCELLED) {
    order.status = status;
    
    switch (status) {
      case OrderStatus.CONFIRMED:
        order.confirmedAt = new Date().toISOString();
        break;
      case OrderStatus.PREPARING:
        order.preparingAt = new Date().toISOString();
        break;
      case OrderStatus.OUT_FOR_DELIVERY:
        order.outForDeliveryAt = new Date().toISOString();
        break;
      case OrderStatus.DELIVERED:
        order.deliveredAt = new Date().toISOString();
        break;
    }
    
    console.log(`Order ${orderId} status updated to: ${status}`);
  }
}

// Helper function to get tracking location based on status
function getTrackingLocation(status) {
  const locations = {
    [OrderStatus.PENDING]: 'Order received',
    [OrderStatus.CONFIRMED]: 'Restaurant confirmed',
    [OrderStatus.PREPARING]: 'Kitchen is preparing your food',
    [OrderStatus.OUT_FOR_DELIVERY]: 'Driver is on the way',
    [OrderStatus.DELIVERED]: 'Delivered',
    [OrderStatus.CANCELLED]: 'Order cancelled'
  };
  return locations[status] || 'Unknown';
}

app.listen(PORT, () => {
  console.log(`📦 Order Service running on port ${PORT}`);
});
