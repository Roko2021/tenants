import React, { useContext, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const CartIcon = ({ count }) => (
  <div style={{ position: 'relative', display: 'inline-block', marginLeft: 10, cursor: 'pointer' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path d="M7 18c-1.104 0-1.99.896-1.99 2S5.896 22 7 22s2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-1.99.896-1.99 2S15.896 22 17 22s2-.896 2-2-.896-2-2-2zM7.16 14.26l.84-4.24h8.5l1.24-4H6.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 16.37 5.48 18 7 18h12v-2H7.42c-.14 0-.25-.11-.25-.25z" />
    </svg>
    {count > 0 && (
      <span style={{
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '2px 6px',
        fontSize: 12,
        fontWeight: 'bold',
        minWidth: 18,
        textAlign: 'center',
        lineHeight: '16px',
        userSelect: 'none',
      }}>
        {count}
      </span>
    )}
  </div>
);



const Layout = () => {
  const { isAuthenticated, user, loading, logout } = useContext(AuthContext);
  const cartItemCount = 3; // غيّرها حسب بياناتك الحقيقية

  useEffect(() => {
    console.log('Layout: Auth context', { isAuthenticated, user, loading });
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const logoutHandler = () => {
    logout();
  };

  return (
    <div>
      <header>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {isAuthenticated ? (
            <div className='Layout-Container' style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>
                <Link to="/" style={{ color: "white" }}>Main</Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: 'white', margin: '0 10px', display: 'flex', alignItems: 'center' }}>
                  Welcome, <Link to="/dashboard" style={{ color: 'white', marginLeft: 5 }}>
                      {user?.firstName} {user?.lastName} ({user?.email})
                  </Link>
              </span>
                <Link to="/my-animals">
                  <img style={{ margin: '0 10px', width: "40px" }} src="/images/add_your_pets.png" alt="icon" />
                </Link>
                {/* أيقونة الحيوانات المعروضة */}
                <Link to="/AddAnimls">
                  <img style={{ margin: '0 10px', width: "40px" }} src="/images/add_your_pets.png" alt="icon" />
                </Link>
                {/* أيقونة عربة التسوق */}
                <CartIcon count={cartItemCount} />
                <button onClick={logoutHandler} style={{ marginLeft: 15 }}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className='Layout-Container' style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>
                <Link to="/" style={{ color: "white" }}>Main</Link>
              </div>
              <div>
                <Link to="/">
                  <img style={{ margin: '0 10px', width: "40px" }} src="/images/IconPets.jpg" alt="icon" />
                </Link>
                <Link to="/food">
                  <img style={{ margin: '0 10px', width: "40px" }} src="/images/FoodDog.jpg" alt="icon" />
                </Link>
                <Link to="/login" style={{ color: 'white', margin: '0 10px' }}>Login</Link>
                <Link to="/register" style={{ color: 'white', margin: '0 10px' }}>Register</Link>
              </div>
            </div>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        {/* ... */}
      </footer>
    </div>
  );
};

export default Layout;
