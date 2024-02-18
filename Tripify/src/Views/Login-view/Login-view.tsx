import Button from '../../Components/Button/Button';
import './Login-view.css';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Service/auth-service';
import { doc } from 'firebase/firestore';


export default function LoginView() {
  const navigate = useNavigate();
  const { setContext } = useAppContext();
  const [error,setError] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  useEffect(() => {
    document.body.style.backgroundImage='url(https://images.squarespace-cdn.com/content/v1/5ad3c92c12b13fb122e90d3c/1566025164525-SF6MXDK5SDTFFGGAAYQV/IMG_5616.JPG)';
  return () =>{ document.body.style.backgroundImage='none';
  }
  },[] );

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
        <h1>Login</h1>

        <label htmlFor="email">Email: </label><br />
        <input type="text" name='email' id='email' autoComplete='email' placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
        <label htmlFor="password">Password: : </label><br />
        <input  name='password' type="password" id='password' placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p style={{color:'red'}}>Invalid email or password</p>}
        <Button onClick={login}>Login</Button>

      </div>
    </div>
  )
}