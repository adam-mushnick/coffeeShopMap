//Coffee Shop Show Page
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import ReviewForm from '../../../components/ReviewForm';
import ReviewsList from '../../../components/ReviewsList';
import Flash from '../../../components/Flash';
import { useSession } from 'next-auth/react';

const CoffeeShopPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [coffeeShop, setCoffeeShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [flash, setFlash] = useState({ message: '', className: '' });
  const { data: session, status } = useSession();

  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`/api/post/${id}`);
      // Reset the flash message first to ensure a re-render
      setFlash('');
      setTimeout(() => {
        setFlash({
          message: 'Coffee Shop deleted',
          className: 'alert alert-danger',
        });
      }, 10);
      // Redirect to the home page
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditShop = (post) => {
    router.push(`/post/edit/${coffeeShop._id}`);
  };

  const addReview = (review) => {
    setReviews((prevReviews) => [...prevReviews, review]);
    setFlash('');
    setTimeout(() => {
      setFlash({
        message: 'Submitted review successfully!',
        className: 'alert alert-success',
      });
    }, 10);
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`/api/review/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
      setFlash('');
      setTimeout(() => {
        setFlash({
          message: 'Review deleted successfully!',
          className: 'alert alert-danger',
        });
      }, 10);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const resCoffeeShop = await axios.get(`/api/post/${id}`);
        setCoffeeShop(resCoffeeShop.data.data);

        const resReviews = await axios.get(`/api/review/${id}`);
        console.log(resReviews.data.data); // Print fetched reviews here

        setReviews(resReviews.data.data);
      }
    };
    fetchData();
  }, [id]); // When id changes, this will run again

  if (!coffeeShop) {
    return <div>Loading...</div>;
  }

  return (
    <div className='d-flex flex-column bg-dark text-white vh-100'>
      <Navbar />
      <Flash
        message={flash.message}
        className={flash.className}
        duration={2000}
      />
      <div className='card mb-3 p-3 bg-dark text-white border-0'>
        <div className='row g-0'>
          <div className='col-md-4 gx-3 bg-dark'>
            {/* Bootstrap Carousel */}
            <div
              id={`carousel${coffeeShop._id}`}
              className='carousel slide'
              data-bs-ride='carousel'
            >
              <div className='carousel-inner'>
                {coffeeShop.images &&
                  coffeeShop.images.map((image, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? 'active' : ''}`}
                      key={image}
                    >
                      <img
                        src={image}
                        key={image}
                        className='carousel-image show-page-image'
                        alt='Coffee Shop Image'
                      />
                    </div>
                  ))}
              </div>
              {coffeeShop.images && coffeeShop.images.length > 1 && (
                <>
                  <button
                    className='carousel-control-prev'
                    type='button'
                    data-bs-target={`#carousel${coffeeShop._id}`}
                    data-bs-slide='prev'
                  >
                    <span
                      className='carousel-control-prev-icon'
                      aria-hidden='true'
                    ></span>
                    <span className='visually-hidden'>Previous</span>
                  </button>
                  <button
                    className='carousel-control-next'
                    type='button'
                    data-bs-target={`#carousel${coffeeShop._id}`}
                    data-bs-slide='next'
                  >
                    <span
                      className='carousel-control-next-icon'
                      aria-hidden='true'
                    ></span>
                    <span className='visually-hidden'>Next</span>
                  </button>
                </>
              )}
            </div>
            {/* End of Bootstrap Carousel */}
          </div>
          <div className='col-md-8'>
            <div className='card-body bg-dark bg-gradient rounded-4'>
              <h4 className='card-title fw-bold mb-3'>{coffeeShop.name}</h4>
              <p className='card-text fw-semibold'>{coffeeShop.location}</p>
              <p className='card-text fw-light'>{coffeeShop.description}</p>
              {session &&
                session.user &&
                coffeeShop.author &&
                session.user.id === coffeeShop.author && (
                  <div className='button-container d-flex justify-content-center'>
                    <button
                      className='btn btn-outline-info mx-1 flex-grow-1'
                      onClick={() => handleEditShop(coffeeShop)}
                    >
                      Edit Shop
                    </button>
                    <button
                      className='btn btn-outline-danger mx-1 flex-grow-1'
                      onClick={() => deletePost(coffeeShop._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              <Link href='/' className='btn btn-outline-secondary mt-3 d-block'>
                Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='row bg-dark'>
        {session && (
          <div className='col-12 col-md-4 review-form-sticky'>
            <ReviewForm id={id} addReview={addReview} />
          </div>
        )}
        <div className='col-12 col-md-8'>
          <ReviewsList
            key={reviews.length}
            reviews={reviews}
            deleteReview={deleteReview}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoffeeShopPage;
