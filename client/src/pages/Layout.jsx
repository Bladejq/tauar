import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  const location = useLocation();

  const View = ['/404'];

  const Hide = !View.includes(location.pathname);

  return (
    <div className='flex flex-col h-screen w-full justify-between'>
      {Hide && <Header />}
      <Outlet />
      {Hide && <Footer />}
    </div>
  );
}

export default Layout;
