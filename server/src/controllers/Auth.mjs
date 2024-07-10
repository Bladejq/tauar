import UserRepository from "../repositories/User.mjs";
import CartRepository from "../repositories/Cart.mjs";

export default class AuthController {
    static async register(user) { 
        const newUser = await UserRepository.addUser(user);
        const cart = await CartRepository.createCart(newUser);
        return newUser;
    }
}