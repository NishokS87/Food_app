import { Router } from 'express';
import RestaurantController from '../controllers/restaurantController';
import OrderController from '../controllers/orderController';
import UserController from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();
const restaurantController = new RestaurantController();
const orderController = new OrderController();
const userController = new UserController();

router.get('/restaurants', restaurantController.getRestaurants);
router.post('/orders', authenticate, orderController.placeOrder);
router.get('/orders/:id', authenticate, orderController.trackOrder);
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);

export default router;