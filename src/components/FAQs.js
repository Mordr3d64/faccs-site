import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [openFAQs, setOpenFAQs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/faqs');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      
      const data = await response.json();
      setFaqs(data);
      setOpenFAQs(new Array(data.length).fill(false));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQs(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/faqs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }

      setFaqs(prev => prev.map(faq => 
        faq.id === id ? { ...faq, ...updatedData } : faq
      ));
      setEditingId(null);
    } catch (err) {
      console.error('Update failed:', err);
      setError(`Update failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/faqs/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      setFaqs(prev => prev.filter(faq => faq.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      setError(`Delete failed: ${err.message}`);
    }
  };

  if (loading) return <div className="faqs-loading">Loading FAQs...</div>;
  if (error) return <div className="faqs-error">{error}</div>;

  return (
    <div className="faqs-container">
      <h1>FAQs / Mga Madalas Itanong</h1>
      
      {isAuthenticated && (
        <div className="faqs-admin-controls">
          <button 
            onClick={() => navigate('/add-faq')}
            className="faqs-add-button"
          >
            Add New FAQ
          </button>
        </div>
      )}

      {faqs.length === 0 ? (
        <p className="faqs-empty">No FAQs available</p>
      ) : (
        faqs.map((faq, index) => (
          <div key={faq.id} className="faq-card">
            {editingId === faq.id ? (
              <div className="faq-edit-form">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit(faq.id, {
                    title: e.target.title.value,
                    answer: e.target.answer.value,
                    answer_english: e.target.answer_english.value
                  });
                }}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={faq.title}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tagalog Answer</label>
                    <textarea
                      name="answer"
                      defaultValue={faq.answer}
                      required
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-group">
                    <label>English Answer</label>
                    <textarea
                      name="answer_english"
                      defaultValue={faq.answer_english}
                      required
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">Save Changes</button>
                    <button type="button" onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                <div className="faq-header">
                  <button 
                    onClick={() => toggleFAQ(index)} 
                    className="faq-title-button"
                  >
                    <span className="faq-title-text">{faq.title}</span>
                    <span className="faq-arrow">{openFAQs[index] ? "▲" : "▼"}</span>
                  </button>
                  
                  {isAuthenticated && (
                    <div className="faq-admin-actions">
                      <button className="faq-edit-btn" onClick={() => handleEdit(faq.id)}>
                        Edit
                      </button>
                      <button className="faq-delete-btn" onClick={() => handleDelete(faq.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                {openFAQs[index] && (
                  <div className="faq-body">
                    <p><strong>🇵🇭 Tagalog:</strong> {faq.answer}</p>
                    <p><strong>English:</strong> {faq.answer_english}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FAQs;