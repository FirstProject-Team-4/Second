import Button from '../../Components/Button/Button';
import './Login-view.css';
import { useState } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Service/auth-service';


export default function LoginView() {
  const navigate = useNavigate();
  const { setContext } = useAppContext();
  const [error,setError] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const login = async (): Promise<void> => {
    try {
      const response= await loginUser(form.email, form.password);
      console.log(response);

    setContext({ user:response.user, userData: null });
    navigate('/home');
    } catch (error: any) {
      console.log(error.message);
      setError(true);
    }

  }


  return (

    <div className="login-view">
      <div className="login-form">
        <h1 id='login-h1'>Login</h1>

        <label htmlFor="email" className='label'>Email: </label><br />
        <input type="text" name='email' id='email' autoComplete='email' placeholder="✉ email..." value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
        <label htmlFor="password" className='label'>Password: : </label><br />
        <input  name='password' type="password" id='password' placeholder="🗝 password..." value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p style={{color:'red'}}>Invalid email or password</p>}
        <div id='login-btn'>
        <Button  onClick={login} >Login</Button>
        </div>
      </div>
    </div>
    
  )
}