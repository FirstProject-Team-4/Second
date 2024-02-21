import { useState, useEffect } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import './App.css'
import HomeView from './Views/Home-view/Home-view'
import LoginView from './Views/Login-view/Login-view'
import RegisterView from './Views/Register-view/Register-view'
import { Header } from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Category from './Views/Category-view/Category-view'
import { AppContext } from './Context/AppContext'
import CreatePost from './Views/CreatePost/CreatePost'
import AllPosts from './Views/AllPosts/AllPosts-view/AllPosts'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './config/config-firebase'
import { getUserData } from './Service/user-service'
import SinglePostView from './Views/AllPosts/SinglePost-view/SinglePost-view'
import Profile from './Views/Profile-view/Profile-view'
import AllUsers from './Views/AllUsers/AllUsers'
import Authentication from './Hoc/Authentication'
import ChatView from './Views/Friends-view/Chat-view'

/**
 * The main component of the application.
 * Renders the header, main content, and footer.
 * Manages the user context and authentication state.
 */
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
            setContext({ user, userData: snapshot.val()[Object.keys(snapshot.val())[0]] });
          }
        })
    }

  }, [user, context.user]);


  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{ ...context, setContext }}>
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/home" element={<HomeView />} />
              <Route path="/chat/:id" element={<ChatView />} />
              <Route path="/allUsers" element={<Authentication>{<AllUsers />}</Authentication>} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/register" element={<RegisterView />} />
              <Route path='/profile/:id' element={<Profile />} />
              <Route path="/posts" element={<AllPosts />} />
              <Route path="/posts/:id" element={<SinglePostView />} />
              <Route path="/category/:categoryName" element={<Category />} />
              <Route path="/posts-create" element={<CreatePost />} />
              <Route path="/posts-create" element={<CreatePost />} />
              <Route path="*" element={<h1> 404 Not Found</h1>} />
            </Routes>
          </div>
          <Footer />
        </AppContext.Provider>
      </BrowserRouter>
    </>
  );
}


export default App
