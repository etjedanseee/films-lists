import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { privateRoutes, publicRoutes } from './utils/routes';
import { useTypedSelector } from './hooks/useTypedSelector';
import { useActions } from './hooks/useActions';
import supabase from './supabaseClient';
import Header from './UI/Header';
import Loader from './UI/Loader';

function App() {
  const { user } = useTypedSelector(state => state.auth)
  const { lists } = useTypedSelector(state => state.lists)
  const { sites } = useTypedSelector(state => state.sites)
  const { data } = useTypedSelector(state => state.data)
  const { fetchLists, fetchSites, setUser, setResults, fetchData } = useActions()
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          throw new Error(error.message)
        }
        if (data.session) {
          const searchApiSettings = data.session.user.user_metadata?.searchApiSettings || null
          setUser({
            email: data.session.user.email || '',
            id: data.session.user.id,
            metaData: searchApiSettings ? {
              searchApiSettings: searchApiSettings,
            } : null
          })
        }
      } catch (e) {
        console.error('get session error', e)
      } finally {
        setIsCheckingSession(false)
      }
    }
    checkSession()
  }, [])

  useEffect(() => {
    if (user && !lists.length) {
      fetchLists()
    }
  }, [user, lists.length])

  useEffect(() => {
    if (user && !sites.length) {
      fetchSites()
    }
  }, [user, sites.length])

  useEffect(() => {
    if (user && !data.length && location.pathname !== '/') {
      fetchData()
    }
  }, [user, data.length, location.pathname])

  useEffect(() => {
    const lastResults = localStorage.getItem('searchResults')
    if (lastResults) {
      setResults(JSON.parse(lastResults))
    }
  }, [])

  if (isCheckingSession) {
    return (
      <div className='flex-1 flex justify-center items-center bg-mygray'>
        <Loader size='80' />
      </div>
    )
  }

  return (
    <div className='flex-1 bg-bg1 flex flex-col'>
      {user && <Header />}
      <Routes>
        {user
          ? (
            <>
              {
                privateRoutes.map(route => (
                  <Route {...route} key={route.path} />
                ))
              }
            </>
          )
          : (
            <>
              {
                publicRoutes.map(route => (
                  <Route {...route} key={route.path} />
                ))
              }
            </>
          )}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
