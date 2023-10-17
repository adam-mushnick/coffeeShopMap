import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Flash from '../../components/Flash';

const NewPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [flash, setFlash] = useState('');
  //currently logged in user session data
  const { data: session } = useSession();
  const [authorID, setAuthorID] = useState(null); //initialize with null

  useEffect(() => {
    if (session && session.user) {
      setAuthorID(session.user.id);
      console.log(session);
      console.log(authorID);
    }
  }, [session]); // Re-run this effect whenever the session changes

  const submitData = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!authorID) {
      console.error('Author ID is not defined.');
      return;
    }

    formData.append('author', authorID);

    try {
      const res = await axios.post('/api/photoUploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response from /api/photoUploads:', res.data);

      // These are the Cloudinary URLs
      const imageUrls = res.data.urls.map((urlObj) => urlObj.secure_url);

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      const postRes = await axios.post('/api/post', {
        name,
        location,
        description,
        images: imageUrls,
        author: authorID,
      });
      console.log('response from api/post:', postRes.data);

      setFlash('Coffee Shop created successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    //bootstrap validation classes
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

  return (
    <div className='d-flex flex-column vh-100'>
      <Navbar />
      <Flash message={flash} duration={5000} />
      <div className='row mx-2 my-2'>
        <div className='col-sm-6 mx-auto'>
          <form className='needs-validation' noValidate onSubmit={submitData}>
            <h1>Submit a new coffee shop!</h1>
            <div className='form-group my-2'>
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
            <div className='form-group my-2'>
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
            <div className='form-group my-2'>
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
            <div className='form-group my-2'>
              <input
                type='file'
                name='images'
                className='form-control'
                multiple
                accept='image/*'
                required
              />
              <div className='invalid-feedback'>
                Please provide valid images.
              </div>
            </div>
            <div className='form-group'>
              <input
                type='submit'
                className='btn btn-primary me-3'
                value='Submit'
                disabled={!authorID} //disable the button if no authorID
              />
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
};

export default NewPage;
