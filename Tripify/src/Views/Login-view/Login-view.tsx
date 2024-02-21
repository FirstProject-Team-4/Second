import Button from '../../Components/Button/Button';
import './Login-view.css';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../Service/auth-service';


/**
 * Renders the login view component.
 * 
 * @returns The login view component.
 */
export default function LoginView() {
  const navigate = useNavigate();
  const { setContext } = useAppContext();
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/male-tourist-hiking-near-forest-lake_107791-24915.jpg?w=1380&t=st=1708298546~exp=1708299146~hmac=fb856947bd4e03ad41ba85a0af37115ad7b811d240a391c473d5c35903c443a6)';
    document.body.style.backgroundSize = 'contain';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
    return () => {
      document.body.style.backgroundImage = 'url(https://img.freepik.com/free-vector/winter-landscape-with-frozen-lake-clouds_107791-1861.jpg?w=1380&t=st=1708300170~exp=1708300770~hmac=7f64d83fc68ab8082c106577bb1b910260a6e8acd782af2c01196102db24bb43)';
    }
  }, []);

  /**
   * Logs in the user with the provided email and password.
   * If the login is successful, sets the user context and navigates to the home page.
   * If there is an error, sets the error state to true.
   */
  const login = async (): Promise<void> => {
    try {
      const response = await loginUser(form.email, form.password);
      setContext({ user: response.user, userData: null });
      navigate('/home');
    } catch (error: any) {
      setError(true);
    }
  }


  return (

    <div className="login-view">
      <div className="login-form">
        <h2 id='login-h1'>Login</h2>
        <label htmlFor="email" className='label'>Email: </label><br />
        <input type="text" name='email' id='email' autoComplete='email' placeholder="✉ email..." value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
        <label htmlFor="password" className='label'>Password: </label><br />
        <input name='password' type="password" id='password' placeholder="🗝 password..." value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p style={{ color: 'red' }}>Invalid email or password</p>}
        <div id='login-btn'>
          <Button onClick={login} >Login</Button>
        </div>
      </div>
    </div>

  )
}