import { Router } from "express";
import { body, validationResult } from "express-validator";
import CartRepository from "../repositories/Cart.mjs";
import ProductRepository from "../repositories/Product.mjs";
import OrderRepository from "../repositories/Order.mjs";
const router = Router();

router.post("/orders", body().notEmpty().withMessage("Order details missing"), async (req, res) => {
    if (!req.user) {
        return res.status(401);
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send(result.array());
    }
    const cartProducts = await CartRepository.getCartProducts(req.user);
    const newOrder = await OrderRepository.createOrder(req.user, cartProducts, req.body)
    await CartRepository.clearCart(req.user);
    return res.status(200).send(newOrder); // verificationCode будет включен в newOrder
});



router.get("/orders", async (req, res) => {
    if (!req.user) {
        const orders = await OrderRepository.getAllOrders();
        return res.status(200).send(orders);
    } else {
        const orders = await OrderRepository.getOrders(req.user);
        return res.status(200).send(orders);
    }
});


router.patch("/orders/:orderId/status", async (req, res) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    try {
        const updatedOrder = await OrderRepository.editOrderStatus(orderId, newStatus);
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error.message); 
        res.status(400).json({ message: error.message });
    }
});



export default router;