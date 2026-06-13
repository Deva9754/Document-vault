import { useState, useEffect, useRef, useMemo } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../../services/firebase'
import { subscribeDocuments } from '../../services/documents'
import ViewDialog from '../ViewDialog/ViewDialog'
import { FiSearch, FiBell, FiChevronDown, FiMenu, FiFileText } from 'react-icons/fi'

function getInitials(value) {
  if (!value) return 'U'
  return value.charAt(0).toUpperCase()
}

function matchesQuery(doc, query) {
  const haystack = [doc.title, doc.fileName, doc.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

function Header({ onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [allDocs, setAllDocs] = useState([])
  const [selectedDoc, setSelectedDoc] = useState(null)
  const searchRef = useRef(null)

  const user = auth.currentUser
  const displayName = user?.displayName || user?.email || 'User'

  // Subscribe once to every document belonging to the signed-in user.
  useEffect(() => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    const unsubscribe = subscribeDocuments(uid, setAllDocs)
    return unsubscribe
  }, [])

  // Close the results dropdown when clicking outside the search box.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const trimmed = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!trimmed) return []
    return allDocs.filter((doc) => matchesQuery(doc, trimmed)).slice(0, 8)
  }, [allDocs, trimmed])

  const showDropdown = searchFocused && trimmed.length > 0

  const handleLogout = async () => {
    await signOut(auth)
  }

  const handleResultClick = (doc) => {
    setSelectedDoc(doc)
    setSearchFocused(false)
    setQuery('')
  }

  return (
    <header className="header">
      <button
        type="button"
        className="header-menu-btn"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <FiMenu />
      </button>

      <div className="header-search" ref={searchRef}>
        <FiSearch className="header-search-icon" />
        <input
          type="search"
          placeholder="Search documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
        />

        {showDropdown && (
          <div className="search-results">
            {results.length === 0 ? (
              <p className="search-empty">No documents match “{query}”.</p>
            ) : (
              results.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  className="search-result"
                  onClick={() => handleResultClick(doc)}
                >
                  <span className="search-result-icon">
                    <FiFileText />
                  </span>
                  <span className="search-result-body">
                    <span className="search-result-title">{doc.title}</span>
                    <span className="search-result-meta">{doc.category}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        )}
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

      <ViewDialog
        open={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        document={selectedDoc}
      />
    </header>
  )
}

export default Header
