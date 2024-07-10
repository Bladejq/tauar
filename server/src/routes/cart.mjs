import { Router } from "express";
import { body, validationResult } from "express-validator";
import CartRepository from "../repositories/Cart.mjs";
import ProductRepository from "../repositories/Product.mjs";
const router = Router();

router.get("/cart", async (req, res) => {
  if (!req.user) {
    return res.status(401);
  }
  const cart = await CartRepository.getCartProducts(req.user);
  return res.status(200).send(cart);
});

router.post(
  "/cart",
  body().notEmpty().withMessage("Cart must not be empty."),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).send("Authorize to a product add to cart");
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    const userCart = await CartRepository.getCart(req.user);
    const { id, quantity = 1 } = req.body;
    const addedProduct = await CartRepository.addProduct(
      userCart.id,
      id,
      quantity
    );
    const product = await ProductRepository.getProductById(id);
    const cartItem = {
      ...product,
      quantity: addedProduct.quantity,
      inCart: true
    };
    return res.status(200).send(cartItem);
  }
);

router.patch("/cart/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401);
  }
  const { id } = req.params;
  const { quantity } = req.body;
  const cart = await CartRepository.getCart(req.user);
  await CartRepository.updateCartProduct(id, cart.id, quantity);
  const cartProducts = await CartRepository.getCartProducts(req.user);
  return res.status(200).send(cartProducts);
});

router.delete("/cart/:id", async (req, res) => {
  if (!req.user) {
    return res.status(401);
  }
  const { id } = req.params;
  const cart = await CartRepository.getCart(req.user);
  await CartRepository.deleteCartProduct(id, cart.id);
  const cartProducts = await CartRepository.getCartProducts(req.user);
  return res.status(200).send(cartProducts);
});

router.delete("/cart", async (req, res) => {
  if (!req.user) {
    return res.status(401);
  }
  const cart = await CartRepository.getCart(req.user);
  await CartRepository.clearCart(cart.id);
  return res.sendStatus(200);
});

export default router;
