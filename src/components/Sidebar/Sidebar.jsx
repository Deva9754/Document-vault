import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  FiChevronDown,
  FiChevronLeft,
  FiX,
  FiUser,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi'
import { mainNav, navGroups, bottomNav } from '../../config/nav'
import { useFamily } from '../../context/FamilyContext'
import { auth } from '../../services/firebase'
import { deleteDocumentsByCategory } from '../../services/documents'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        isActive ? 'sidebar-link active' : 'sidebar-link'
      }
    >
      <item.icon className="sidebar-icon" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  )
}

function NavGroup({ item, collapsed }) {
  const [open, setOpen] = useState(true)
  const Icon = item.icon

  if (collapsed) {
    return (
      <div className="sidebar-group">
        {item.children.map((child) => (
          <NavItem key={child.path} item={child} collapsed={collapsed} />
        ))}
      </div>
    )
  }

  return (
    <div className="sidebar-group">
      <button
        type="button"
        className="sidebar-link sidebar-group-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon className="sidebar-icon" />
        <span>{item.label}</span>
        <FiChevronDown
          className={open ? 'sidebar-chevron open' : 'sidebar-chevron'}
        />
      </button>
      {open && (
        <div className="sidebar-subnav">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                isActive ? 'sidebar-sublink active' : 'sidebar-sublink'
              }
            >
              <child.icon className="sidebar-icon" />
              <span>{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function FamilyGroup({ item, collapsed }) {
  const [open, setOpen] = useState(true)
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { members, addMember, removeMember } = useFamily()
  const navigate = useNavigate()
  const location = useLocation()
  const Icon = item.icon

  const handleSubmit = (e) => {
    e.preventDefault()
    const slug = addMember(name)
    setName('')
    setAdding(false)
    if (slug) navigate(`/family/${slug}`)
  }

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return
    setDeleting(true)
    try {
      const uid = auth.currentUser?.uid
      if (uid) {
        await deleteDocumentsByCategory(uid, memberToDelete.label)
      }
      removeMember(memberToDelete.slug)
      // If we're currently viewing the deleted member, leave the dead route.
      if (location.pathname === `/family/${memberToDelete.slug}`) {
        navigate('/dashboard')
      }
      setMemberToDelete(null)
    } finally {
      setDeleting(false)
    }
  }

  if (collapsed) {
    return (
      <div className="sidebar-group">
        {members.map((member) => (
          <NavLink
            key={member.slug}
            to={`/family/${member.slug}`}
            title={member.label}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            <FiUser className="sidebar-icon" />
          </NavLink>
        ))}
      </div>
    )
  }

  return (
    <div className="sidebar-group">
      <button
        type="button"
        className="sidebar-link sidebar-group-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon className="sidebar-icon" />
        <span>{item.label}</span>
        <FiChevronDown
          className={open ? 'sidebar-chevron open' : 'sidebar-chevron'}
        />
      </button>
      {open && (
        <div className="sidebar-subnav">
          {members.map((member) => (
            <div key={member.slug} className="sidebar-member-row">
              <NavLink
                to={`/family/${member.slug}`}
                className={({ isActive }) =>
                  isActive ? 'sidebar-sublink active' : 'sidebar-sublink'
                }
              >
                <FiUser className="sidebar-icon" />
                <span>{member.label}</span>
              </NavLink>
              <button
                type="button"
                className="sidebar-member-delete"
                title={`Delete ${member.label}`}
                aria-label={`Delete ${member.label}`}
                onClick={() => setMemberToDelete(member)}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}

          {adding ? (
            <form className="sidebar-add-form" onSubmit={handleSubmit}>
              <input
                autoFocus
                className="sidebar-add-input"
                placeholder="Member name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  if (!name.trim()) setAdding(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setName('')
                    setAdding(false)
                  }
                }}
              />
            </form>
          ) : (
            <button
              type="button"
              className="sidebar-sublink sidebar-add-btn"
              onClick={() => setAdding(true)}
            >
              <FiPlus className="sidebar-icon" />
              <span>Add member</span>
            </button>
          )}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(memberToDelete)}
        title="Delete member"
        message={`Remove "${memberToDelete?.label}" from Family? This will permanently delete all documents uploaded for them. This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setMemberToDelete(null)}
      />
    </div>
  )
}

function Sidebar({ mobileOpen = false, onClose }) {
  const [collapsed, setCollapsed] = useState(false)

  const classes = [
    'sidebar',
    collapsed ? 'collapsed' : '',
    mobileOpen ? 'mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={classes}>
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">DV</span>
        {!collapsed && <span className="sidebar-brand-text">Document Vault</span>}
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close menu"
        >
          <FiX />
        </button>
      </div>

      <nav className="sidebar-nav">
        {mainNav.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}

        {navGroups.map((group) =>
          group.label === 'Family' ? (
            <FamilyGroup key={group.label} item={group} collapsed={collapsed} />
          ) : (
            <NavGroup key={group.label} item={group} collapsed={collapsed} />
          )
        )}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && <span className="sidebar-section-label">General</span>}
        {bottomNav.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <FiChevronLeft
            className={collapsed ? 'sidebar-chevron flipped' : 'sidebar-chevron'}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
