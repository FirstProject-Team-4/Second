import { useState, useEffect } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'
import HomeView from './Views/Home-view/Home-view'
import LoginView from './Views/Login-view/Login-view'
import RegisterView from './Views/Register-view/Register-view'
import { Header } from './Components/Header/Header'
import Footer from './Components/Footer'
import Category from './Views/Category-view/Category-view'
import { AppContext } from './Context/AppContext'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/config-firebase'
import { getUserData } from './Service/user-service'

function App() {
  const [context, setContext] = useState({
    user: null as any,
    userData: null,
  })
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      getUserData(user.uid)
        .then(snapshot => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setContext({ user, userData: snapshot.val()[Object.keys(snapshot.val())[0]] });
          }
        })
      }
  }, [user]);


  return (
    <>
      <BrowserRouter>
      <AppContext.Provider value={{ ...context, setContext }}>
        <Header />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/home" element={<HomeView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/category/:id" element={<Category/>} />
          <Route path="*" element={<h1> 404 Not Found</h1>} />
        </Routes>
        <Footer />
      </AppContext.Provider>
      </BrowserRouter>

    </>
  )
}

export default App
