import React, { useState, useEffect } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios';

import axiosWithAuth from '../axios'


const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()

  const redirectToLogin = () => { 
    navigate('/')
  }
  const redirectToArticles = () => { 
    navigate('/articles')
   }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
  }
  
  const currentArt = articles.filter( art =>
      (art.article_id === currentArticleId)
        
    )[0] || null

  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    axios.post(`http://localhost:9000/api/login`, {username: username, password: password})
    .then(res =>{
      localStorage.setItem('token',res.data.token)
      // THERE IS ALSO A MESSAGE IN THE RES DATA 
      setMessage(res.data.message)
      redirectToArticles();
    })
    .catch(err =>{
      console.error(err)
    })
    .finally(
      setSpinnerOn(false)
    )
  }

  const getArticles = () => {
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().get()
    .then(res =>{
      setArticles(res.data.articles);
      setMessage(res.data.message)
    })
    .catch(err =>{
      console.error(err)
      redirectToLogin();
    })
    .finally(() =>{
      setSpinnerOn(false)
    }
    )
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage('')
    setSpinnerOn(true)
    axiosWithAuth().post('',article)
    .then((res) =>{
      
      // code runs all of postArticle before running getArticle, making the messages set out of the order i wan.. need to clean that up
      setArticles([
        ...articles,
        res.data.article
      ])
      setMessage(res.data.message)
    })
    .catch(
    )
    .finally(
      setSpinnerOn(false)
  )

  }

  const updateArticle = (article_id, article) => {
    // ✨ implement
    // You got this!
    axiosWithAuth().put(`${article_id}`,article)
    .then((res) =>{
      setArticles(
        articles.map(art =>{
          if(art.article_id === res.data.article.article_id)
            return res.data.article
          else
            return art
        }))
      setMessage(res.data.message)
    }
    )
  }

  const deleteArticle = article_id => {
    // ✨ implement
    axiosWithAuth().delete(`${article_id}`)
    .then((res) =>{
      setMessage(res.data.message)
      setArticles(
        articles.filter(art =>
          (art.article_id !== article_id)
          )
      )
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm currentArticle={currentArt} postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId}/>
              <Articles push={redirectToLogin} getArticles={getArticles} articles={articles} setCurrentArticleId={setCurrentArticleId} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
