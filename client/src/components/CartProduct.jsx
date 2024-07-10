import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

function formatPrice(price) {
  const parts = price.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return formattedIntegerPart + decimalPart;
}

function CartProduct({ product, update, remove }) {
  const [quantity, setQuantity] = useState(product.quantity);

  // Handle quantity changes from the input field
  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 0) { // Ensure non-negative values
      setQuantity(value);
      update(product.id, value);
    }
  };

  // Handle increment
  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    update(product.id, newQuantity);
  };

  // Handle decrement
  const decrementQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      update(product.id, newQuantity);
    }
  };

  return (
    <div className="w-full border-t border-b py-2">
      <div className="w-full">
        <div className="flex w-full space-x-2 items-center">
          <div>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-[100px] object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-bold">{product.title}</p>
            <p className="text-sm">{product.brand}</p>
            <p className="font-semibold flex items-center">
              {formatPrice(product.price)}{" "} ₸
              <span className="text-slate-600 text-sm flex items-center ml-2">
                <CloseIcon style={{ width: "14px", marginRight: "4px" }} />{quantity}
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-end w-full">
          <div className="flex text-sm space-x-1 p-1 h-max items-center">
            <button 
              className="rounded px-1 flex items-center justify-center transition hover:bg-gray-200"
              onClick={() => remove(product.id)}
            >
              <DeleteIcon style={{ width: "18px" }} />
            </button>
            <button 
              className="rounded px-1 flex items-center justify-center transition hover:bg-gray-200"
              onClick={decrementQuantity}
              disabled={quantity === 0} 
            >
              <RemoveIcon style={{ width: "14px" }} />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-16 border border-slate-400 rounded px-2 text-center no-arrows"
              min="0"
            />
            <button 
              className="rounded px-1 flex items-center justify-center transition hover:bg-gray-200"
              onClick={incrementQuantity}
            >
              <AddIcon style={{ width: "14px" }} />
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          .no-arrows::-webkit-outer-spin-button,
          .no-arrows::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          
          .no-arrows {
            -moz-appearance: textfield;
          }

          .hover\\:bg-gray-200:hover {
            background-color: #e5e7eb; 
          }
        `}
      </style>
    </div>
  );
}

export default CartProduct;
