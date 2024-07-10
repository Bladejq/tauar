import API from "../api/axios.config";

class OrderService {
    getOrders() {
      return API.get(`/orders`);
    }

    checkoutOrder(order) {
        return API.post(`/orders`, order);
    }
}

export default new OrderService();