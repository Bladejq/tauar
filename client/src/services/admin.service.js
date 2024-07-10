import API from "../api/admin.axios.config";

class AdminService {
    addProduct(product) {
        return API.post(`/products`, product);
    }

    listProducts() {
        return API.get(`/products`);
    }

    editProduct(product) {
        return API.patch(`/products/${product.id}`, { ...product, discountPercentage: product.discount_percentage });
    }

    deleteProduct(product) {
        return API.delete(`/products/${product.id}`);
    }

    viewOrders() {
        return API.get(`/orders`);
    }

    updateOrderStatus(orderId, newStatus) {
        return API.patch(`/orders/${orderId}/status`, { newStatus })
            .catch(error => {
                console.error("Error updating order status:", error.response.data);
                throw error; 
            });
    }
    
}

export default new AdminService();
