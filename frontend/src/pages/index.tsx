import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import AppLoading from './customer/apploading';

export default function LandingPage() {
  const router = useRouter();
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  const handleCustomerClick = () => {
    setLoadingCustomer(true);
    // 1500ms delay before navigation to show splash screen
    setTimeout(() => {
      router.push('/customer/signin');
    }, 1500);
  };

  if (loadingCustomer) {
    return <AppLoading />;
  }

  return (
    <>
      <Head>
        <title>Community Cart - Select Role</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        fontFamily: 'var(--font-family, sans-serif)'
      }}>
        <div style={{
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#333'
          }}>Community Cart</h1>

          <p style={{
            color: '#666',
            marginBottom: '2.5rem',
            lineHeight: '1.5'
          }}>
            Welcome! Please select your role to continue.
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Admin / Vendor Button */}
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '16px 24px',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#333'}
            >
              Admin / Vendor
            </button>

            {/* Customer Button */}
            <button
              onClick={handleCustomerClick}
              style={{
                padding: '16px 24px',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#fff',
                // Using a primary color often used in carts, or distinct from admin
                backgroundColor: '#0070f3',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005bb5'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0070f3'}
            >
              Customer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
