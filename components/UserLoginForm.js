import { useState } from 'react';
import { signIn } from 'next-auth/react';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      // Handle error here
      console.log(result.error);
    } else {
      // Redirect the user to the main page or dashboard
      window.location.href = '/';
    }
  };

  return (
    <form onSubmit={handleSubmit} className='bg-dark text-white p-4 rounded-4'>
      <h2 className='display-4 mb-3'>Login</h2>
      <div className='mb-3'>
        <label htmlFor='username' className='form-label'>
          Username
        </label>
        <input
          type='text'
          id='username'
          name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='form-control'
        />
      </div>
      <button type='submit' className='btn btn-outline-success'>
        Log in
      </button>
    </form>
  );
}

export default LoginForm;
