import type { ContentType } from "../types";
import "./Navbar.css";

interface NavbarProps {
  contentType: ContentType;
  onToggleContent: () => void;
  hasMultipleSources: boolean;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onOpenSettings: () => void;
}

export function Navbar({
  contentType,
  onToggleContent,
  hasMultipleSources,
  hasActiveFilters,
  onOpenFilters,
  onOpenSettings,
}: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span
          className="navbar-brand"
          onClick={onToggleContent}
          title={contentType === "movies" ? "Переключиться на сериалы" : "Переключиться на фильмы"}
        >
          {contentType === "movies" ? "KT Web" : "ST Web"}
          {hasMultipleSources && (
            <span className="navbar-brand-dots">
              <span className={`navbar-dot${contentType === "movies" ? " navbar-dot-active" : ""}`} />
              <span className={`navbar-dot${contentType === "series" ? " navbar-dot-active" : ""}`} />
            </span>
          )}
        </span>
      </div>
      <div className="navbar-right">
        <button className="navbar-button" onClick={onOpenFilters} title="Открыть фильтры">
          <span className="navbar-button-icon">
            🔍
            {hasActiveFilters && <span className="navbar-filter-badge" />}
          </span>
        </button>
        <button className="navbar-button" onClick={onOpenSettings} title="Открыть настройки">
          ⚙️
        </button>
      </div>
    </nav>
  );
}
