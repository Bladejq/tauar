import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import QRCode from "qrcode.react";

function OrderCard({ order }) {
  return (
    <section className="relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-6 mx-auto">

        <div className="main-box border border-gray-200 rounded-xl max-w-xl mx-auto lg:max-w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
            <div className="data">
              <p className="font-semibold text-base leading-7 text-black">
                Тапсырыс Id: <span className="text-indigo-600 font-medium">#{order.id}</span>
              </p>
              <p className="font-semibold text-base leading-7 text-black mt-4">
                Тапсырыс коды:{" "}
                <span className="text-gray-400 font-medium">
                  {(new Date(order.order_date)).toLocaleDateString()}
                </span>
              </p>
            </div>
            <div className="flex justify-center py-4">
              <QRCode value={order.verification_code.toString()} size={128} />
            </div>
          </div>

          <div className="w-full px-3 min-[400px]:px-6">
            {order.products.map((product) => (
              <div key={product.id} className="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                <div className="img-box max-w-full lg:max-w-[140px]">
                  <img src={product.thumbnail} alt={product.title} className="aspect-square w-full" />
                </div>
                <div className="flex flex-col lg:flex-row items-center w-full">
                  <div className="lg:pl-6">
                    <h2 className="font-semibold text-xl leading-8 text-black mb-3">
                      {product.title}
                    </h2>
                    <div className="flex items-center">
                      <p className="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                        Верификация: <span className="text-gray-500">{order.verification_code}</span>
                      </p>
                      <p className="font-medium text-base leading-7 text-black">
                        Дана: <span className="text-gray-500">{product.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="lg:ml-auto mt-6 lg:mt-0">
                    <div className="flex flex-col gap-3 lg:flex-row">
                      <div className="flex flex-col items-center">
                        <p className="font-medium text-sm leading-7 text-black">Бағасы</p>
                        <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600 ml-2">
                          {product.price}₸
                        </p>
                      </div>
                      <div className="flex items-center lg:ml-6 flex-col">
                        <p className="font-medium text-sm leading-7 text-black">Статус</p>
                        <p className="font-medium text-sm leading-6 py-0.5 px-3 whitespace-nowrap rounded-full lg:mt-3 bg-emerald-50 text-emerald-600 ml-2">
                          {product.status}
                        </p>
                      </div>
                      <div className="flex items-center lg:ml-6 flex-col">
                        <p className="font-medium text-sm leading-6 text-black">
                          Тапсырыс күтілу уақыты
                        </p>
                        <p className="font-medium text-base leading-7 lg:mt-3 text-emerald-500 ml-2">
                        {(new Date(order.delivery_time)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between">
            <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200">
              <p className="font-medium text-lg text-gray-900 pl-6 py-3 max-lg:text-center">
                Тапсырыс аддресі: <span className="text-gray-500">{order.address}</span>
              </p>
            </div>
            <p className="font-semibold text-lg text-black py-6">
              Толық бағасы: <span className="text-indigo-600">{order.totalPrice} KZT</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderCard;
