import pool from "../db.mjs";
import { hashPassword } from "../utils/helpers.mjs";

class UserRepository {

  static async getById(id) {
    const response = await pool.query(
      "SELECT id, email, firstname, lastname FROM users WHERE id=$1",
      [id]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows[0];
  }

  static async getByEmail(email) {
    const response = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!response.rows.length) {
      return null;
    }

    return response.rows[0];
  }

  static async addUser(user) {
    const hashedPassword = hashPassword(user.password);
    const response = await pool.query(
      "INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING id, email, firstname, lastname",
      [user.email, hashedPassword, user.firstname, user.lastname]
    );
    return response.rows[0];
  }

  static async getUserData(email) {
    const response = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (!response.rows.length) {
      return null;
    }

    return response.rows[0];
  }
}

export default UserRepository;