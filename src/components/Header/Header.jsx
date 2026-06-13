import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi'

function getInitials(value) {
  if (!value) return 'U'
  return value.charAt(0).toUpperCase()
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = auth.currentUser
  const displayName = user?.displayName || user?.email || 'User'

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <header className="header">
      <div className="header-search">
        <FiSearch className="header-search-icon" />
        <input type="search" placeholder="Search documents..." />
      </div>

      <div className="header-actions">
        <button type="button" className="header-icon-btn" title="Notifications">
          <FiBell />
          <span className="header-badge">3</span>
        </button>

        <div className="header-user">
          <button
            type="button"
            className="header-profile"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                getInitials(displayName)
              )}
            </span>
            <span className="header-profile-name">{displayName}</span>
            <FiChevronDown />
          </button>

          {menuOpen && (
            <div className="user-menu">
              <span className="user-menu-email">{displayName}</span>
              <button type="button" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
