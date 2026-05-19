import "./Navbar.css";

interface Props {
  onOpenFilters: () => void;
  onOpenSettings: () => void;
  hasActiveFilters: boolean;
}

export function Navbar({ onOpenFilters, onOpenSettings, hasActiveFilters }: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">KT Web</span>
      </div>
      <div className="navbar-right">
        <button className="navbar-button" onClick={onOpenFilters} title="Фильтры">
          <span className="navbar-button-icon">
            🔍
            {hasActiveFilters && <span className="navbar-filter-badge" />}
          </span>
        </button>
        <button className="navbar-button" onClick={onOpenSettings} title="Настройки">
          ⚙️
        </button>
      </div>
    </nav>
  );
}
