import { useState, useEffect } from 'react';
import { TAG_LEGEND } from '../data/menuOptions';
import { loadMenuItems } from '../utils/storage';

const DIET_FILTERS = ['V', 'VG', 'K'];

export default function Menu() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [lunchDinnerItems, setLunchDinnerItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const items = await loadMenuItems();
        setLunchDinnerItems(items.filter((i) => i.category === 'lunch_dinner'));
      } catch (err) {
        console.error('Failed to load menu:', err);
        setLoadError('Failed to load menu. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function matchesFilter(item) {
    if (!activeFilter) return true;
    return item.tags.includes(activeFilter);
  }

  const filteredLunchDinner = lunchDinnerItems.filter(matchesFilter);

  if (loading) {
    return <div className="page menu-page"><p>Loading menu...</p></div>;
  }

  if (loadError) {
    return <div className="page menu-page"><p className="form-error">{loadError}</p></div>;
  }

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
        <h2>Lunch / Dinner</h2>
        {filteredLunchDinner.length > 0 ? (
          <div className="menu-items">
            {filteredLunchDinner.map((item) => (
              <div key={item.id} className="menu-item">
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
