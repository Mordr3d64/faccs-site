import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AddFAQ() {
  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerEnglish, setAnswerEnglish] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, answer, answer_english: answerEnglish })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add FAQ');
      }

      navigate('/faqs');
    } catch (err) {
      console.error('Add FAQ error:', err);
      setError(err.message || 'Failed to add FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-faq-container">
      <h1>Add New FAQ</h1>
      {error && <div className="faqs-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Tagalog Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label>English Answer</label>
          <textarea
            value={answerEnglish}
            onChange={(e) => setAnswerEnglish(e.target.value)}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="save-btn">
            {loading ? 'Adding...' : 'Add FAQ'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/faqs')} 
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFAQ;