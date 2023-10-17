import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Flash from './Flash';

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function List() {
  const [flash, setFlash] = useState({
    message: '',
    className: 'alert alert-success',
  });

  const router = useRouter();

  const { data: session } = useSession();
  const { data, error, mutate } = useSWR('/api/posts', fetcher);

  if (error) return <div>Failed to load posts</div>;
  if (!data) return <div>Loading...</div>;

  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`/api/post/${id}`);
      mutate('/api/posts');
      // Reset the flash message first to ensure a re-render
      setFlash('');
      setTimeout(() => {
        setFlash({
          message: 'Coffee Shop deleted',
          className: 'alert alert-danger',
        });
      }, 10);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditShop = (post) => {
    console.log('Session User:', session?.user?.username);
    console.log('Post Author:', post.author?.username);
    router.push(`/post/edit/${post._id}`);
  };

  return (
    <div>
      <Flash
        message={flash.message}
        className={flash.className}
        duration={2000}
      />
      {session && (
        <Link href={'/new'}>
          <button className='btn btn-outline-info my-3'>
            Submit a New Coffee Shop
          </button>
        </Link>
      )}
      <div className='container'>
        {data.data &&
          data.data.map((post) => (
            <div
              className='card mb-5 bg-dark text-white border-0'
              key={post._id}
            >
              <div className='row g-0'>
                <div className='col-md-4 bg-dark'>
                  {/* Bootstrap Carousel */}
                  <div
                    id={`carousel${post._id}`}
                    className='carousel slide'
                    data-bs-ride='carousel'
                  >
                    <div className='carousel-inner'>
                      {post.images &&
                        post.images.map((image, index) => (
                          <div
                            className={`carousel-item ${
                              index === 0 ? 'active' : ''
                            }`}
                            key={image}
                          >
                            <img
                              src={image}
                              key={image}
                              className='carousel-image'
                              alt='Coffee Shop Image'
                            />
                          </div>
                        ))}
                    </div>
                    {post.images && post.images.length > 1 && (
                      <>
                        <button
                          className='carousel-control-prev'
                          type='button'
                          data-bs-target={`#carousel${post._id}`}
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
                          data-bs-target={`#carousel${post._id}`}
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
                  <div className='card-body bg-dark mx-2 rounded-4'>
                    <h4 className='card-title fw-bold mb-3'>{post.name}</h4>
                    <p className='card-text fw-semibold text-secondary'>
                      {post.location}
                    </p>
                    <p className='card-text fw-light text-secondary'>
                      {post.description}
                    </p>
                    <div className='button-container'>
                      <Link href={`/coffeeShops/${post._id}`}>
                        <button className='btn btn-outline-success me-3'>
                          View Shop
                        </button>
                      </Link>
                      {session &&
                        session.user &&
                        post.author &&
                        session.user.id === post.author && (
                          <>
                            <button
                              className='btn btn-outline-info mx-3'
                              onClick={() => handleEditShop(post)}
                            >
                              Edit Shop
                            </button>
                            <button
                              className='btn btn-outline-danger mx-3'
                              onClick={() => deletePost(post._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
