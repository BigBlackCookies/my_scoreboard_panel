import React from 'react';

function Frontend({ data, setCurrentPage }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Leaderboard</h1>
      
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Frontend;