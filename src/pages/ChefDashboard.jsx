import { useEffect, useState } from 'react';
import {
  loadAllHouses, loadAllSubmissions, deleteHouse,
  loadAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem,
  loadSuggestions, updateSuggestionStatus, clearReviewedSuggestions,
} from '../utils/storage';
import { createHouseAccount } from '../utils/auth';
import { TAG_LEGEND } from '../data/menuOptions';
import SummaryCard from '../components/SummaryCard';

const ALL_TAGS = Object.keys(TAG_LEGEND);

export default function ChefDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  const [houses, setHouses] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // House creation form
  const [showForm, setShowForm] = useState(false);
  const [formHouseName, setFormHouseName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formEmailConfirm, setFormEmailConfirm] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formPasswordConfirm, setFormPasswordConfirm] = useState('');
  const [formHeadcount, setFormHeadcount] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Menu item form
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuCategory, setMenuCategory] = useState('lunch_dinner');
  const [menuTags, setMenuTags] = useState([]);
  const [menuError, setMenuError] = useState('');
  const [menuFormLoading, setMenuFormLoading] = useState(false);

  // Inline editing
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [editLoading, setEditLoading] = useState(false);

  // Suggestion review
  const [reviewingId, setReviewingId] = useState(null);
  const [reviewName, setReviewName] = useState('');
  const [reviewCategory, setReviewCategory] = useState('lunch_dinner');
  const [reviewTags, setReviewTags] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  async function loadData() {
    try {
      const [allHouses, allSubs, allMenu, allSuggestions] = await Promise.all([
        loadAllHouses(),
        loadAllSubmissions(),
        loadAllMenuItems(),
        loadSuggestions(),
      ]);
      setHouses(allHouses);
      setSubmissions(allSubs);
      setMenuItems(allMenu);
      setSuggestions(allSuggestions);
    } catch (err) {
      console.error('Failed to load chef dashboard:', err);
      setLoadError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  // ===== House Account Creation =====
  async function handleCreateAccount(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setFormLoading(true);

    if (!formHouseName.trim() || !formEmail.trim() || !formEmailConfirm.trim() || !formPassword || !formPasswordConfirm || !formHeadcount) {
      setFormError('All fields are required.');
      setFormLoading(false);
      return;
    }
    if (formEmail.trim() !== formEmailConfirm.trim()) {
      setFormError('Emails do not match.');
      setFormLoading(false);
      return;
    }
    if (formPassword !== formPasswordConfirm) {
      setFormError('Passwords do not match.');
      setFormLoading(false);
      return;
    }
    if (formPassword.length < 6) {
      setFormError('Password must be at least 6 characters.');
      setFormLoading(false);
      return;
    }

    try {
      await createHouseAccount({
        email: formEmail.trim(),
        password: formPassword,
        houseName: formHouseName.trim(),
        headcount: parseInt(formHeadcount, 10),
      });
      setFormSuccess(`Account created for ${formHouseName.trim()}. Send them their login credentials.`);
      setFormHouseName('');
      setFormEmail('');
      setFormEmailConfirm('');
      setFormPassword('');
      setFormPasswordConfirm('');
      setFormHeadcount('');
      await loadData();
    } catch (err) {
      setFormError(err.message || 'Failed to create account.');
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteHouse(houseId, houseName) {
    if (!window.confirm(`Remove ${houseName}? This will delete their account and all their orders.`)) return;
    try {
      await deleteHouse(houseId);
      await loadData();
    } catch (err) {
      console.error('Failed to delete house:', err);
    }
  }

  // ===== Menu Management =====
  function toggleTag(tag) {
    setMenuTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  async function handleAddMenuItem(e) {
    e.preventDefault();
    setMenuError('');
    if (!menuName.trim()) {
      setMenuError('Item name is required.');
      return;
    }

    setMenuFormLoading(true);
    try {
      await addMenuItem({ name: menuName.trim(), category: menuCategory, tags: menuTags });
      setMenuName('');
      setMenuCategory('lunch_dinner');
      setMenuTags([]);
      setShowMenuForm(false);
      await loadData();
    } catch (err) {
      setMenuError(err.message || 'Failed to add item.');
    } finally {
      setMenuFormLoading(false);
    }
  }

  async function handleDeleteMenuItem(id, name) {
    if (!window.confirm(`Remove "${name}" from the menu?`)) return;
    try {
      await deleteMenuItem(id);
      await loadData();
    } catch (err) {
      console.error('Failed to delete menu item:', err);
    }
  }

  function startEditing(item) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditTags([...item.tags]);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditName('');
    setEditCategory('');
    setEditTags([]);
  }

  function toggleEditTag(tag) {
    setEditTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  async function handleSaveEdit() {
    if (!editName.trim()) return;
    setEditLoading(true);
    try {
      await updateMenuItem(editingId, {
        name: editName.trim(),
        category: editCategory,
        tags: editTags,
      });
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error('Failed to update menu item:', err);
    } finally {
      setEditLoading(false);
    }
  }

  // ===== Suggestions =====
  function startReviewing(suggestion) {
    setReviewingId(suggestion.id);
    setReviewName(suggestion.suggestion_text);
    setReviewCategory(suggestion.category === 'general' ? 'lunch_dinner' : suggestion.category);
    setReviewTags([]);
  }

  function cancelReviewing() {
    setReviewingId(null);
    setReviewName('');
    setReviewCategory('lunch_dinner');
    setReviewTags([]);
  }

  function toggleReviewTag(tag) {
    setReviewTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  }

  async function handleAddFromReview(suggestionId) {
    if (!reviewName.trim()) return;
    setReviewLoading(true);
    try {
      await addMenuItem({ name: reviewName.trim(), category: reviewCategory, tags: reviewTags });
      await updateSuggestionStatus(suggestionId, 'approved');
      cancelReviewing();
      await loadData();
    } catch (err) {
      console.error('Failed to add from suggestion:', err);
    } finally {
      setReviewLoading(false);
    }
  }

  async function handleDismissSuggestion(suggestionId) {
    try {
      await updateSuggestionStatus(suggestionId, 'dismissed');
      await loadData();
    } catch (err) {
      console.error('Failed to dismiss suggestion:', err);
    }
  }

  async function handleClearReviewed() {
    if (!window.confirm('Clear all reviewed suggestions? This cannot be undone.')) return;
    try {
      await clearReviewedSuggestions();
      await loadData();
    } catch (err) {
      console.error('Failed to clear suggestions:', err);
    }
  }

  // ===== Computed values =====
  const submittedCount = houses.filter((h) => submissions[h.id]).length;
  const notSubmittedCount = houses.length - submittedCount;
  const totalServings = houses.reduce((sum, h) => {
    const sub = submissions[h.id];
    return sum + (sub?.dailyHeadcount || 0);
  }, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateString = tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const breakfastMenuItems = menuItems.filter((i) => i.category === 'breakfast');
  const lunchDinnerMenuItems = menuItems.filter((i) => i.category === 'lunch_dinner');
  const pendingSuggestions = suggestions.filter((s) => s.status === 'pending');
  const reviewedSuggestions = suggestions.filter((s) => s.status !== 'pending');

  if (loading) {
    return <div className="page chef-dashboard"><p>Loading...</p></div>;
  }

  if (loadError) {
    return <div className="page chef-dashboard"><p className="form-error">{loadError}</p></div>;
  }

  return (
    <div className="page chef-dashboard">
      <div className="dashboard-header">
        <h1>Chef Dashboard</h1>
      </div>

      <div className="chef-tabs">
        <button
          className={`chef-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`chef-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu ({menuItems.length})
        </button>
        <button
          className={`chef-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions {pendingSuggestions.length > 0 && <span className="tab-badge">{pendingSuggestions.length}</span>}
        </button>
      </div>

      {/* ===== ORDERS TAB ===== */}
      {activeTab === 'orders' && (
        <>
          <p className="dashboard-date">Orders for {dateString}</p>

          <div className="create-account-section">
            <div className="create-account-header">
              <h2>Manage Houses</h2>
              <button
                className="btn btn-primary"
                onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess(''); }}
              >
                {showForm ? 'Cancel' : '+ New House Account'}
              </button>
            </div>

            {showForm && (
              <form className="create-account-form" onSubmit={handleCreateAccount}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ca-house">House Name</label>
                    <input id="ca-house" type="text" placeholder="e.g. Sigma Chi" value={formHouseName} onChange={(e) => setFormHouseName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ca-headcount">Headcount</label>
                    <input id="ca-headcount" type="number" min="1" placeholder="e.g. 30" value={formHeadcount} onChange={(e) => setFormHeadcount(e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ca-email">Email</label>
                    <input id="ca-email" type="email" placeholder="house@example.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ca-email-confirm">Confirm Email</label>
                    <input id="ca-email-confirm" type="email" placeholder="Re-enter email" value={formEmailConfirm} onChange={(e) => setFormEmailConfirm(e.target.value)} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ca-password">Password</label>
                    <input id="ca-password" type="password" placeholder="At least 6 characters" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ca-password-confirm">Confirm Password</label>
                    <input id="ca-password-confirm" type="password" placeholder="Re-enter password" value={formPasswordConfirm} onChange={(e) => setFormPasswordConfirm(e.target.value)} required />
                  </div>
                </div>
                {formError && <p className="form-error">{formError}</p>}
                {formSuccess && <p className="form-success">{formSuccess}</p>}
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            )}

            {houses.length > 0 && (
              <div className="house-list">
                {houses.map((house) => (
                  <div key={house.id} className="house-list-item">
                    <div className="house-list-info">
                      <strong>{house.house_name}</strong>
                      <span>{house.headcount} people on meal plan</span>
                    </div>
                    <button className="btn-reject" onClick={() => handleDeleteHouse(house.id, house.house_name)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chef-summary-bar">
            <div className="chef-stat">
              <span className="stat-number">{houses.length}</span>
              <span className="stat-label">Active Houses</span>
            </div>
            <div className="chef-stat">
              <span className="stat-number stat-green">{submittedCount}</span>
              <span className="stat-label">Submitted</span>
            </div>
            <div className="chef-stat">
              <span className="stat-number stat-red">{notSubmittedCount}</span>
              <span className="stat-label">Not Submitted</span>
            </div>
            <div className="chef-stat">
              <span className="stat-number">{totalServings}</span>
              <span className="stat-label">Total Servings</span>
            </div>
          </div>

          <div className="chef-cards">
            {houses.map((house) => (
              <SummaryCard
                key={house.id}
                house={{ id: house.id, name: house.house_name }}
                submission={submissions[house.id] || null}
                headcount={house.headcount}
              />
            ))}
            {houses.length === 0 && (
              <p className="summary-empty">No houses yet. Create an account to get started.</p>
            )}
          </div>
        </>
      )}

      {/* ===== MENU TAB ===== */}
      {activeTab === 'menu' && (
        <div className="chef-menu-section">
          <div className="create-account-header">
            <h2>Menu Items</h2>
            <button
              className="btn btn-primary"
              onClick={() => { setShowMenuForm(!showMenuForm); setMenuError(''); }}
            >
              {showMenuForm ? 'Cancel' : '+ Add Item'}
            </button>
          </div>

          {showMenuForm && (
            <form className="create-account-form" onSubmit={handleAddMenuItem}>
              <div className="form-group">
                <label htmlFor="mi-name">Item Name</label>
                <input
                  id="mi-name"
                  type="text"
                  placeholder="e.g. Grilled chicken with rice and vegetables"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mi-category">Category</label>
                <select id="mi-category" value={menuCategory} onChange={(e) => setMenuCategory(e.target.value)}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch_dinner">Lunch / Dinner</option>
                </select>
              </div>
              <div className="form-group">
                <label>Allergen / Dietary Tags</label>
                <div className="tag-picker">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-pick ${menuTags.includes(tag) ? 'tag-picked' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag} — {TAG_LEGEND[tag].label}
                    </button>
                  ))}
                </div>
              </div>
              {menuError && <p className="form-error">{menuError}</p>}
              <button type="submit" className="btn btn-primary" disabled={menuFormLoading}>
                {menuFormLoading ? 'Adding...' : 'Add to Menu'}
              </button>
            </form>
          )}

          {[
            { label: 'Breakfast', items: breakfastMenuItems },
            { label: 'Lunch / Dinner', items: lunchDinnerMenuItems },
          ].map((group) => (
            <div className="menu-manage-section" key={group.label}>
              <h3>{group.label} ({group.items.length})</h3>
              {group.items.length > 0 ? (
                <div className="menu-manage-list">
                  {group.items.map((item) => (
                    editingId === item.id ? (
                      <div key={item.id} className="menu-manage-item editing">
                        <div className="menu-edit-form">
                          <div className="form-group">
                            <label>Name</label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Category</label>
                            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                              <option value="breakfast">Breakfast</option>
                              <option value="lunch_dinner">Lunch / Dinner</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Tags</label>
                            <div className="tag-picker">
                              {ALL_TAGS.map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  className={`tag-pick ${editTags.includes(tag) ? 'tag-picked' : ''}`}
                                  onClick={() => toggleEditTag(tag)}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="menu-edit-actions">
                            <button className="btn btn-primary" onClick={handleSaveEdit} disabled={editLoading}>
                              {editLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button className="btn btn-secondary" onClick={cancelEditing}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={item.id} className="menu-manage-item">
                        <div className="menu-manage-info">
                          <span className="menu-manage-name">{item.name}</span>
                          <span className="menu-manage-tags">
                            {item.tags.map((tag) => (
                              <span key={tag} className={`tag tag-${tag.toLowerCase()}`}>{tag}</span>
                            ))}
                          </span>
                        </div>
                        <div className="menu-manage-actions">
                          <button className="btn-edit" onClick={() => startEditing(item)}>
                            Edit
                          </button>
                          <button className="btn-reject" onClick={() => handleDeleteMenuItem(item.id, item.name)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <p className="summary-empty">No {group.label.toLowerCase()} items.</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== SUGGESTIONS TAB ===== */}
      {activeTab === 'suggestions' && (
        <div className="chef-suggestions-section">
          <h2>Suggestions from Houses</h2>

          {pendingSuggestions.length > 0 ? (
            <>
              <h3>Pending Review ({pendingSuggestions.length})</h3>
              <div className="suggestions-review-list">
                {pendingSuggestions.map((s) => (
                  reviewingId === s.id ? (
                    <div key={s.id} className="suggestion-review-card editing">
                      <div className="menu-edit-form">
                        <p className="suggestion-review-meta" style={{ marginBottom: '12px' }}>
                          <span className="suggestion-review-house">{s.profiles?.house_name || 'Unknown'}</span>
                          {' suggested: '}
                          <em>{s.suggestion_text}</em>
                        </p>
                        <div className="form-group">
                          <label>Menu Item Name</label>
                          <input
                            type="text"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="Edit the name as you'd like it on the menu"
                          />
                        </div>
                        <div className="form-group">
                          <label>Category</label>
                          <select value={reviewCategory} onChange={(e) => setReviewCategory(e.target.value)}>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch_dinner">Lunch / Dinner</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Allergen / Dietary Tags</label>
                          <div className="tag-picker">
                            {ALL_TAGS.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                className={`tag-pick ${reviewTags.includes(tag) ? 'tag-picked' : ''}`}
                                onClick={() => toggleReviewTag(tag)}
                              >
                                {tag} — {TAG_LEGEND[tag].label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="menu-edit-actions">
                          <button className="btn btn-primary" onClick={() => handleAddFromReview(s.id)} disabled={reviewLoading}>
                            {reviewLoading ? 'Adding...' : 'Add to Menu'}
                          </button>
                          <button className="btn btn-secondary" onClick={cancelReviewing}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={s.id} className="suggestion-review-card">
                      <div className="suggestion-review-info">
                        <p className="suggestion-review-text">{s.suggestion_text}</p>
                        <div className="suggestion-review-meta">
                          <span className="suggestion-review-house">{s.profiles?.house_name || 'Unknown'}</span>
                          <span className="suggestion-review-category">
                            {s.category === 'breakfast' ? 'Breakfast' : s.category === 'lunch_dinner' ? 'Lunch/Dinner' : 'General'}
                          </span>
                          <span className="suggestion-review-date">
                            {new Date(s.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="suggestion-review-actions">
                        <button className="btn-approve" onClick={() => startReviewing(s)}>
                          Review
                        </button>
                        <button className="btn-reject" onClick={() => handleDismissSuggestion(s.id)}>
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </>
          ) : (
            <p className="summary-empty">No pending suggestions.</p>
          )}

          {reviewedSuggestions.length > 0 && (
            <>
              <div className="create-account-header" style={{ marginTop: '32px' }}>
                <h3>Reviewed ({reviewedSuggestions.length})</h3>
                <button className="btn-reject" onClick={handleClearReviewed}>
                  Clear All
                </button>
              </div>
              <div className="suggestions-review-list">
                {reviewedSuggestions.map((s) => (
                  <div key={s.id} className={`suggestion-review-card suggestion-reviewed suggestion-${s.status}`}>
                    <div className="suggestion-review-info">
                      <p className="suggestion-review-text">{s.suggestion_text}</p>
                      <div className="suggestion-review-meta">
                        <span className="suggestion-review-house">{s.profiles?.house_name || 'Unknown'}</span>
                        <span className={`suggestion-status status-${s.status}`}>
                          {s.status === 'approved' ? 'Added to Menu' : 'Dismissed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
