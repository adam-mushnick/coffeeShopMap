import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ReviewForm = ({ id, addReview }) => {
  const [body, setBody] = useState('');
  //currently logged in user session data
  const { data: session } = useSession();
  const [authorID, setAuthorID] = useState(null); //initialize with null
  //set rating
  const [rating, setRating] = useState('');
  //color the star ratings
  const [selectedStar, setSelectedStar] = useState(null);
  //validate star ratings
  const [isValid, setIsValid] = useState(true);

  //color stars gray
  const removeSelectedClassFromStars = () => {
    const starElements = document.querySelectorAll('.star-rating span');
    starElements.forEach((element) => {
      element.classList.remove('selected');
    });
  };

  //set selectedStar class if input checked to change color
  useEffect(() => {
    removeSelectedClassFromStars();

    if (selectedStar !== null) {
      const selectedElement = document.getElementById(`star${selectedStar}`);
      if (selectedElement) {
        selectedElement.parentElement.classList.add('selected');
      }
    }
  }, [selectedStar]);

  useEffect(() => {
    if (session && session.user) {
      setAuthorID(session.user.id);
    }
  }, [session]); // Re-run this effect whenever the session changes

  const resetForm = (form) => {
    //reset state in component
    setRating('');
    setBody('');
    //clear form inputs
    form.reset();
    form.classList.remove('was-validated');
  };

  const submitData = async (e) => {
    e.preventDefault();
    console.log('submitData called'); // Debugging line
    console.log('Current rating:', rating); // Debugging line
    if (!rating) {
      console.log('Rating is missing'); // Debugging line
      setIsValid(false);
      return;
    }
    setIsValid(true);
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
    } else {
      if (!authorID || !session || !session.user || !session.user.username) {
        console.error('Author ID or username is not defined.');
        return;
      }
      try {
        console.log('Request body:', { rating, body, author: authorID }); // Debugging line

        const res = await axios.post(`/api/review/${id}`, {
          rating,
          body,
          author: authorID,
        });
        // Manually add the username to the review object
        const newReview = {
          ...res.data.data,
          author: {
            username: session.user.username,
            _id: session.user.id,
          },
        };
        addReview(newReview);
        // Reset the form
        resetForm(form);
        removeSelectedClassFromStars();
      } catch (error) {
        console.log('review form submit error');
        console.error(error);
      }
    }
  };

  useEffect(() => {
    console.log('useEffect for form validation called'); // Debugging line

    const forms = document.getElementsByClassName('needs-validation');
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener(
        'submit',
        function (event) {
          console.log('Form submit event'); // Debugging line

          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            console.log('form checkvalidity false');
          }
          form.classList.add('was-validated');
        },
        false
      );
    });
  }, []);

  return (
    <div className='m-3'>
      <form
        className='needs-validation bg-dark bg-gradientp-5'
        noValidate
        onSubmit={submitData}
      >
        <h1 className='display-6'>Submit a review!</h1>
        <div className='form-group my-2'>
          <div className='star-rating'>
            {[5, 4, 3, 2, 1].map((star) => (
              <span key={star}>
                <input
                  type='radio'
                  name='rating'
                  id={`star${star}`}
                  value={star}
                  onChange={(e) => {
                    setRating(e.target.value);
                    setSelectedStar(star);
                  }}
                  required
                />
                <label htmlFor={`star${star}`}>&#9733;</label>
              </span>
            ))}
          </div>
          {!isValid && (
            <>
              {' '}
              {console.log('Rendering invalid feedback')} {/* Debugging line */}
              <div className='invalid-feedback d-block'>
                Please provide a valid rating.
              </div>
            </>
          )}
        </div>
        <div className='form-group my-2'>
          <textarea
            className='form-control'
            onChange={(e) => setBody(e.target.value)}
            placeholder='Body'
            value={body}
            required
            minLength='10'
          ></textarea>
          <div className='invalid-feedback'>
            Please provide a valid review with at least 10 characters.
          </div>
        </div>
        <div className='form-group'>
          <input
            type='submit'
            className='btn btn-outline-success me-3 mt-3'
            value='Submit'
          />
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
