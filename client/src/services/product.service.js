import API from "../api/axios.config"

class ProductService {
    getProducts() {
      return API.get(`/products`);
    }
    getProduct(id) {
      return API.get(`/products/${id}`);
    }
    getProductByName(name) {
      return API.get(`/products/${name}`);
    }

    getProductsByCategory(category) {
      return API.get(`/products/category/${category}`);
    }

    getCategories() {
      return API.get("/categories");
    }
  }
  
  export default new ProductService();