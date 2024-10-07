import React, { useState } from 'react'; 
import '../styles/Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", { name, email, password });
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Lorem ipsum!</h1>
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit.</p>
        <button className="login-btn" onClick={handleSubmit}>Sign in</button>
      </div>
      <div className="login-right">
        <form>
          <h2 className="login-header">Login</h2>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </form>
      </div>
    </div>
  );
}

export default Login;
