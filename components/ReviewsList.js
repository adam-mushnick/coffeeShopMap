import axios from 'axios';
import { useSession } from 'next-auth/react';

function ReviewsList({ reviews, deleteReview }) {
  const { data: session } = useSession();

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-gold' : 'text-grey'}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className='bg-dark text-white'>
      {reviews.length > 0 && (
        <h2 className='display-6 m-3'>Customer Reviews</h2>
      )}
      {reviews.map((review) => {
        return (
          <div
            key={review._id}
            className='card m-3 bg-black text-white border-0 rounded-4'
          >
            <div className='card-body d-flex flex-column'>
              {' '}
              {/* Added flex-column */}
              <div className='d-flex justify-content-between align-items-center mb-2'>
                <h3 className='display-6'>
                  {review.author ? `${review.author.username}` : ''}
                </h3>
                <div className='d-flex align-items-center'>
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className='mt-2 mb-3 flex-grow-1'>{review.body}</p>{' '}
              {/* Added flex-grow-1 */}
              {session &&
                session.user.id &&
                session.user.id === review.author._id && (
                  <div className='mt-auto text-end'>
                    {' '}
                    {/* Added mt-auto and text-end */}
                    <button
                      className='btn btn-outline-danger'
                      onClick={() => deleteReview(review._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewsList;
