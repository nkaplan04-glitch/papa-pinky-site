import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { loadSiteContent, saveSiteContent } from '../utils/storage';

const DEFAULT_SECTIONS = [
  {
    title: 'Meet Chef Roger Urso',
    body: 'Chef Roger Urso is a personal chef based at the University of Michigan, cooking daily meals for fraternity houses across campus. With a hands-on approach and a real passion for feeding people well, Roger brings restaurant-quality food directly to the house — breakfast, lunch, and dinner.',
  },
  {
    title: 'Experience',
    body: 'With years of experience cooking for large groups — including fraternity houses and campus organizations — Chef Roger knows how to deliver quality meals at scale. Every dish is made fresh with real ingredients. No shortcuts, no frozen meals, no compromises.',
  },
  {
    title: 'Why Houses Choose Papa Pinky',
    body: '• Consistent, reliable daily meal service\n• A rotating menu with real variety\n• Simple online ordering — no more messy group chats or spreadsheets\n• Flexible enough to work with any house schedule\n• Meals that actually taste good',
  },
  {
    title: 'How It Works',
    body: 'Each house logs in, picks meals for the next day, and submits before the cutoff. Chef Roger takes care of everything from shopping to cooking to delivery coordination. It\'s that simple.',
  },
];

export default function About() {
  const { user } = useAuth();
  const isChef = user?.role === 'chef';

  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [editing, setEditing] = useState(false);
  const [editSections, setEditSections] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const saved = await loadSiteContent('about_sections');
        if (saved) setSections(saved);
      } catch (err) {
        console.error('Failed to load about content:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
      await saveSiteContent('about_sections', cleaned);
      setSections(cleaned);
      setEditing(false);
      setSaveSuccess('About page updated.');
    } catch (err) {
      console.error('Failed to save about content:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="page about-page"><p>Loading...</p></div>;
  }

  return (
    <div className="page about-page">
      <div className="create-account-header">
        <h1>About Papa Pinky Meal Service</h1>
        {isChef && !editing && (
          <button className="btn btn-primary" onClick={startEditing}>Edit Page</button>
        )}
      </div>

      {saveSuccess && <p className="form-success" style={{ marginBottom: '16px' }}>{saveSuccess}</p>}

      {editing ? (
        <div className="about-edit-form">
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
          <section key={i} className="about-section">
            <h2>{section.title}</h2>
            {section.body.split('\n').map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
