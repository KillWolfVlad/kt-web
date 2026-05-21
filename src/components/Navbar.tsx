import type { ContentType } from "../types";
import "./Navbar.css";

interface NavbarProps {
  contentType: ContentType;
  onToggleContent: () => void;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onOpenSettings: () => void;
}

export function Navbar({
  contentType,
  onToggleContent,
  hasActiveFilters,
  onOpenFilters,
  onOpenSettings,
}: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-brand" onClick={onToggleContent}>
          {contentType === "movies" ? "KT Web" : "ST Web"}
        </span>
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
