//edit coffee shop page

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import Flash from '../../../../components/Flash';

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  //http://localhost:3000/coffeeShops/64da2d1fd14dbc74125e99e3

  //states
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(null);
  const [flash, setFlash] = useState('');
  const { data: session } = useSession();
  console.log('Current Session:', session);

  useEffect(() => {
    console.log('Checking session and author...');
    console.log('Session:', session);
    console.log('Author:', author);
    if (session !== undefined && author !== null) {
      if (!session || !session.user || session.user.id !== author) {
        console.log('Redirecting due to invalid session or author mismatch.');
        router.push('/');
      }
    }
  }, [session, author]); //add author to dependency array to update when author changes

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`/api/post/${id}`);
      const { name, location, description, author } = response.data.data;
      console.log('Fetched post data:', response.data.data);
      setName(name);
      setLocation(location);
      setDescription(description);
      setAuthor(author);
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    const forms = document.getElementsByClassName('needs-validation');
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener(
        'submit',
        function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        },
        false
      );
    });
  }, []);

  const submitData = async (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.stopPropagation();
    } else {
      try {
        console.log('Edit page: Editing');
        await axios.put(
          `/api/post/${id}`,
          { name, location, description },
          {
            withCredentials: true, //sends cookies for session validation
          }
        );
        console.log('Edit page: After axios');
        setFlash('Coffee Shop edited successfully!');
        //timeout gives flash message time to display
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Error Message:', error.message);
        console.error('Error Config:', error.config);
        console.error('Error Response:', error.response);
        console.error(error);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className='d-flex flex-column vh-100'>
      <Navbar />
      <Flash message={flash} duration={2000} />
      <div className='row'>
        <div className='col-sm-6 mx-auto'>
          <form className='needs-validation' noValidate onSubmit={submitData}>
            <h1>Edit Post</h1>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setName(e.target.value)}
                placeholder='Name'
                value={name}
                required
              />
              <div className='invalid-feedback'>
                Please provide a valid name.
              </div>
            </div>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                onChange={(e) => setLocation(e.target.value)}
                placeholder='Location'
                value={location}
                required
              />
              <div className='invalid-feedback'>
                Please provide a valid location.
              </div>
            </div>
            <div className='form-group'>
              <textarea
                className='form-control'
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
                value={description}
                required
              ></textarea>
              <div className='invalid-feedback'>
                Please provide a valid description.
              </div>
            </div>
            <div className='form-group'>
              <input type='submit' className='btn btn-primary' value='Submit' />
              <button onClick={handleBack} className='btn btn-secondary'>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
