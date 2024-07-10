import React, { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DeleteProduct() {
  const [products, setProducts] = useState(null);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminService
      .listProducts()
      .then((res) => res.data)
      .then((products) => setProducts(products))
      .catch((err) => console.error("Error fetching products:", err)); // Handle error in case of fetch failure
  }, []);

  function deleteProduct(e) {
    e.preventDefault();
    if (!product) {
      toast.error("Өнім таңдалмаған");
      return;
    }

    adminService
      .deleteProduct(product)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Өнім сәтті жойылды");
          navigate("/admin");
        } else {
          toast.error("Өнімді жоюда қате пайда болды");
        }
      })
      .catch((err) => {
        toast.error("Өнімді жоюда қате пайда болды");
        console.error("Error deleting product:", err);
      });
  }

  return (
    <div className="flex justify-center flex-1">
      <div className="flex flex-col space-y-3">
        <select
          name=""
          id=""
          onChange={(e) =>
            setProduct(products.find((p) => p.id == e.target.value))
          }
        >
          <option value="" disabled selected>
            Өнімді таңдаңыз
          </option>
          {products &&
            products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title}
              </option>
            ))}
        </select>
        {product && (
          <button
            className="bg-red-500 text-white rounded py-2 px-4 text-lg"
            onClick={deleteProduct}
          >
            Өнімді жою
          </button>
        )}
      </div>

      {/* ToastContainer to handle toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default DeleteProduct;
