import './Register-view.css';
import { useEffect, useState } from 'react';
import Button from '../../Components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../Service/auth-service';
import { createUserHandle, getUserByHandle } from '../../Service/user-service';
export default function RegisterView() {

  const nav = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState({
    username: '',
    email: '',
    password: ''
  
  });

useEffect(() => {
  document.body.style.backgroundImage='url(https://images.squarespace-cdn.com/content/v1/5ad3c92c12b13fb122e90d3c/1566025164525-SF6MXDK5SDTFFGGAAYQV/IMG_5616.JPG)';
return () =>{ document.body.style.backgroundImage='none';
}
},[] );

  const submit = async (): Promise<void> => {
     let username=''
      let email=''
      let password=''
try {
  const checkUser=await getUserByHandle(form.username)
  if(checkUser.exists()){
    username='Username is already taken';
  }
  else if(form.username.length < 4 || form.username.length > 32){
    username='Username must be between 4 and 32 symbols.';
  }
  else{
    username='valid';
  }
} catch (error) {
  console.log(error);
}
  if(!form.email.includes('@')){
   email='Email must be a valid email.';
  }
  else{
    email='valid';
  }
  
  if(form.password.length < 6 || form.password.length > 32){
    password='Password must be between 6 and 32 symbols.';
  }
  else{
    password='valid';
  }
  if(username!=='valid' || email!=='valid' || password!=='valid'){
    setError({username:username,email:email,password:password});
    return;
  }

 try{
    const response = await registerUser(form.email, form.password);
    createUserHandle(form.username, response.user.uid, form.email);
    loginUser(form.email, form.password);
    nav('/');
 }catch(error:any){
  setError({username:'valid',password:'valid',email:'Email is already in use'});
  return;
 }
    
    

  }
  const usernameColor =():string=>{
    if(error.username==='valid'){
      return 'green';
    }
    if(error.username){
      return 'red';
    }
    return 'black';
  }
  const emailColor =():string=>{
    if(error.email==='valid'){
      return 'green';
    }
    if(error.email){
      return 'red';
    }
    return 'black';
  }
  const passwordColor =():string=>{
    if(error.password==='valid'){
      return 'green';
    }
    if(error.password){
      return 'red';
    }
    return 'black';
  }


  return (
    <div className="register-view">
      <div className="register-form">
        <h1 id='register'>Register</h1>
        <label htmlFor="username">Username: </label><br />
        <input style={{border:`1px solid ${usernameColor()}`}} type="text" name='username' id='username' placeholder="☺ Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /><br />
        {error.username &&error.username!=='valid' && <h5 style={{ color: 'red' }}>{error.username}</h5>}
        <label htmlFor="email">Email: </label><br />
        <input style={{border:`1px solid ${emailColor()}`}} type="text" name='email' id='email' placeholder="✉ email..." value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><br />
        {error.email &&error.email!=='valid'&& <h5 style={{ color: 'red' }}>{error.email}</h5>}
        <label htmlFor="password">Password: </label><br />
        <input style={{border:`1px solid ${passwordColor()}`}} name='password' type="password" id='password' placeholder="🗝 password..." value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error.password &&error.password!=='valid'&& <h5 style={{ color: 'red' }}>{error.password}</h5>}
        <div className='register-btn'>
        <Button onClick={submit} >Register</Button>
        </div>
      </div>
    </div>
  )

}