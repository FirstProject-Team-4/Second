import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'
import HomeView from './Views/Home-view'
import LoginView from './Views/Login-view'
import RegisterView from './Views/Register-view'
import { Header } from './Components/Header/Header'
import Footer from './Components/Footer'
import Category from './Views/Category-view'

function App() {


  return (
    <>
      <BrowserRouter>
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
      </BrowserRouter>

    </>
  )
}

export default App
