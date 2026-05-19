import "./Navbar.css";

interface Props {
  onOpenFilters: () => void;
  onOpenSettings: () => void;
}

export function Navbar({ onOpenFilters, onOpenSettings }: Props) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand">KT Web</span>
      </div>
      <div className="navbar-right">
        <button className="navbar-button" onClick={onOpenFilters} title="Фильтры">
          🔍
        </button>
        <button className="navbar-button" onClick={onOpenSettings} title="Настройки">
          ⚙️
        </button>
      </div>
    </nav>
  );
}
