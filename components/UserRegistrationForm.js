import { useForm } from 'react-hook-form';

export default function Register() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Redirect or handle successful registration
      console.log(data);
    } else {
      // Handle error during registration
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='bg-dark text-white p-4 rounded-4'
    >
      <h2 className='display-4 mb-3'>Register</h2>
      <div className='mb-3'>
        <label htmlFor='username' className='form-label'>
          Username
        </label>
        <input
          type='text'
          id='username'
          {...register('username')}
          required
          className='form-control'
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label'>
          Password
        </label>
        <input
          type='password'
          id='password'
          {...register('password')}
          required
          className='form-control'
        />
      </div>
      <button type='submit' className='btn btn-outline-success'>
        Register
      </button>
    </form>
  );
}
