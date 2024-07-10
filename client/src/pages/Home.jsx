import React, { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import cartService from "../services/cart.service";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import FirstPhoto from "../img/FirstPhoto.png";
import SecondPhoto from "../img/SecondPhoto.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    cartService
      .getCart()
      .then((res) => res.data)
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const prevButton = document.querySelector('.swiper-button-prev');
    const nextButton = document.querySelector('.swiper-button-next');

    if (prevButton && nextButton) {
      const buttonStyle = {
        backgroundColor: 'white',
        color: 'black',
        padding: '15px',
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      };

      Object.assign(prevButton.style, buttonStyle);
      Object.assign(nextButton.style, buttonStyle);
    }
  }, [cart]);

  const renderSwiperSlide = (src, alt) => (
    <SwiperSlide key={alt}>
      <img src={src} alt={alt} className="w-full h-auto" />
    </SwiperSlide>
  );

  const handleProductClick = (id) => {
    navigate("/products/" + id);
  };

  const formatPrice = (price) => {
    const parts = price.toString().split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return formattedIntegerPart + decimalPart;
  };

  const truncateTitle = (title) => {
    if (title.length > 15) {
      return title.substring(0, 15) + "...";
    }
    return title;
  };

  return (
    <div className="flex-1 py-8 px-10">
      <h1 className="text-3xl text-center font-bold">
        {loading ? <Skeleton variant="text" width={300} /> : "Tauar.kz-ке қош келдіңіз!"}
      </h1>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{ clickable: true }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="my-8 bg-white"
        style={{
          "--swiper-navigation-color": "black",
          "--swiper-pagination-color": "white",
          "--swiper-navigation-size": "14px",
        }}
      >
        {loading ? (
          [1, 2, 3].map((index) => (
            <SwiperSlide key={index}>
              <Skeleton variant="rectangular" width="100%" height={300} />
            </SwiperSlide>
          ))
        ) : (
          <>
            {renderSwiperSlide(FirstPhoto, "First Photo")}
            {renderSwiperSlide(SecondPhoto, "Second Photo")}
          </>
        )}
      </Swiper>

      {cart.length > 0 && (
        <div className="bottom-0 left-0 right-0 bg-white shadow-md p-4 z-10">
          <h1 className="text-xl font-bold">
            {loading ? <Skeleton variant="text" width={200} /> : "Сіздің себетіңізде"}
          </h1>
          <p className="mt-2">
            {loading ? <Skeleton variant="text" width={100} /> : `${cart.length} тауар`}
          </p>

          <div className="mt-4">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{ clickable: true }}
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={3}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 10,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 10,
                },
              }}
              style={{
                "--swiper-navigation-color": "black",
                "--swiper-navigation-size": "16px",
                "--swiper-pagination-color": "white",
              }}
            >
              {loading ? (
                [1, 2, 3, 4].map((index) => (
                  <SwiperSlide key={index} className="flex shadow-xl p-2 bg-gray-100 rounded-lg">
                    <Skeleton variant="rectangular" width={80} height={80} className="w-20 h-20 object-cover" />
                    <div className="flex flex-col ml-2 w-full">
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="50%" />
                      <Skeleton variant="text" width="75%" />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                cart.map((item) => (
                  <SwiperSlide key={item.id} className="flex shadow-xl p-2 bg-gray-100 rounded-lg">
                    <img className="w-20 h-20 object-cover" src={item.thumbnail} alt={item.title} />
                    <div className="flex flex-col ml-2">
                      <p className="cursor-pointer text-sm font-semibold" onClick={() => handleProductClick(item.id)}>
                        {truncateTitle(item.title)}
                      </p>
                      <span className="text-sm text-gray-600">{item.quantity} дана.</span>
                      <span className="font-Montserrat font-semibold text-sm">{formatPrice(item.price)} ₸</span>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>

            <a href="/cart" className="block text-center mt-4">
              {loading ? (
                <Skeleton variant="rectangular" width={150} height={40} />
              ) : (
                <button className="text-white px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-800">
                  Себетке өту
                </button>
              )}
            </a>
          </div>
        </div>
      )}

      <h2 className="text-center text-3xl mt-8 font-bold">Интернет дүкен</h2>
      <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-6">
        <Link to="http://localhost:5173/products?category=Телефондар%20мен%20гаджеттер" className="w-80 text-center">
          <div className="p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
            <p className="text-lg font-semibold mb-4">Телефондар мен гаджеттер</p>
            <img src="https://kaspi.kz/img/Phone.png" alt="Телефондар мен гаджеттер" className="w-32 mx-auto" />
          </div>
        </Link>

        <Link to="http://localhost:5173/products?category=Құлаққап" className="w-80 text-center">
          <div className="p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
            <p className="text-lg font-semibold mb-4">Құлаққаптар</p>
            <img src="https://kaspi.kz/img/Computer.png" alt="Құлаққаптар" className="w-32 mx-auto" />
          </div>
        </Link>

        <Link to="http://localhost:5173/products?category=Шағын%20ас%20үй%20техникасы" className="w-80 text-center">
          <div className="p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
            <p className="text-lg font-semibold mb-4">Шағын ас үй техникалары</p>
            <img src="https://resources.cdn-kaspi.kz/img/cnt/m/n/be5d3776-1758-4869-940c-aa703bc5dca6-Home%20App.png" alt="Ас үй техникалары" className="w-32 mx-auto" />
          </div>
        </Link>

        <Link to="http://localhost:5173/products?category=Аудио%20жабдық" className="w-80 text-center">
          <div className="p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow bg-white">
            <p className="text-lg font-semibold mb-4">Аудио жабдықтар</p>
            <img src="https://resources.cdn-kaspi.kz/img/cnt/m/n/4cd61e8e-7faa-4276-8aaf-44380e0c145d-TV.png" alt="Аудио жабдықтар" className="w-32 mx-auto" />
          </div>
        </Link>

      </div>
    </div>
  );
}

export default Home;
