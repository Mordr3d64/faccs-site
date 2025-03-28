import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // to get token from URL
import axios from 'axios'; // Assuming you're using axios to make API calls

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      // Send the token and new password to the backend to reset the password
      const response = await axios.post('http://localhost:5000/reset-password', {
        token,
        newPassword: password,
      });

      if (response.status === 200) {
        setMessage('Password reset successfully.');
        // Redirect to login page or show success message
      } else {
        setMessage('Error resetting password.');
      }
    } catch (error) {
      console.log(error);
      setMessage('Error resetting password.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter new password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
