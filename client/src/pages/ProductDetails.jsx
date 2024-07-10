import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../services/product.service";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarHalfRoundedIcon from "@mui/icons-material/StarHalfRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import cartService from "../services/cart.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  function addToCart() {
    cartService
      .addToCart({ id: product.id })
      .then((res) => res.data)
      .then((data) => {
        setProduct((prev) => ({
          ...prev,
          inCart: true,
        }));
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }

  useEffect(() => {
    setLoading(true);
    productService
      .getProduct(id)
      .then((response) => response.data)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <div className="flex items-center space-x-1">
        {Array(fullStars)
          .fill()
          .map((_, index) => (
            <StarRoundedIcon key={`full-${index}`} style={{ color: "#FFC107" }} />
          ))}
        {halfStar === 1 && <StarHalfRoundedIcon style={{ color: "#FFC107" }} />}
        {Array(emptyStars)
          .fill()
          .map((_, index) => (
            <StarOutlineRoundedIcon key={`empty-${index}`} style={{ color: "#FFC107" }} />
          ))}
      </div>
    );
  };

  function formatPrice(price) {
    const parts = price.toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return formattedIntegerPart + decimalPart;
  }

  if (loading) {
    return (
      <div className="font-sans bg-gray-100 flex justify-center items-center h-screen">
        <Stack direction={"row"} spacing={2} className="w-full py-6 h-[600px] flex justify-center items-start">
          <Skeleton variant="rounded" height={400} className="w-[40%]" />
          <Stack spacing={1}>
            <Skeleton variant="rounded" width={180} height={40} />
            <Skeleton variant="rounded" width={250} height={40} />
            <Skeleton variant="rounded" width={190} height={40} />
            <Skeleton variant="rounded" width={210} height={40} />
            <Skeleton variant="rounded" width={100} height={40} />
          </Stack>
        </Stack>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      <div className="p-4 lg:max-w-7xl max-w-2xl mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
            <div className="bg-white px-4 py-12 rounded-xl shadow-lg">
              <Swiper
                navigation={true}
                modules={[Navigation]}
                className="mySwiper h-auto"
                centeredSlides
                style={{
                  "--swiper-navigation-color": "#333",
                }}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index} className="h-auto bg-white flex justify-center items-center">
                    <img
                      src={image}
                      alt={product.title}
                      className="object-contain h-full"
                      style={{ maxHeight: "500px" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4 mx-auto">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className="w-[90px] h-20 flex items-center justify-center bg-gray-200 rounded-xl p-4 cursor-pointer"
                  onClick={() => swiperRef.current.slideTo(index)}
                >
                  <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold">{product.title}</h2>

            <div className="flex space-x-2 mt-4">
              {renderRating(product.rating)}
              <h4 className="text-base">{product.rating} / 5</h4>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <p className="text-4xl font-semibold">
                {formatPrice(product.price)}₸
              </p>
              <p className="text-gray-500 text-base">
                <strike>
                  {formatPrice(product.price * (1 + product.discount_percentage / 100))}₸
                </strike>
                <span className="text-sm ml-1">ҚҚС қоса алғанда</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {!product.inCart && (
                <button
                  type="button"
                  className="min-w-[200px] px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded"
                  onClick={addToCart}
                >
                  Себетке қосу
                </button>
              )}
              {product.inCart && (
                <button
                  type="button"
                  className="min-w-[200px] px-4 py-2.5 border border-red-600 bg-transparent text-red-600 text-sm font-semibold rounded"
                  onClick={() => navigate("/cart")}
                >
                  Себетке өту
                </button>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold">Өнім туралы</h3>
              <ul className="space-y-3 list-disc mt-4 pl-4 text-lg">
                <li><strong>Бренд:</strong> {product.brand}</li>
                <li><strong>Санат:</strong> {product.category}</li>
                <li><strong>Сипаттама:</strong> {product.description}</li>
                <li><strong>Қоймада:</strong> {product.stock} дана</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default ProductDetails;
