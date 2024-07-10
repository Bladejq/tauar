import React, { useState, useContext, useEffect } from "react";
import ShoppingCartIcon from "@mui/icons-material/Shop2";
import PersonIcon from "@mui/icons-material/PersonOutlineRounded";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate, Link } from "react-router-dom";
import CartContext from "../context/cart";
import UserContext from "../context/user";
import userService from "../services/user.service";
import productService from "../services/product.service";
import Logo from '../img/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Header() {
  const { cart } = useContext(CartContext);
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [authHover, setAuthHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [shadow, setShadow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShadow(window.scrollY > 50); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleAuth() {
    if (!user) {
      navigate("/login");
    }
  }

  function logout() {
    userService
      .logout()
      .then(res => res.status)
      .then(status => {
        if (status === 200) {
          updateUser();
          navigate("/");
          window.location.reload();
          toast.success("Сіз сәтті шықтыңыз!");
        }
      })
      .catch(err => {
        console.error("Error logging out:", err);
        toast.error("Шығу кезінде қате пайда болды");
      });
  }

  async function getCategories() {
    productService
      .getCategories()
      .then(res => res.data)
      .then(objects => objects.map(obj => obj.category))
      .then(data => setCategories(["Барлық тауарлар", ...data]))
      .catch(err => {
        console.error("Error fetching categories:", err);
        toast.error("Категорияларды жүктеу кезінде қате пайда болды");
      });
  }

  useEffect(() => {
    getCategories();
  }, []);

  const toggleCategoryOpen = () => {
    setCategoryOpen(!categoryOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center transition-shadow duration-300 px-6 py-4 ${
          shadow ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center">
          <p className="text-2xl font-bold cursor-pointer w-32 h-8" onClick={() => navigate("/")}>
            <img src={Logo} alt="Logo" />
          </p>
        </div>

        <div className="hidden lg:flex space-x-3 items-center">
          <Link to="/products" className="hover:text-red-600 transition duration-200">Тауарлар</Link>
          <Link to="/purchases" className="hover:text-red-600 transition duration-200">Тапсырыстарым</Link>
          <button
            onClick={toggleCategoryOpen}
            className="bg-[#EF4534] text-cyan-50 p-2 rounded text-center flex items-center"
          >
            <MenuIcon className="mr-2" /> Каталог
          </button>

          {user && (
            <div
              className="flex gap-2 cursor-pointer border-white border p-1 relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCartIcon />
              {cart && cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                  {cart.length}
                </span>
              )}
            </div>
          )}

          <div
            onMouseOver={() => setAuthHover(true)}
            onMouseOut={() => setAuthHover(false)}
            className="flex flex-col items-end w-auto relative"
          >
            <div className="cursor-pointer flex gap-2" onClick={handleAuth}>
              <PersonIcon />
              <p>{user && user.firstname}</p>
            </div>
            {user && authHover && (
              <div className="absolute top-full right-0 w-max bg-red-500 text-white flex flex-col">
                <div className="px-3 py-2 hover:bg-red-800" onClick={() => navigate("/purchases")}>
                  Менің тапсырыстарым
                </div>
                <div className="px-3 py-2 hover:bg-red-800" onClick={logout}>
                  Аккаунттан шығу
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-0 left-0 w-full bg-white flex flex-col items-center py-4 space-y-3 lg:hidden z-10">
            <button onClick={() => setMenuOpen(false)}><CloseIcon /></button>
            <Link to="/products" className="hover:text-red-600 transition duration-200">Тауарлар</Link>
            <button
              onClick={toggleCategoryOpen}
              className="text-[#EF4534]"
            >
              Каталог
            </button>

            {user && (
              <div
                className="flex gap-2 cursor-pointer border-white border p-1 relative"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCartIcon />
                {cart && cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            )}

            <div
              onMouseOver={() => setAuthHover(true)}
              onMouseOut={() => setAuthHover(false)}
              className="flex flex-col items-center w-auto relative"
            >
              <div className="cursor-pointer flex gap-2" onClick={handleAuth}>
                <PersonIcon />
                <p>{user && user.firstname}</p>
              </div>
              {user && authHover && (
                <div className="absolute top-full right-0 w-max bg-red-500 text-white flex flex-col">
                  <div className="px-3 py-2 hover:bg-red-800 cursor-pointer" onClick={() => navigate("/purchases")}>
                    Менің тапсырыстарым
                  </div>
                  <div className="px-3 py-2 hover:bg-red-800 cursor-pointer" onClick={logout}>
                    Аккаунттан шығу
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {categoryOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-white z-50 overflow-y-auto">
          <div className="w-3/4 flex flex-col items-center p-4">
            <div className="flex justify-between items-center w-full p-4">
              <h1 className="text-3xl mt-10 font-bold">Категория</h1>
              <button
                onClick={toggleCategoryOpen}
                className="text-[#EF4534] absolute top-4 right-4"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="flex flex-col items-right space-y-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="px-4 py-2 border-b-2 rounded border-gray-300 hover:border-red-500 hover:bg-gray-200 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setCategoryOpen(false);
                    navigate(category === "Барлық тауарлар" ? "/products" : `/products?category=${category}`);
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {categoryOpen && <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur"></div>}

      <div className="pt-[80px]"></div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 flex justify-around py-2">
        <button onClick={() => navigate("/")} className="text-gray-500 hover:text-red-500 transition duration-200 flex flex-col items-center">
          <HomeIcon fontSize="large" />
          <span className="text-xs">Басты</span>
        </button>
        <button onClick={() => navigate("/products")} className="text-gray-500 hover:text-red-500 transition duration-200 flex flex-col items-center">
          <CategoryIcon fontSize="large" />
          <span className="text-xs">Тауарлар</span>
        </button>
        <button onClick={toggleCategoryOpen} className="text-gray-500 hover:text-red-500 transition duration-200 flex flex-col items-center">
          <MenuIcon fontSize="large" />
          <span className="text-xs">Каталог</span>
        </button>
        <button onClick={handleAuth} className="text-gray-500 hover:text-red-500 transition duration-200 flex flex-col items-center">
          <PersonIcon fontSize="large" />
          <span className="text-xs">{user ? "Аккаунт" : "Кіру"}</span>
        </button>
        <button onClick={() => navigate("/cart")} className="text-gray-500 hover:text-red-500 transition duration-200 flex flex-col items-center relative">
          <ShoppingCartIcon fontSize="large" />
          {cart && cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
              {cart.length}
            </span>
          )}
          <span className="text-xs">Себет</span>
        </button>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default Header;
