import Button from '../../Components/Button';
import './Login-view.css';
import { useState } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Service/auth-service';

export default function LoginView() {
  const navigate = useNavigate();
  const { setContext } = useAppContext();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const login = async (): Promise<void> => {
    try {
      const response= await loginUser(form.email, form.password);

    setContext({ user:response.user, userData: null });
    navigate('/home');
    } catch (error: any) {
      console.log(error.message);
    }

  }


  return (
    <div className="login-view">
      <div className="login-form">
        <h1>Login</h1>

        <label htmlFor="email">Email: </label><br />
        <input type="text" name='email' id='email' autoComplete='email' placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
        <label htmlFor="password">Password: : </label><br />
        <input name='password' type="password" id='password' placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button onClick={login}>Login</Button>

      </div>
    </div>
  )
}