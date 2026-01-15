import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      title: 'Fresh Groceries',
      description: 'Get fresh produce delivered directly from your local vendors.',
      icon: '🥗',
    },
    {
      title: 'Local Pharmacies',
      description: 'Quick access to medicines and health essentials nearby.',
      icon: '💊',
    },
    {
      title: 'Electronics',
      description: 'Find the latest gadgets and electronics from trusted stores.',
      icon: '📱',
    },
    {
      title: 'Restaurants',
      description: 'Order delicious food from your favorite local restaurants.',
      icon: '🍔',
    },
  ];

  return (
    <>
      <Head>
        <title>Community Cart - Your Local Marketplace</title>
        <meta name="description" content="Connect with local vendors for groceries, medicines, electronics, and more." />
      </Head>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <nav style={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-surface)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛒</span> Community Cart
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/login" style={{
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--primary)',
              fontWeight: '600',
              border: '2px solid var(--primary)',
              transition: 'all 0.3s ease'
            }}>
              Login
            </Link>
            <Link href="/setup" style={{
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              backgroundColor: 'var(--secondary)',
              color: 'white',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}>
              Sign Up
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main style={{ flex: 1 }}>
          <section style={{
            padding: '80px 20px',
            textAlign: 'center',
            background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-main) 100%)',
          }}>
            <h1 style={{
              fontSize: '48px',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>
              Your Community, Delivered.
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'var(--text-secondary)',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              Shop from your trusted local stores. From fresh groceries to the latest electronics, get everything you need delivered to your doorstep.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/customer/browse-products" style={{
                padding: '16px 32px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 10px 20px rgba(46, 125, 50, 0.2)',
                transition: 'transform 0.2s ease'
              }}>
                Start Shopping
              </Link>
            </div>
          </section>

          {/* Features Grid */}
          <section style={{
            padding: '60px 40px',
            maxWidth: '100%',
            margin: '0 auto'
          }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-primary)' }}>Everything you need</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px'
            }}>
              {features.map((feature, index) => (
                <div key={index} style={{
                  padding: '30px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  cursor: 'default'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>{feature.icon}</div>
                  <h3 style={{ marginBottom: '10px', color: 'var(--text-primary)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer style={{
          padding: '40px',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          marginTop: 'auto'
        }}>
          <div style={{
            maxWidth: '100%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ color: 'var(--text-secondary)' }}>
              © 2024 Community Cart. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
