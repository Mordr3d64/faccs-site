// ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios'; // Add Axios for API requests

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    try {
      // Call backend to generate OTP and send email
      const response = await axios.post('/api/forgot-password', { email });
      
      if (response.status === 200) {
        setMessage('Password reset link sent successfully.');
      } else {
        setMessage('Error sending password reset link.');
      }
    } catch (error) {
      setMessage('Error sending password reset link.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
