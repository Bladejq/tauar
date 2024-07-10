import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CartButton = ({ count }) => {
  return (
    <div className="relative">
      <ShoppingCartIcon />
      {count > 0 && (
        <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex justify-center items-center text-white text-xs">
          {count}
        </div>
      )}
    </div>
  );
};

export default CartButton;
