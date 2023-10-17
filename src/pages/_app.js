import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
//need mapbox css or map will look wrong
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/custom.scss';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Dynamically import Bootstrap JavaScript only in browser (some errors happened when trying to access in server)
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
