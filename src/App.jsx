import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './services/firebase'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Settings from './pages/Settings/Settings'
import CategoryPage from './pages/CategoryPage/CategoryPage'
import FamilyMemberPage from './pages/CategoryPage/FamilyMemberPage'
import ProtectedRoute from './routes/ProtectedRoute'
import { navGroups } from './config/nav'
import './App.css'

// Family members are dynamic (managed in FamilyContext), so they are routed
// separately via /family/:slug instead of being generated from the static nav.
const categoryRoutes = navGroups
  .filter((group) => group.label !== 'Family')
  .flatMap((group) =>
    group.children.map((child) => ({
      path: child.path,
      title: child.label,
      group: group.label,
      // "All Documents" lists everything; others filter by their label.
      showAll: child.path === '/documents',
      category: child.label,
    }))
  )

function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthLoading(false)
    })

    return unsubscribe
  }, [])

  if (authLoading) {
    return <div className="auth-loading">Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        <Route
          element={
            <ProtectedRoute user={user}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          {categoryRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <CategoryPage
                  title={route.title}
                  group={route.group}
                  category={route.category}
                  showAll={route.showAll}
                />
              }
            />
          ))}
          <Route path="/family/:slug" element={<FamilyMemberPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
