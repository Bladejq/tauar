import { hashPassword, verifyPassword } from "../utils/helpers.mjs";
import LoginRepositories from "../repositories/Admin.mjs";

class AdminAuthService {
    static async login(email, password) {
        const admin = await LoginRepositories.getByEmail(email);

        if (!admin) {
            throw new Error("Admin not found");
        }

        const isPasswordValid = await verifyPassword(password, admin.password);

        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        return {
            id: admin.id,
            email: admin.email,
            firstname: admin.firstname,
            lastname: admin.lastname
        };
    }

    static async register(admin) {
        const existingAdmin = await LoginRepositories.getByEmail(admin.email);

        if (existingAdmin) {
            throw new Error("Admin with this email already exists");
        }

        const hashedPassword = await hashPassword(admin.password);
        const newAdmin = await LoginRepositories.addAdmin({
            ...admin,
            password: hashedPassword
        });

        return {
            id: newAdmin.id,
            email: newAdmin.email,
            firstname: newAdmin.firstname,
            lastname: newAdmin.lastname
        };
    }
}

export default AdminAuthService;
