import pool from "../db.mjs";
import CartRepository from "./Cart.mjs";

class ProductRepository {
  static async getProducts(user) {
    let response = await pool.query("SELECT * FROM products");
    let products = response.rows;
    if (user) {
      const cartProducts = await CartRepository.getCartProducts(user);
      products = products.map((product) => {
        return {
          ...product,
          inCart: cartProducts.find((p) => p.id == product.id) != null,
        };
      });
    }

    if (!products.length) {
      return null;
    }

    return products;
  }

  static async getProductById(id, user) {
    let response = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (!response.rows.length) {
      return null;
    }

    let product = response.rows[0];

    if (user) {
      const cartProducts = await CartRepository.getCartProducts(user);
      const cartProduct = cartProducts.find((p) => p.id == product.id);
      if (cartProduct) {
        product = { ...product, inCart: true, quantity: cartProduct.quantity };
      }
    }

    return product;
  }

  static async getProductsByIds(ids) {
    const response = await pool.query(
      "SELECT * FROM products WHERE id = ANY ($1)",
      [ids]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async getProductsByTitle(title) {
    const response = await pool.query(
      `SELECT * FROM products WHERE title ILIKE $1`,
      [`${title}%`]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async getProductsByCategory(category, user) {
    const response = await pool.query(
      "SELECT * FROM products WHERE category = $1",
      [category]
    );

    let products = response.rows;
    if (user) {
      const cartProducts = await CartRepository.getCartProducts(user);
      products = products.map((product) => {
        return {
          ...product,
          inCart: cartProducts.find((p) => p.id == product.id) != null,
        };
      });
    }

    if (!products.length) {
      return null;
    }

    return products;
  }

  static async getProductsByCategories(categories) {
    const response = await pool.query(
      "SELECT * FROM products WHERE category = ANY($1)",
      [categories]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async getProductsByPrice(from, to) {
    const response = await pool.query(
      "SELECT * FROM products WHERE price BETWEEN $1 AND $2",
      [from, to]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async getProductsByRating(from) {
    const response = await pool.query(
      "SELECT * FROM products WHERE price > $1",
      [from]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async getProductsByBrands(brands) {
    const response = await pool.query(
      "SELECT * FROM products WHERE brand = ANY($1)",
      [brands]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async getBrands() {
    const response = await pool.query("SELECT DISTINCT brand FROM products");

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async getCategories() {
    const response = await pool.query("SELECT DISTINCT category FROM products");

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async sortByPrice(asc) {
    let query = "SELECT * FROM products ORDER BY price";
    if (!asc) {
      query += " DESC";
    }
    const response = await pool.query(query);

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async sortByTitle(asc) {
    const response = await pool.query(
      "SELECT * FROM products ORDER BY title $1",
      [asc ? "ASC" : "DESC"]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows;
  }

  static async addProduct(product) {
    const response = await pool.query(
      "INSERT INTO products (title, description, price, thumbnail, images, category, brand, stock, discount_percentage, rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        product.title,
        product.description,
        product.price,
        product.thumbnail,
        product.images,
        product.category,
        product.brand,
        product.stock,
        product.discountPercentage,
        product.rating 
      ]
    );
  

    if (!response.rows.length) {
      return null;
    }

    return response.rows[0];
  }

  static async updateProduct(id, product) {
    const response = await pool.query(
      "UPDATE products SET title = $1, description = $2, price = $3, thumbnail = $4, images = $5, category = $6, brand = $7, stock = $8, discount_percentage = $9 WHERE id = $10 RETURNING *",
      [
        product.title,
        product.description,
        product.price,
        product.thumbnail,
        product.images,
        product.category,
        product.brand,
        product.stock,
        product.discountPercentage,
        id,
      ]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows[0];
  }

  static async deleteProduct(id) {
    const response = await pool.query("DELETE FROM products WHERE id = $1", [
      id,
    ]);

    if (!response.rows.length) {
      return null;
    }

    return response.rows[0];
  }
}

export default ProductRepository;
