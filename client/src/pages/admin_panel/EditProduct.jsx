import React, { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProduct() {
  const [products, setProducts] = useState(null);
  const [product, setProduct] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    adminService
      .listProducts()
      .then((res) => res.data)
      .then((products) => setProducts(products));
  }, []);

  function saveProduct(e) {
    e.preventDefault();
    adminService
      .editProduct(product)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Өнім сәтті өзгертілді");
          navigate("/admin");
        } else {
          toast.error("Өнімді өзгерту кезінде қате пайда болды");
        }
      })
      .catch((error) => {
        toast.error("Өнімді өзгерту кезінде қате пайда болды");
        console.error("Error editing product:", error);
      });
  }

  function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setUploadedFiles([...uploadedFiles, ...fileUrls]);
    setProduct({ ...product, images: [...product.images, ...fileUrls] });
  }

  function addImage() {
    setProduct({ ...product, images: [...product.images, ""] });
  }

  function removeImage(index) {
    const newImages = product.images.filter((_, i) => i !== index);
    const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newUploadedFiles);
    setProduct({ ...product, images: newImages });
  }

  return (
    <div className="flex justify-center flex-1 p-8 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow-md">
        {!product && (
          <select
            name=""
            id=""
            className="w-full p-2 border rounded mb-6"
            onChange={(e) =>
              setProduct(products.find((p) => p.id == e.target.value))
            }
          >
            <option value="" disabled selected>
              Өзгертетін тауарды таңдаңыз
            </option>
            {products &&
              products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
          </select>
        )}
        {product && (
          <div className="flex flex-col space-y-3">
            <h1 className="text-2xl font-bold text-center">Тауарды өзгерту</h1>
            <form className="flex flex-col space-y-3" onSubmit={saveProduct}>
              <div>
                <label htmlFor="title" className="block text-lg font-medium">
                  Өнім атауы
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={product.title}
                  placeholder="Өнім атауын енгізіңіз"
                  className="w-full mt-1 p-2 border rounded"
                  onChange={(e) =>
                    setProduct({ ...product, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-lg font-medium"
                >
                  Өнім Сипаттамасы
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  placeholder="Өнім сипаттамасын енгізіңіз"
                  value={product.description}
                  className="w-full mt-1 p-2 border rounded"
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label htmlFor="price" className="block text-lg font-medium">
                  Өнім бағасы
                </label>
                <input
                  id="price"
                  type="number"
                  min={1}
                  required
                  value={product.price}
                  placeholder="Өнім бағасы"
                  className="w-full mt-1 p-2 border rounded"
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-lg font-medium"
                >
                  Өнім категориясы
                </label>
                <input
                  id="category"
                  type="text"
                  required
                  value={product.category}
                  placeholder="Өнім категориясын енгізіңіз"
                  className="w-full mt-1 p-2 border rounded"
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="thumbnail"
                  className="block text-lg font-medium"
                >
                  Бірінші сурет
                </label>
                <input
                  id="thumbnail"
                  type="url"
                  required
                  value={product.thumbnail}
                  placeholder="Суреттің бірінші суретін енгізіңіз"
                  className="w-full mt-1 p-2 border rounded"
                  onChange={(e) =>
                    setProduct({ ...product, thumbnail: e.target.value })
                  }
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-lg font-medium">
                  Өнім бренді
                </label>
                <input
                  id="brand"
                  type="text"
                  required
                  value={product.brand}
                  placeholder="Өнім брендін енгізіңіз"
                  className="w-full mt-1 p-2 border rounded"
                  onChange={(e) =>
                    setProduct({ ...product, brand: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="images"
                  className="block text-lg font-medium"
                >
                  Өнім суреттері
                </label>
                <div className="flex flex-col space-y-2 mt-1">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between space-x-2"
                    >
                      <input
                        type="url"
                        placeholder="Суреттің URL енгізіңіз"
                        value={image}
                        className="flex-1 p-2 border rounded"
                        onChange={(e) => {
                          const newImages = product.images.slice(0);
                          newImages[index] = e.target.value;
                          setProduct({ ...product, images: newImages });
                        }}
                      />
                      <img
                        src={image}
                        alt={`Thumbnail ${index}`}
                        className="h-12 w-12 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="text-white bg-red-500 rounded p-2"
                        onClick={() => removeImage(index)}
                      >
                        Өшіру
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-between space-x-2">
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="text-white bg-blue-500 rounded p-2 cursor-pointer"
                    >
                      Суреттерді жүктеп салу
                    </label>
                    <button
                      type="button"
                      className="text-white bg-black rounded p-2 self-center"
                      onClick={addImage}
                    >
                      Сурет қосу
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="stock" className="block text-lg font-medium">
                  Тауар қалдығы
                </label>
                <input
                  id="stock"
                  type="number"
                  min={1}
                  required
                  value={product.stock}
                  placeholder="Тауар қалдығын енгізіңіз"
                  className="w-full mt-1 p-2 border rounded"
                  onChange={(e) =>
                    setProduct({ ...product, stock: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="discount"
                  className="block text-lg font-medium"
                >
                  Жеңілдік пайызы
                </label>
                <input
                  id="discount"
                  type="number"
                  min={0}
                  required
                  value={product.discount_percentage}
                  placeholder="Жеңілдік пайызын енгізіңіз"
                  className="w-full mt-1 p-2 border rounded"
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      discount_percentage: e.target.value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="bg-black text-white p-3 rounded"
              >
                Өнімді сақтау
              </button>
            </form>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default EditProduct;
