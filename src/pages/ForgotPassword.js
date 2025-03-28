import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    // Generate a reset token (You could also generate this on the server)
    const resetToken = Math.random().toString(36).substring(2); // Example of token generation

    // Construct the reset link
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const templateParams = {
      email_to: email,
      subject: 'Password Reset Request',
      message: `Click this link to reset your password: ${resetLink}`, // Send real reset link
    };

    try {
      const response = await emailjs.send(
        'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID'
      );

      if (response.status === 200) {
        setMessage('Password reset link sent successfully.');
        navigate('/login'); // Redirect to login after email is sent
      } else {
        setMessage('Error sending password reset link.');
      }
    } catch (error) {
      console.log(error);
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
