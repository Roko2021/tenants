import React, { createContext, useState, useEffect } from 'react';

const defaultAuthContext = {
  isAuthenticated: false,
  user: null,
  loading: true,
  login: () => console.warn('login function not implemented'),
  logout: () => console.warn('logout function not implemented')
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    // قراءة بيانات المستخدم من localStorage عند التحميل
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access');

    if (storedUser && storedToken) {
      try {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          loading: false
        });
      } catch (error) {
        console.error('Failed to parse user:', error);
        logout();
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
    setAuthState({
        isAuthenticated: true,
        user: userData,
        loading: false
    });
    console.log('AuthProvider: Login successful', { isAuthenticated: true, user: userData, accessToken, refreshToken });
};

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
    console.log('AuthProvider: Logout successful');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
