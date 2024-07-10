import React from 'react'
import Logo from '../img/logo.png'
import { Link } from 'react-router-dom'

function Footer() {
  return (


    <footer class="bg-[#EF4534] dark:bg-gray-800">
      <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div class="md:flex md:justify-between">
          <div class="mb-6 md:mb-0">
            <a href="/" class="flex items-center">
              <img src={Logo} class="h-8 me-3" alt="FlowBite Logo" />
            </a>
          </div>
          <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Серіктестер</h2>
              <ul class="text-gray-500 dark:text-gray-400 font-medium">
                <li class="mb-4">
                  <a href="https://kaspi.kz/" class="hover:underline">Kaspi.kz</a>
                </li>
                <li>
                  <a href="https://ozon.kz/?__rr=1" class="hover:underline">Ozon.kz</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Тапсырыстар бөлімі</h2>
              <ul class="text-gray-500 dark:text-gray-400 font-medium">
                <li class="mb-4">
                  <a href="/cart" class="hover:underline ">Себет</a>
                </li>
                <li>
                  <a href="/purchases" class="hover:underline">Тапсырыстар</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="items-center flex justify-center">
        <p className='text-s text-white'>2023 
          <Link className='hover:text-gray-400' to="/"> Tauar.kz </Link>
           Барлық құқық сақталған*</p>
        </div>  
      </div>
    </footer>

  )
}

export default Footer