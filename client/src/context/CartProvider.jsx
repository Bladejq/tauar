import { useState, useEffect, useContext } from "react";
import CartContext from "./cart";
import cartService from "../services/cart.service";
import UserContext from "./user";
function CartProvider({ children }) {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState(null);

  useEffect(() => {
    if (user) {
      cartService
        .getCart()
        .then((response) => response.data)
        .then((data) => {
          setCart(data);
        });
    }
  }, [user]);

  function updateCart() {
    cartService
      .getCart()
      .then((response) => response.data)
      .then((data) => {
        setCart(data);
      });
  }

  return (
    <CartContext.Provider value={{ cart, updateCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
