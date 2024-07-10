import API from "../api/axios.config";

class CartService {
  getCart() {
    return API.get(`/cart`);
  }

  addToCart(product) {
    return API.post(`/cart`, product);
  }

  removeFromCart(id) {
    return API.delete(`/cart/${id}`);
  }

  updateCart(id, quantity) {
    return API.patch(`/cart/${id}`, { quantity });
  }

  clearCart() {
    return API.delete(`/cart`);
  }
}

export default new CartService();
