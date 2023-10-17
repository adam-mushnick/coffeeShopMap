//next/link instead of <a> tags
//faster client-side nav instead of full page refresh
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
      <div className='container-fluid'>
        <Link className='nav-link-style' href='/'>
          <span className='navbar-brand'>BrewScape</span>
        </Link>
        <div className=''>
          <ul className='navbar-nav d-flex flex-row'>
            {!loading && session && (
              <>
                <li className='nav-item mx-2'>
                  <Link className='nav-link-style' href='/'>
                    <span className='nav-link'>Home</span>
                  </Link>
                </li>
                <li className='nav-item mx-2'>
                  <Link className='nav-link-style' href='/about'>
                    <span className='nav-link'>About</span>
                  </Link>
                </li>
              </>
            )}
            {!loading && !session && (
              <>
                <li className='nav-item mx-2'>
                  <Link className='nav-link-style' href='/login'>
                    <span className='nav-link'>Login</span>
                  </Link>
                </li>
                <li className='nav-item mx-2'>
                  <Link className='nav-link-style' href='/register'>
                    <span className='nav-link'>Register</span>
                  </Link>
                </li>
              </>
            )}
            {!loading && session && (
              <li className='nav-item mx-2'>
                <span
                  className='nav-link'
                  onClick={() => signOut()}
                  style={{ cursor: 'pointer' }}
                >
                  Logout
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
