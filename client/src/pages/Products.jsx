import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import productService from "../services/product.service";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const category = query.get("category");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  async function getAllProducts() {
    productService
      .getProducts()
      .then((response) => response.data)
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }

  async function getCategories() {
    productService
      .getCategories()
      .then((res) => res.data)
      .then((objects) => objects.map((obj) => obj.category))
      .then((data) => setCategories(["Барлық тауарлар", ...data]))
      .catch((err) => {
        toast.error(err.message);
      });
  }

  useEffect(() => {
    getCategories();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (!category) {
      getAllProducts();
    } else {
      productService
        .getProductsByCategory(category)
        .then((response) => response.data)
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [category]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (searchTerm) => {
    const filtered = products.filter((product) => {
      return (
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredProducts(products);
  };

  return (
    <div className="flex-1 py-8 px-10 flex">
      <div className="w-1/4">
        <h1 className="text-3xl font-bold mb-4">Категория</h1>
        <div className="flex flex-col space-y-2">
          {categories &&
            categories.map((category) => (
              <button
                key={category}
                className="text-white bg-[#EF4534] rounded px-4 py-2 hover:bg-red-600 text-left"
                onClick={() =>
                  navigate(
                    category === "Барлық тауарлар"
                      ? "/products"
                      : "?category=" + category
                  )
                }
              >
                {category}
              </button>
            ))}
        </div>
      </div>
      <div className="w-3/4">
        <h1 className="text-3xl font-bold mb-4 text-center">Тауарлар</h1>
        <div className="mb-4 flex space-x-2 justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Іздеу..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded w-full pl-10"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
          </div>
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 border rounded bg-red-500 text-white hover:bg-red-600"
          >
            Тазалау
          </button>
        </div>
        <div className="flex flex-wrap items-start justify-center space-x-6">
          {filteredProducts &&
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          {loading &&
            Array.from(new Array(10)).map((item, index) => (
              <div key={index}>
                <Skeleton variant="rectangular" width={250} height={180} />
                <Skeleton />
                <Skeleton width="60%" />
              </div>
            ))}
        </div>
        {error && <h1>{error.message}</h1>}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Products;
