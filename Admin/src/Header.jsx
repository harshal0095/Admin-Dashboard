export default function Header({ user, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <span className="brand">Rocker Admin</span>
        <span className="brand-tag">Analytics</span>
      </div>
      <div className="topbar-actions">
        <div className="profile-card">
          <div className="profile-avatar">{user?.name?.charAt(0) ?? 'A'}</div>
          <div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
