import React, { useEffect, useState } from "react";
import adminService from "../../services/admin.service";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProduct() {
  const [images, setImages] = useState([""]);
  const [product, setProduct] = useState({ images: [] });
  const [uploadedProducts, setUploadedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProduct((prevProduct) => ({ ...prevProduct, images }));
  }, [images]);

  function addProduct(e) {
    e.preventDefault();
    adminService
      .addProduct(product)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Тауарлар сәтті жаңартылды");
          navigate("/admin");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const products = XLSX.utils.sheet_to_json(firstSheet);

      const newProducts = products.map((prod) => ({
        title: prod.title,
        description: prod.description,
        price: prod.price,
        category: prod.category,
        thumbnail: prod.thumbnail,
        brand: prod.brand,
        images: prod.images ? prod.images.split(",") : [],
        stock: prod.stock,
        discountPercentage: prod.discount_percentage,
        rating: prod.rating,
      }));

      setUploadedProducts(newProducts);
    };

    reader.readAsBinaryString(file);
  }

  function handleUploadProducts() {
    uploadedProducts.forEach((newProduct) => {
      adminService.addProduct(newProduct).then((res) => {
        if (res.status === 200) {
          console.log(`Тауарлар ${newProduct.title} қосылды`);
        }
      });
    });

    toast.success("Тауарлар сәтті қосылды");
    navigate("/admin");
  }

  function removeImage(index) {
    setImages((images) => images.filter((_, i) => i !== index));
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...fileUrls]);
  }

  function addMoreImage() {
    setImages((prevImages) => [...prevImages, ""]);
  }

  return (
    <div className="flex justify-center flex-1 p-8 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-6 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Жаңа тауар қосу</h1>
        <form className="flex flex-col space-y-4" onSubmit={addProduct}>
          <div>
            <label htmlFor="title" className="block text-lg font-medium">Тауар аты</label>
            <input
              id="title"
              type="text"
              required
              placeholder="Тауар атын енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="Тауар сипаттамасы" className="block text-lg font-medium">Тауар сипаттамасы</label>
            <textarea
              id="description"
              required
              placeholder="Тауар сипаттамасын енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            ></textarea>
          </div>

          <div>
            <label htmlFor="price" className="block text-lg font-medium">Тауар бағасы</label>
            <input
              id="price"
              type="number"
              min={1}
              required
              placeholder="Тауар бағасын енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-lg font-medium">Тауар категориясы</label>
            <input
              id="category"
              type="text"
              required
              placeholder="Тауар категориясын енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="thumbnail" className="block text-lg font-medium">Тауардың алдыңғы суреті</label>
            <input
              id="thumbnail"
              type="url"
              required
              placeholder="Алдыңғы суретін енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({ ...product, thumbnail: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-lg font-medium">Тауар бренді</label>
            <input
              id="brand"
              type="text"
              required
              placeholder="Тауар брендін енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({ ...product, brand: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="images" className="block text-lg font-medium">Тауар суреттері</label>
            <div className="flex flex-col space-y-2 mt-1">
              {images.map((image, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="url"
                    placeholder="URL теріңіз"
                    value={image}
                    className="flex-1 p-2 border rounded"
                    onChange={(e) =>
                      setImages((images) => {
                        const newImages = images.slice(0);
                        newImages[index] = e.target.value;
                        return newImages;
                      })
                    }
                  />
                  <img
                    src={image}
                    alt={`Img ${index}`}
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
                  id="image-upload" 
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="image-upload"  
                  className="text-white bg-blue-500 rounded p-2 cursor-pointer"
                >
                  Сурет енгізу
                </label>
                <button
                  type="button"
                  className="text-white bg-green-500 rounded p-2"
                  onClick={addMoreImage}
                >
                  Сурет қосу
                </button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="stock" className="block text-lg font-medium">Қалған саны</label>
            <input
              id="stock"
              type="number"
              min={1}
              required
              placeholder="Қалған тауар санын енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({ ...product, stock: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="discount" className="block text-lg font-medium">Жеңілдік енгізіңіз</label>
            <input
              id="discount"
              type="number"
              min={0}
              required
              placeholder="Жеңілдікті енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({
                  ...product,
                  discountPercentage: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-lg font-medium">Рейтинг</label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min={0}
              max={5}
              required
              placeholder="Рейтинг енгізіңіз"
              className="w-full mt-1 p-2 border rounded"
              onChange={(e) =>
                setProduct({ ...product, rating: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white p-3 rounded"
          >
            Тауарды қосу
          </button>
        </form>

        <div className="mt-6">
          <label
            htmlFor="excel-upload"  
            className="bg-black text-white p-3 rounded cursor-pointer"
          >
            Эксель енгізіңіз 
          </label>
          <input
            type="file"
            id="excel-upload" 
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>

        {uploadedProducts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Енгізілген тауарлар</h2>
            <ul className="list-disc pl-5">
              {uploadedProducts.map((prod, index) => (
                <li key={index}>{prod.title}</li>
              ))}
            </ul>
            <button
              className="bg-black text-white p-3 rounded mt-3"
              onClick={handleUploadProducts}
            >
              Енгізу
            </button>
          </div>
        )}

        {/* ToastContainer to handle toast notifications */}
        <ToastContainer />
      </div>
    </div>
  );
}

export default AddProduct;
