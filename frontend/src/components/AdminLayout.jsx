import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBuilding,
  FaThLarge,
  FaHome,
  FaFileAlt,
  FaEnvelopeOpen,
  FaImages,
  FaBullhorn,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
} from 'react-icons/fa';

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: <FaThLarge /> },
  { to: '/admin/apartments', label: 'Apartments', icon: <FaHome /> },
  { to: '/admin/applications', label: 'Applications', icon: <FaFileAlt /> },
  { to: '/admin/inquiries', label: 'Inquiries', icon: <FaEnvelopeOpen /> },
  { to: '/admin/gallery', label: 'Gallery', icon: <FaImages /> },
  { to: '/admin/announcements', label: 'Announcements', icon: <FaBullhorn /> },
];

export default function AdminLayout({ children, title }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__logo">
          <FaBuilding />
          <span>Solara<b>Admin</b></span>
        </div>

        <nav className="admin-sidebar__nav">
          {MENU.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="admin-sidebar__logout" onClick={handleLogout} id="admin-logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-topbar__toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            id="admin-sidebar-toggle"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="admin-topbar__title">{title}</h1>
          <div className="admin-topbar__user">
            <FaUser />
            <span>{admin?.full_name || admin?.username || 'Admin'}</span>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
