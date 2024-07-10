import CartRepository from "../repositories/Cart.mjs";
import ProductRepository from "../repositories/Product.mjs";
import ProductsController from "./Products.mjs";

class CartController {
  async addProducts(products) {}

   static async getCart(user) {
      const cart = await CartRepository.getCartProductsByUserId(user.id);
      return cart;
  }


  static async addProduct(product, user) {
    console.log(user)
    const userCart = await CartRepository.getCartByUserId(user.id);
    const { id, quantity = 1 } = product;
    const addedProduct = await CartRepository.addProductToCart(
      userCart.id,
      id,
      quantity
    );
    const cartProduct = await ProductsController.getProductById(id); 
    return { product: cartProduct, quantity: addedProduct.quantity};
  }
}

export default CartController