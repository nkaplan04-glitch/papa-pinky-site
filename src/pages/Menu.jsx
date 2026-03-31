import { useState } from 'react';
import { breakfastOptions, lunchDinnerOptions, BREAKFAST_NOTE, TAG_LEGEND } from '../data/menuOptions';

const DIET_FILTERS = ['V', 'VG', 'K'];

export default function Menu() {
  const [activeFilter, setActiveFilter] = useState(null);

  function matchesFilter(item) {
    if (!activeFilter) return true;
    return item.tags.includes(activeFilter);
  }

  const filteredBreakfast = breakfastOptions.filter(matchesFilter);
  const filteredLunchDinner = lunchDinnerOptions.filter(matchesFilter);

  return (
    <div className="page menu-page">
      <h1>Menu</h1>
      <p className="menu-intro">
        Everything Papa Pinky Meal Service offers. Each dish is tagged with allergen and dietary information for your convenience.
      </p>

      <div className="menu-legend">
        <h3>Key</h3>
        <div className="legend-items">
          {Object.entries(TAG_LEGEND).map(([code, { label }]) => (
            <div key={code} className="legend-item">
              <span className={`tag tag-${code.toLowerCase()}`}>{code}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="menu-filters">
        <span className="filter-label">Filter:</span>
        {DIET_FILTERS.map((code) => (
          <button
            key={code}
            className={`filter-btn ${activeFilter === code ? 'filter-active' : ''}`}
            onClick={() => setActiveFilter(activeFilter === code ? null : code)}
            type="button"
          >
            {TAG_LEGEND[code].label}
          </button>
        ))}
        {activeFilter && (
          <button
            className="filter-btn filter-clear"
            onClick={() => setActiveFilter(null)}
            type="button"
          >
            Show All
          </button>
        )}
      </div>

      <section className="menu-section">
        <h2>Breakfast</h2>
        <p className="menu-section-note">{BREAKFAST_NOTE}</p>
        {filteredBreakfast.length > 0 ? (
          <div className="menu-items">
            {filteredBreakfast.map((item) => (
              <div key={item.name} className="menu-item">
                <span className="menu-item-name">{item.name}</span>
                <span className="menu-item-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className={`tag tag-${tag.toLowerCase()}`} title={TAG_LEGEND[tag]?.label}>
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="menu-empty">No breakfast items match this filter.</p>
        )}
      </section>

      <section className="menu-section">
        <h2>Lunch / Dinner</h2>
        {filteredLunchDinner.length > 0 ? (
          <div className="menu-items">
            {filteredLunchDinner.map((item) => (
              <div key={item.name} className="menu-item">
                <span className="menu-item-name">{item.name}</span>
                <span className="menu-item-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className={`tag tag-${tag.toLowerCase()}`} title={TAG_LEGEND[tag]?.label}>
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="menu-empty">No lunch/dinner items match this filter.</p>
        )}
      </section>
    </div>
  );
}
