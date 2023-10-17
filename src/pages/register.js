import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Flash from '../../components/Flash';
import UserRegistrationForm from '../../components/UserRegistrationForm';

const registrationPage = () => {
  return (
    <div className='bg-secondary d-flex flex-column vh-100'>
      <Navbar />
      <div className='d-flex justify-content-center align-items-center flex-grow-1'>
        <div className='col-md-6'>
          <UserRegistrationForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default registrationPage;
