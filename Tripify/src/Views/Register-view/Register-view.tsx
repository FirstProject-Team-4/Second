import './Register-view.css';
import { useState } from 'react';
import Button from '../../Components/Button';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../Service/auth-service';
import { createUserHandle } from '../../Service/user-service';
export default function RegisterView() {

  const nav = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  // o	Email must be a valid email and unique in the system.

  const submit = async (): Promise<void> => {
      // Validate the input
  if (form.username.length < 4 || form.username.length > 32) {
    alert('Username must be between 4 and 32 symbols.');
    return;
  }
  if(!form.email.includes('@')){
    alert('Email must be a valid email.');
  }
  if(form.email.length < 6 || form.email.length > 32){
    alert('Email must be between 6 and 32 symbols.');
    return;
  }
  if(form.password.length < 6 || form.password.length > 32){
    alert('Password must be between 6 and 32 symbols.');
  }
 
    const response = await registerUser(form.email, form.password);
    createUserHandle(form.username, response.user.uid, form.email);
    loginUser(form.email, form.password);
    

    nav('/');

  }


  return (
    <div className="login-view">
      <div className="login-form">
        <h1>Register</h1>
        <label htmlFor="username">Username: </label><br />
        <input type="text" name='username' id='username' placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /><br />
        <label htmlFor="email">Email: </label><br />
        <input type="text" name='email' id='email' placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
        <label htmlFor="password">Password: : </label><br />
        <input name='password' type="password" id='password' placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button onClick={submit}>Register</Button>

      </div>
    </div>
  )

}