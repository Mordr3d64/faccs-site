// ForgotPassword.js
import React, { useState } from 'react';
import emailjs from 'emailjs-com';

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
      const templateParams = {
        email_to: email,
        subject: 'Password Reset Request',
        message: 'Click this link to reset your password: [reset_link]', // replace with real link
      };

      // Send email via EmailJS
      const response = await emailjs.send(
        'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID'
      );

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
