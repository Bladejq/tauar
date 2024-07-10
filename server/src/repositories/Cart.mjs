import pool from "../db.mjs";

class CartRepository {
    static async createCart(user) {
        const response = await pool.query(
            "INSERT INTO user_cart (user_id) VALUES ($1) RETURNING *",
            [user.id]
        );
        if (!response.rows.length) {
            return null;
        }
        return response.rows[0];
    }

    static async getCart(user) {
        const response = await pool.query(
            "SELECT * FROM user_cart WHERE user_id = $1",
            [user.id]
        );
        if (!response.rows.length) {
            return null;
        }
        return response.rows[0];
    }
    static async getCartProducts(user) {
        const response = await pool.query(
            "SELECT p.*, cp.* FROM cart_product cp JOIN products p ON cp.product_id = p.id WHERE cp.cart_id = (SELECT id FROM user_cart WHERE user_id = $1)",
            [user.id]
        );

        return response.rows;
    }

    static async addProduct(cartId, productId, quantity) { 
        const response = await pool.query(
            "INSERT INTO cart_product (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
            [cartId, productId, quantity]
        );
        if (!response.rows.length) {
            return null;
        }
        return response.rows[0];
    }

    static async updateCartProduct(productId, cartId, quantity) {
        const response = await pool.query(
            "UPDATE cart_product SET quantity = $1 where product_id = $2 and cart_id = $3",
            [quantity, productId, cartId]
        );
        if (!response.rows.length) {
            return null;
        }
        return response.rows[0];
    }

    static async deleteCartProduct(productId, cartId) { 
        const response = await pool.query(
            "DELETE FROM cart_product WHERE product_id = $1 and cart_id = $2",
            [productId, cartId]
        );
        if (!response.rows.length) {
            return null;
        }
        return response.rows[0];
    }

    static async clearCart(user) {
        const userCart = await CartRepository.getCart(user);
        const response = await pool.query(
            "DELETE FROM cart_product WHERE cart_id = $1",
            [userCart.id]
        );
        if (!response.rows.length) {
            return null;
        }
        return response.rows[0];
    }
}
export default CartRepository;