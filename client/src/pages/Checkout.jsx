import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCalendarAlt, faLock } from "@fortawesome/free-solid-svg-icons";
import { faCcVisa, faCcMastercard } from "@fortawesome/free-brands-svg-icons";
import orderService from "../services/order.service";
import CartContext from "../context/cart";

function Checkout() {
  const navigate = useNavigate();
  const { updateCart } = useContext(CartContext);

  const getInitialTime = () => {
    let now = new Date();
    now.setDate(now.getDate() + 1);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [orderDetails, setOrderDetails] = useState({
    paymentMethod: "online",
    deliveryTime: getInitialTime(),
    address: "",
    cardNumber: "",
    cardExpiry: "",
    cardholderName: "",
    cardPassword: ""
  });

  const [paymentFieldsVisible, setPaymentFieldsVisible] = useState(true);

  useEffect(() => {
    setPaymentFieldsVisible(orderDetails.paymentMethod === "online");
  }, [orderDetails.paymentMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const getCardIcon = (number) => {
    const firstDigit = number.charAt(0);
    if (firstDigit === "4") {
      return faCcVisa;
    } else if (firstDigit === "5") {
      return faCcMastercard;
    } else {
      return faCreditCard;
    }
  };

  const checkout = (e) => {
    e.preventDefault();
    if (
      orderDetails.paymentMethod === "" ||
      orderDetails.deliveryTime === "" ||
      orderDetails.address === ""
    ) {
      toast.error("Барлық өрістерді толтырыңыз", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    orderService
      .checkoutOrder(orderDetails)
      .then((res) => res.status)
      .then((status) => {
        if (status === 200) {
          toast.success("Тапсырыс жасалды", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          updateCart();

          setTimeout(() => {
            navigate("/purchases");
          }, 3500);
        }
      })
      .catch((err) =>
        toast.error(err.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      );
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto p-8">
        <form
          className="bg-white p-8 rounded-lg shadow-md border border-gray-200"
          onSubmit={checkout}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Төлем жасау</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Тапсырыс аддресі</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="address" className="block text-gray-700 mb-1">Адресс</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Қала, көше, ғимарат нөмірі, пәтер, пошта индексі"
                  className="w-full rounded-lg border py-2 px-3 bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  value={orderDetails.address}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="deliveryTime" className="block text-gray-700 mb-1">Жеткізу уақыты</label>
                <input
                  type="datetime-local"
                  id="deliveryTime"
                  name="deliveryTime"
                  className="w-full rounded-lg border py-2 px-3 bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  value={orderDetails.deliveryTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Төлем жасау</h2>
            <select
              name="paymentMethod"
              id="paymentMethod"
              className="w-full rounded-lg border py-2 px-3 bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={orderDetails.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="online">Онлайн картамен төлем</option>
              <option value="cash">Қолма қол төлем</option>
            </select>
          </div>

          {paymentFieldsVisible && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Онлайн төлем</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={getCardIcon(orderDetails.cardNumber)} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Карта нөмірі"
                    className="w-full rounded-lg border py-2 px-3 bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={orderDetails.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="cardExpiry"
                    placeholder="Аяқталу күні"
                    className="w-full rounded-lg border py-2 px-3 bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={orderDetails.cardExpiry}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="cardholderName"
                    placeholder="Аты-жөні"
                    className="w-full rounded-lg border py-2 px-3 bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={orderDetails.cardholderName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-2" />
                  <input
                    type="number"
                    name="cardPassword"
                    placeholder="Артқы үш саны"
                    className="w-full rounded-lg border py-2 px-3 bg-gray-50 text-gray-800 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={orderDetails.cardPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Тапсырыс жасау
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Checkout
