import { useState } from 'react'
import { Route,Routes,BrowserRouter } from 'react-router-dom'
import './App.css'
import HomeView from './Views/Home-view'
import LoginView from './Views/Login-view'
import RegisterView from './Views/Register-view'

function App() {


  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView/>} />
        <Route path="/home" element={<HomeView/>} />
        <Route path="/login" element={<LoginView/>} />
        <Route path="/login" element={<RegisterView/>} />

        </Routes>
      </BrowserRouter>
 
    </>
  )
}

export default App
