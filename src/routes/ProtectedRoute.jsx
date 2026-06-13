import { Navigate, Outlet } from 'react-router-dom'

// Wraps routes that require authentication.
// Pass the current user (or auth state) via the `user` prop.
// Supports both a single child and nested routes (via <Outlet />).
function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children ?? <Outlet />
}

export default ProtectedRoute
