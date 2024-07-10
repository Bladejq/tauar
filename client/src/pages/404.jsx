import React from 'react';
import logo from '../img/logo.png';


function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-400 text-gray-200 font-vt323">
            <h1 className="text-6xl mb-4 font-vt323 bg-slate-700">Error - 404 :(</h1>
            <a href='/'>
                <img src={logo} alt="404" className="h-20" />
            </a>

            <p className="text-center mb-4">Сіз іздеген бет табылмады</p>
            <p className="text-center mb-4">
                * Сіз іздеген веб-сайт бөлігі жоқ астындағы батырма арқылы кіріңіз<br />
            </p>
            <nav className="mt-8">
                <a href="/" className="text-lg text-gray-200 hover:bg-gray-500 hover:text-blue-800 p-1">Басты бет</a>
                <span className="mx-2">|</span>
                <a href="mailto:nurnazsherkhan06@gmail.com" className="text-lg text-gray-200 hover:bg-gray-500 hover:text-blue-800 p-1">Сайт әзірлеуші</a>
            </nav>
        </div>
    );
}

export default NotFound;
