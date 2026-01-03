import React, { useState } from 'react';
import { collection, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

function AdminPanel({ data, loadData, setIsAuthenticated, setCurrentPage }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', score: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.score) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Find the highest ID and increment, start from 1 if no data
      const maxId = data.length > 0 ? Math.max(...data.map(item => parseInt(item.id) || 0)) : 0;
      const newId = (maxId + 1).toString();
      
      await setDoc(doc(db, 'products', newId), {
        name: formData.name,
        score: parseInt(formData.score)
      });
      
      await loadData();
      setFormData({ name: '', score: '' });
      setIsCreating(false);
      alert('Item created successfully!');
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Error creating item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      score: item.score.toString()
    });
    setIsCreating(false);
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.score) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const itemRef = doc(db, 'products', editingId);
      await updateDoc(itemRef, {
        name: formData.name,
        score: parseInt(formData.score)
      });
      
      await loadData();
      setEditingId(null);
      setFormData({ name: '', score: '' });
      alert('Item updated successfully!');
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Error updating item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'products', id));
      await loadData();
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', score: '' });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Admin Panel</h1>
        <div>
          <button 
            onClick={() => setCurrentPage('frontend')}
            style={{ color: 'blue', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginRight: '20px' }}
          >
            View Frontend
          </button>
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>

      {loading && <div style={{ color: '#007bff', marginBottom: '10px' }}>Processing...</div>}

      <button 
        onClick={() => setIsCreating(true)} 
        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', marginBottom: '20px' }}
        disabled={isCreating || editingId !== null || loading}
      >
        Create New Item
      </button>

      {(isCreating || editingId !== null) && (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
          <h3>{isCreating ? 'Create New Item' : 'Edit Item'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
                disabled={loading}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Score:</label>
              <input
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd' }}
                disabled={loading}
              />
            </div>
          </div>
          <button 
            onClick={isCreating ? handleCreate : handleUpdate}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}
            disabled={loading}
          >
            {isCreating ? 'Create' : 'Update'}
          </button>
          <button 
            onClick={handleCancel}
            style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Score</th>
            <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                No items found. Create your first item!
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} style={{ backgroundColor: editingId === item.id ? '#fff3cd' : 'white' }}>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>{item.score}</td>
                <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                  <button 
                    onClick={() => handleEdit(item)}
                    style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', cursor: 'pointer', marginRight: '5px' }}
                    disabled={isCreating || editingId !== null || loading}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
                    disabled={isCreating || editingId !== null || loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;