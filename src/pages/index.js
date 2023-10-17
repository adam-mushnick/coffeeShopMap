import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { axios } from 'axios';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CoffeeShopList from '../../components/CoffeeShopList';
import MapBoxMap from '../../components/MapboxMap';

const IndexPage = () => {
  const { data: session, status } = useSession();

  return (
    <div className='bg-dark d-flex flex-column vh-100'>
      <Navbar />
      <div className='container d-flex justify-content-center mb-5'>
        <MapBoxMap />
      </div>
      <main className='bg-dark d-flex justify-content-center mt-2'>
        <div>
          <CoffeeShopList />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IndexPage;
