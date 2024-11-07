import { useState } from 'react';
import './SignInForm.css';
import UserCard from './UserCard';
import MatrixRain from './MatrixRain'; 

const SignInForm = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const query = `query User {
    user {
        auditRatio
        email
        firstName
        lastName
        login
        totalDown
        totalUp
    }
    event_user(where: { eventId: { _in: [72, 20, 250] } }) {
        level
        userId
        userLogin
        eventId
    }
    transaction {
        amount
        path
        type
        userLogin
        eventId
    }
  }`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentials = `${emailOrUsername}:${password}`;
    const encodedCredentials = btoa(credentials);
    setLoading(true);
    setErrorMessage(''); // Clear previous error messages

    try {
      const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const data = await response.json();
      const thedata = await fetcher(query, data); // Ensure you have a valid token

      if (thedata && thedata.user && Array.isArray(thedata.user)) {
        setUser(thedata);
        setIsSignedIn(true);
      } else {
        console.error('User data is not available or not an array:', thedata);
      }
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        setErrorMessage('Incorrect email or password. Please try again.'); // Set error message
      } else {
        console.error('Error:', error);
        setErrorMessage('Incorrect email or password. Please try again.'); // General error message
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      {!isSignedIn ? (
        <>
          <MatrixRain /> 
          <form className="signin-form" onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <div className="form-group">
              <label>Email/Username</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </>
      ) : (
        user ? (
          <UserCard data={user} />
        ) : (
          <p>Loading user data...</p>
        )
      )}
    </div>
  );
};

export default SignInForm;

async function fetcher(query, jwt) {
  const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Network response was not ok: ${errorText}`);
  }
  
  const result = await response.json();
  console.log(result);
  
  if (result.errors) {
      throw new Error(result.errors[0].message);
  }
  
  return result.data; 
}