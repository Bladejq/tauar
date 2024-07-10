import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function Main() {
  return (
    <div className="flex-1 flex">
      <div className="flex w-full h-min justify-center m-4 space-x-4">
        <Link
          to="/admin/list"
          className="bg-[#EF4534] text-white p-6 rounded-xl text-3xl font-bold flex items-center space-x-2"
        >
          <span>Өнімдерді тізімдеу</span>
          <FontAwesomeIcon icon={faList} className="ml-2" />
        </Link>
        <Link
          to="/admin/add"
          className="bg-[#EF4534] text-white p-6 rounded-xl text-3xl font-bold flex items-center space-x-2"
        >
          <span>Жаңа өнім қосыңыз</span>
          <FontAwesomeIcon icon={faPlus} className="ml-2" />
        </Link>
        <Link
          to="/admin/edit"
          className="bg-[#EF4534] text-white p-6 rounded-xl text-3xl font-bold flex items-center space-x-2"
        >
          <span>Өнімді өңдеу</span>
          <FontAwesomeIcon icon={faEdit} className="ml-2" />
        </Link>
        <Link
          to="/admin/delete"
          className="bg-[#EF4534] text-white p-6 rounded-xl text-3xl font-bold flex items-center space-x-2"
        >
          <span>Өнімді жою</span>
          <FontAwesomeIcon icon={faTrash} className="ml-2" />
        </Link>

        <Link
          to="/admin/viewOrders"
          className="bg-[#EF4534] text-white p-6 rounded-xl text-3xl font-bold flex items-center space-x-2"
        >
          <span>Тапсырыстар тізімі</span>
          <FontAwesomeIcon icon={faList} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default Main;
