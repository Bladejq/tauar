import ProductRepository from "../repositories/Product.mjs";

export default class ProductsController {
    static async getProducts() { 
        const products = await ProductRepository.getProducts();
        return products;
    }

    static async getProductById(id) { 
        const product = await ProductRepository.getProductById(id);
        return product;
    }
}