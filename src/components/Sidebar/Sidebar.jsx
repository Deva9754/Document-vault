import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiChevronDown, FiChevronLeft, FiX } from 'react-icons/fi'
import { mainNav, navGroups, bottomNav } from '../../config/nav'

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

        {navGroups.map((group) => (
          <NavGroup key={group.label} item={group} collapsed={collapsed} />
        ))}
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
