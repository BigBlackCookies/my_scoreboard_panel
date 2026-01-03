import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Frontend from './Frontend';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('frontend');

  // Load data from Firebase
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setData(items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle URL-based routing
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      
      if (hash === '/admin') {
        setCurrentPage('admin');
      } else if (hash === '/admin/login') {
        setCurrentPage('login');
      } else {
        setCurrentPage('frontend');
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    
    return () => window.removeEventListener('hashchange', handleRouteChange);
  }, []);

  useEffect(() => {
    const routes = {
      'frontend': '/',
      'login': '/admin/login',
      'admin': '/admin'
    };
    
    const newHash = routes[currentPage];
    if (newHash && window.location.hash !== `#${newHash}`) {
      window.location.hash = newHash;
    }
  }, [currentPage]);

  const renderPage = () => {
    if (loading) {
      return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
    }

    switch (currentPage) {
      case 'frontend':
        return <Frontend data={data} setCurrentPage={setCurrentPage} />;
      case 'login':
        if (isAuthenticated) {
          setCurrentPage('admin');
          return null;
        }
        return <AdminLogin setIsAuthenticated={setIsAuthenticated} setCurrentPage={setCurrentPage} />;
      case 'admin':
        if (!isAuthenticated) {
          setCurrentPage('login');
          return null;
        }
        return <AdminPanel data={data} loadData={loadData} setIsAuthenticated={setIsAuthenticated} setCurrentPage={setCurrentPage} />;
      default:
        return <Frontend data={data} setCurrentPage={setCurrentPage} />;
    }
  };

  return <div>{renderPage()}</div>;
}

export default App;