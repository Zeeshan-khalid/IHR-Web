import '../styles/globals.css';
import '../styles/fonts.css'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import HashLoader from 'react-spinners/HashLoader';
import { AuthProvider } from '../context/AuthContext/AuthProvider';

function MyApp({ Component, pageProps }) {
  const [loading, setloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = (data) => {
     
      setloading(true)
    }
    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    };
  }, [router.events]);

  useEffect(() => {
    const handleRouteChangeComplete = (data) => {
      
      setloading(false)
    }
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    };
  }, [router.events]);

  return (
    <>
      <Head>
      </Head>
      {loading ? (
        <div className="loader">
          <HashLoader color={"#F37A24"} loading={loading} size={80} />
        </div>
      ) : (
        <AuthProvider {...pageProps}>
          <Component {...pageProps} />
        </AuthProvider>
      )}
    </>
  );
}

export default MyApp;
