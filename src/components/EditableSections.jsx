import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { loadSiteContent, saveSiteContent } from '../utils/storage';

export default function EditableSections({ contentKey, defaultSections, sectionClass = 'about-section' }) {
  const { user } = useAuth();
  const isChef = user?.role === 'chef';

  const [sections, setSections] = useState(defaultSections);
  const [editing, setEditing] = useState(false);
  const [editSections, setEditSections] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const saved = await loadSiteContent(contentKey);
        if (saved) setSections(saved);
      } catch (err) {
        console.error(`Failed to load ${contentKey} content:`, err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [contentKey]);

  function startEditing() {
    setEditSections(sections.map((s) => ({ ...s })));
    setEditing(true);
    setSaveSuccess('');
  }

  function cancelEditing() {
    setEditing(false);
    setEditSections([]);
    setSaveSuccess('');
  }

  function updateSection(index, field, value) {
    setEditSections((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  function addSection() {
    setEditSections((prev) => [...prev, { title: '', body: '' }]);
  }

  function removeSection(index) {
    setEditSections((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setSaveSuccess('');
    try {
      const cleaned = editSections.filter((s) => s.title.trim() || s.body.trim());
      await saveSiteContent(contentKey, cleaned);
      setSections(cleaned);
      setEditing(false);
      setSaveSuccess('Page updated.');
    } catch (err) {
      console.error(`Failed to save ${contentKey} content:`, err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {isChef && !editing && (
        <button className="btn btn-primary" onClick={startEditing} style={{ marginBottom: '16px' }}>
          Edit Page
        </button>
      )}

      {saveSuccess && <p className="form-success" style={{ marginBottom: '16px' }}>{saveSuccess}</p>}

      {editing ? (
        <div className="about-edit-form">
          <div className="edit-top-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
          </div>
          {editSections.map((section, i) => (
            <div key={i} className="about-edit-section">
              <div className="about-edit-section-header">
                <span className="about-edit-label">Section {i + 1}</span>
                <button className="btn-reject" onClick={() => removeSection(i)}>Remove</button>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(i, 'title', e.target.value)}
                  placeholder="Section title"
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={section.body}
                  onChange={(e) => updateSection(i, 'body', e.target.value)}
                  placeholder="Section content..."
                  rows={5}
                />
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addSection} style={{ marginBottom: '16px' }}>
            + Add Section
          </button>
          <div className="menu-edit-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
          </div>
        </div>
      ) : (
        sections.map((section, i) => (
          <section key={i} className={sectionClass}>
            {section.title && <h2>{section.title}</h2>}
            {section.body.split('\n').map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </section>
        ))
      )}
    </>
  );
}
