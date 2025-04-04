import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Admin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) throw new Error('Failed to fetch members');
        
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="admin-header">
        <h2>Admin Panel - Welcome {currentUser?.name}</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <table className="MemberTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>{member.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;