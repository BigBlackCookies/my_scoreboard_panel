import React, { useState } from 'react';

//Credentials (moved to .env for security reasons)
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME 
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

function AdminLogin({ setIsAuthenticated, setCurrentPage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setCurrentPage('admin');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '50px auto' }}>
      <h1>Admin Login</h1>
      <button 
        onClick={() => setCurrentPage('frontend')}
        style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
      >
        Back to Frontend
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button 
          onClick={handleSubmit}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Login
        </button>
      </div>
      
      <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        Demo credentials: OSFIIR_ADMIN / 0SF11R_F0R3V3R_2025
      </p>
    </div>
  );
}

export default AdminLogin;