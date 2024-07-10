import React, { useContext, useEffect, useState } from "react";
import cartService from "../services/cart.service";
import Skeleton from "@mui/material/Skeleton";
import CartContext from "../context/cart";
import { useNavigate } from "react-router-dom";

function formatPrice(price) {
  const parts = price.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return formattedIntegerPart + decimalPart;
}

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { updateCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    cartService
      .getCart()
      .then((res) => res.data)
      .then((data) => {
        setCart(data);
        setLoading(false);
        calculateTotal(data);
      });
  }, []);

  const calculateTotal = (cartItems) => {
    const newTotal = cartItems.reduce((acc, p) => acc + p.price * p.quantity, 0);
    setTotal(newTotal);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    cartService
      .updateCart(id, newQuantity)
      .then((res) => res.data)
      .then((data) => {
        setCart(data);
        updateCart();
        calculateTotal(data);
      });
  };

  const removeProduct = (id) => {
    cartService
      .removeFromCart(id)
      .then((res) => res.data)
      .then((data) => {
        setCart(data);
        updateCart();
        calculateTotal(data);
      });
  };

  return (
    <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">Сіздің себетіңіз</h1>
        </div>

        <div className="mx-auto mt-8 max-w-2xl md:mt-12">
          <div className="rounded-3xl bg-white shadow-lg">
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {loading ? (
                  <div className="flex justify-center items-center py-6">
                    <Skeleton variant="rounded" width={500} height={300} />
                  </div>
                ) : (
                  <ul className="-my-8">
                    {cart && cart.map((cartProduct) => (
                      <li key={cartProduct.id} className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
                        <div className="shrink-0 relative">
                          <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-sm font-medium text-gray-500 shadow sm:-top-2 sm:-right-2">{cartProduct.quantity}</span>
                          <img className="h-24 w-24 max-w-full rounded-lg object-cover" src={cartProduct.thumbnail} alt={cartProduct.name} />
                        </div>

                        <div className="relative flex flex-1 flex-col justify-between">
                          <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                            <div className="pr-8 sm:pr-5">
                              <p className="text-base font-semibold text-gray-900">{cartProduct.name}</p>
                              <p className="text-gray-600">{cartProduct.title}</p> {/* Added product title here */}
                              <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">{cartProduct.size}</p>
                              <div className="mt-2 flex items-center space-x-2">
                                <button onClick={() => handleQuantityChange(cartProduct.id, cartProduct.quantity - 1)} className="flex items-center justify-center rounded-full bg-gray-200 text-gray-600 w-6 h-6">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                  </svg>
                                </button>
                                <span>{cartProduct.quantity}</span>
                                <button onClick={() => handleQuantityChange(cartProduct.id, cartProduct.quantity + 1)} className="flex items-center justify-center rounded-full bg-gray-200 text-gray-600 w-6 h-6">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                              <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">₸ {formatPrice(cartProduct.price * cartProduct.quantity)}</p>
                            </div>
                          </div>

                          <div className="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
                            <button onClick={() => removeProduct(cartProduct.id)} type="button" className="flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900">
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 space-y-3 border-t border-b py-8">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Аралық қорытынды</p>
                  <p className="text-lg font-semibold text-gray-900">₸ {formatPrice(total)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">Жеткізу</p>
                  <p className="text-lg font-semibold text-gray-900">тегін</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Жалпы</p>
                <p className="text-2xl font-semibold text-gray-900"><span className="text-xs font-normal text-gray-400">KZT</span> {formatPrice(total)}</p>
              </div>

              <div className="mt-6 text-center">
                <button onClick={() => navigate("/checkout")} type="button" className="group inline-flex w-full items-center justify-center rounded-md bg-orange-500 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                  Тапсырыс беру
                  <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:ml-8 ml-4 h-6 w-6 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
