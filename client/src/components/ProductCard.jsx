import React, { useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cart.service";
import CartContext from "../context/cart";
import { toast } from "react-toastify";

function formatPrice(price) {
  const parts = price.toString().split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedIntegerPart + decimalPart;
}

function ProductCard(props) {
  const [product, setProduct] = useState(props.product);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);

  function addToCart() {
    setLoading(true);
    cartService
      .addToCart({ id: product.id })
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setProduct({ ...product, inCart: true });  
        setLoading(false);
        cartContext.updateCart();
        toast.success("Тауар сәтті қосылды!");
      })
      .catch((err) => {
        toast.error("Қосу кезінде қате болды: " + err.message);
        setLoading(false);
      });
  }

  function handleProductClick() {
    navigate("/products/" + product.id);
  }

  function renderSwiperSlides() {
    return product.images.map((image, index) => (
      <SwiperSlide key={index} className="flex items-center justify-center">
        <img src={image} alt={product.title} className="object-contain h-full w-full" />
      </SwiperSlide>
    ));
  }

  function renderButton() {
    if (product.inCart) {
      return (
        <button className="text-white px-4 py-1 rounded-md bg-neutral-300" disabled>
          Себетте жатыр
        </button>
      );
    } else {
      return (
        <button
          className="text-white px-4 py-1 rounded-md bg-[#EF4534] hover:bg-red-700"
          disabled={loading}
          onClick={addToCart}
        >
          {loading ? "Күте тұрыңыз" : "Себетке салу"}
        </button>
      );
    }
  }

  return (
    <div className="w-64 h-96 p-4 space-y-2 ml-6 hover:shadow-lg rounded flex flex-col justify-between">
      <div className="w-full h-48 flex items-center justify-center">
        <Swiper
          className="mySwiper h-full w-full"
          centeredSlides
          style={{
            "--swiper-navigation-color": "gray",
            "--swiper-navigation-size": "25px",
          }}
        >
          {renderSwiperSlides()}
        </Swiper>
      </div>
      <p className="font-semibold text-base cursor-pointer hover:text-red-700" onClick={handleProductClick}>
        {product.title}
      </p>
      <p className="font-medium text-base">{formatPrice(product.price)} ₸</p>
      {renderButton()}
    </div>
  );
}

export default ProductCard;
