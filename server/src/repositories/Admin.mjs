import pool from "../db.mjs";
import { hashPassword } from "../utils/helpers.mjs";

class AdminRepositories {
    static async getByEmail(email) {
        const response = await pool.query(
            "SELECT * FROM admins WHERE email=$1",
            [email]
        );
        if (!response.rows.length) {
            return null;
        }
        return response.rows[0];
    }

    static async addAdmin(admin) {
        const response = await pool.query(
            "INSERT INTO admins (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING id, email, firstname, lastname",
            [admin.email, admin.password, admin.firstname, admin.lastname]
        );
        return response.rows[0];
    }
}

export default AdminRepositories;
