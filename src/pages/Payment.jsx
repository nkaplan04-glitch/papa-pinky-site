import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { loadSiteContent, saveSiteContent } from '../utils/storage';

const DEFAULT_CONTENT = {
  semesterTitle: 'Fall 2026 Meal Plans',
  semesterPlans: [
    {
      name: 'Breakfast, Lunch & Dinner',
      price: '$2,277',
      period: 'full semester',
      featured: true,
      spotsLeft: '',
      details: ['$7.67 per meal', '297 total meals over 99 days', 'All university breaks factored in', '$500 deposit due at sign up', 'Balance due August 1st, 2026'],
    },
    {
      name: 'Lunch & Dinner',
      price: '$1,881',
      period: 'full semester',
      featured: false,
      spotsLeft: '',
      details: ['$9.50 per meal', '198 total meals over 99 days', 'All university breaks factored in', '$500 deposit due at sign up', 'Balance due August 1st, 2026'],
    },
    {
      name: 'Dinner Only',
      price: '$1,287',
      period: 'full semester',
      featured: false,
      spotsLeft: '',
      details: ['$13.00 per meal', '99 total meals over 99 days', 'All university breaks factored in', '$500 deposit due at sign up', 'Balance due August 1st, 2026'],
    },
  ],
  semesterFootnote: 'All meals include food, labor, and taxes. Meals are served 6 days a week (every day except Saturday).',
  blockTitle: 'Meal Block Plans',
  blockIntro: 'Looking for a shorter-term commitment? Choose a meal block and mix up breakfast, lunch, or dinner however you want.',
  blockPlans: [
    {
      name: '55 Meal Block',
      price: '$632.50',
      period: '55 meals',
      featured: false,
      spotsLeft: '',
      details: ['$11.50 per meal', 'Mix breakfast, lunch, or dinner', 'Use over 55 days', '$300 deposit due at sign up', 'Balance due August 1st, 2026'],
    },
    {
      name: '125 Meal Block',
      price: '$1,375',
      period: '125 meals',
      featured: true,
      spotsLeft: '',
      details: ['$11.00 per meal', 'Mix breakfast, lunch, or dinner', 'Use over 125 days', '$300 deposit due at sign up', 'Balance due August 1st, 2026'],
    },
    {
      name: '80 Meal Block',
      price: '$1,080',
      period: '80 meals',
      featured: false,
      spotsLeft: '',
      details: ['$13.50 per meal', 'Mix breakfast, lunch, or dinner', 'Use over 80 days', '$300 deposit due at sign up', 'Balance due August 1st, 2026'],
    },
  ],
  blockFootnote: 'All meals include food, labor, and taxes.',
  paymentIntro: 'Payment can be sent via Venmo or Zelle. Please include your house name in the payment memo.',
  venmoHandle: '@bigpapapinky',
  venmoNote: 'Include your house name in the note.',
  zelleHandle: '(734) 837-0716',
  zelleNote: 'Include your house name in the memo.',
  disclaimer: 'Questions about payment? Contact Chef Roger at (734) 837-0716.',
};

function PlanCard({ plan }) {
  const spots = plan.spotsLeft;
  const hasSpots = spots !== undefined && spots !== null && spots !== '';
  const spotsNum = parseInt(spots, 10);
  const isFull = hasSpots && spotsNum === 0;
  const isLow = hasSpots && spotsNum > 0 && spotsNum <= 3;

  return (
    <div className={`plan-card ${plan.featured ? 'plan-featured' : ''}`}>
      {hasSpots && (
        <div className={`spots-badge ${isFull ? 'spots-full' : isLow ? 'spots-low' : 'spots-available'}`}>
          {isFull ? 'Full' : `${spots} spots left`}
        </div>
      )}
      <div className="plan-header">
        <h3>{plan.name}</h3>
        <span className="plan-price">{plan.price}</span>
        <span className="plan-period">{plan.period}</span>
      </div>
      <ul className="plan-details">
        {plan.details.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    </div>
  );
}

function PlanEditor({ plan, onChange, onRemove }) {
  function updateDetail(index, value) {
    const updated = [...plan.details];
    updated[index] = value;
    onChange({ ...plan, details: updated });
  }

  function addDetail() {
    onChange({ ...plan, details: [...plan.details, ''] });
  }

  function removeDetail(index) {
    onChange({ ...plan, details: plan.details.filter((_, i) => i !== index) });
  }

  return (
    <div className="about-edit-section">
      <div className="about-edit-section-header">
        <span className="about-edit-label">{plan.name || 'Plan'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              checked={plan.featured}
              onChange={(e) => onChange({ ...plan, featured: e.target.checked })}
            />
            Featured
          </label>
          {onRemove && <button className="btn-reject" onClick={onRemove}>Remove</button>}
        </div>
      </div>
      <div className="form-group">
        <label>Plan Name</label>
        <input type="text" value={plan.name} onChange={(e) => onChange({ ...plan, name: e.target.value })} />
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Price</label>
          <input type="text" value={plan.price} onChange={(e) => onChange({ ...plan, price: e.target.value })} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Period</label>
          <input type="text" value={plan.period} onChange={(e) => onChange({ ...plan, period: e.target.value })} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Spots Left</label>
          <input type="text" value={plan.spotsLeft || ''} onChange={(e) => onChange({ ...plan, spotsLeft: e.target.value })} placeholder="Leave blank to hide" />
        </div>
      </div>
      <div className="form-group">
        <label>Details</label>
        {plan.details.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <input type="text" value={d} onChange={(e) => updateDetail(i, e.target.value)} style={{ flex: 1 }} />
            <button className="btn-reject" onClick={() => removeDetail(i)} style={{ padding: '4px 10px', fontSize: '13px' }}>×</button>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={addDetail} style={{ fontSize: '13px', padding: '4px 12px' }}>+ Detail</button>
      </div>
    </div>
  );
}

export default function Payment() {
  const { user } = useAuth();
  const isChef = user?.role === 'chef';

  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const saved = await loadSiteContent('payment_content');
        if (saved) setContent(saved);
      } catch (err) {
        console.error('Failed to load payment content:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function startEditing() {
    setEditContent(JSON.parse(JSON.stringify(content)));
    setEditing(true);
    setSaveSuccess('');
  }

  function cancelEditing() {
    setEditing(false);
    setEditContent(null);
    setSaveSuccess('');
  }

  function updateField(field, value) {
    setEditContent((prev) => ({ ...prev, [field]: value }));
  }

  function updatePlan(listKey, index, updatedPlan) {
    setEditContent((prev) => {
      const updated = [...prev[listKey]];
      updated[index] = updatedPlan;
      return { ...prev, [listKey]: updated };
    });
  }

  function addPlan(listKey) {
    setEditContent((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], { name: '', price: '', period: '', featured: false, details: [''] }],
    }));
  }

  function removePlan(listKey, index) {
    setEditContent((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveSuccess('');
    try {
      await saveSiteContent('payment_content', editContent);
      setContent(editContent);
      setEditing(false);
      setSaveSuccess('Pricing page updated.');
    } catch (err) {
      console.error('Failed to save payment content:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="page payment-page"><p>Loading...</p></div>;
  }

  if (editing && editContent) {
    return (
      <div className="page payment-page">
        <h1>Pricing & Payment Information</h1>
        <div className="about-edit-form">
          <div className="edit-top-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
          </div>
          <h2 style={{ marginBottom: '12px' }}>Semester Plans</h2>
          <div className="form-group">
            <label>Section Title</label>
            <input type="text" value={editContent.semesterTitle} onChange={(e) => updateField('semesterTitle', e.target.value)} />
          </div>
          {editContent.semesterPlans.map((plan, i) => (
            <PlanEditor key={i} plan={plan} onChange={(p) => updatePlan('semesterPlans', i, p)} onRemove={() => removePlan('semesterPlans', i)} />
          ))}
          <button className="btn btn-secondary" onClick={() => addPlan('semesterPlans')} style={{ marginBottom: '16px' }}>+ Add Semester Plan</button>
          <div className="form-group">
            <label>Semester Footnote</label>
            <input type="text" value={editContent.semesterFootnote} onChange={(e) => updateField('semesterFootnote', e.target.value)} />
          </div>

          <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>Block Plans</h2>
          <div className="form-group">
            <label>Section Title</label>
            <input type="text" value={editContent.blockTitle} onChange={(e) => updateField('blockTitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Intro Text</label>
            <textarea value={editContent.blockIntro} onChange={(e) => updateField('blockIntro', e.target.value)} rows={2} />
          </div>
          {editContent.blockPlans.map((plan, i) => (
            <PlanEditor key={i} plan={plan} onChange={(p) => updatePlan('blockPlans', i, p)} onRemove={() => removePlan('blockPlans', i)} />
          ))}
          <button className="btn btn-secondary" onClick={() => addPlan('blockPlans')} style={{ marginBottom: '16px' }}>+ Add Block Plan</button>
          <div className="form-group">
            <label>Block Footnote</label>
            <input type="text" value={editContent.blockFootnote} onChange={(e) => updateField('blockFootnote', e.target.value)} />
          </div>

          <h2 style={{ marginTop: '24px', marginBottom: '12px' }}>Payment Methods</h2>
          <div className="form-group">
            <label>Payment Intro</label>
            <input type="text" value={editContent.paymentIntro} onChange={(e) => updateField('paymentIntro', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Venmo Handle</label>
              <input type="text" value={editContent.venmoHandle} onChange={(e) => updateField('venmoHandle', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Venmo Note</label>
              <input type="text" value={editContent.venmoNote} onChange={(e) => updateField('venmoNote', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Zelle Handle</label>
              <input type="text" value={editContent.zelleHandle} onChange={(e) => updateField('zelleHandle', e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Zelle Note</label>
              <input type="text" value={editContent.zelleNote} onChange={(e) => updateField('zelleNote', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Disclaimer</label>
            <input type="text" value={editContent.disclaimer} onChange={(e) => updateField('disclaimer', e.target.value)} />
          </div>

          <div className="menu-edit-actions" style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button className="btn btn-secondary" onClick={cancelEditing}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page payment-page">
      <h1>Pricing & Payment Information</h1>

      {isChef && (
        <button className="btn btn-primary" onClick={startEditing} style={{ marginBottom: '20px' }}>Edit Page</button>
      )}
      {saveSuccess && <p className="form-success" style={{ marginBottom: '16px' }}>{saveSuccess}</p>}

      <section className="meal-plans-section">
        <h2>{content.semesterTitle}</h2>
        <div className="meal-plans">
          {content.semesterPlans.map((plan, i) => (
            <PlanCard key={i} plan={plan} />
          ))}
        </div>
        <p className="plan-footnote">{content.semesterFootnote}</p>
      </section>

      <section className="meal-plans-section">
        <h2>{content.blockTitle}</h2>
        <p className="block-plan-intro">{content.blockIntro}</p>
        <div className="meal-plans">
          {content.blockPlans.map((plan, i) => (
            <PlanCard key={i} plan={plan} />
          ))}
        </div>
        <p className="plan-footnote">{content.blockFootnote}</p>
      </section>

      <section className="payment-section">
        <h2>How to Pay</h2>
        <p className="payment-intro">{content.paymentIntro}</p>
        <div className="payment-methods">
          <div className="payment-card">
            <h3>Venmo</h3>
            <p className="payment-handle">{content.venmoHandle}</p>
            <p className="payment-note">{content.venmoNote}</p>
          </div>
          <div className="payment-card">
            <h3>Zelle</h3>
            <p className="payment-handle">{content.zelleHandle}</p>
            <p className="payment-note">{content.zelleNote}</p>
          </div>
        </div>
        <p className="payment-disclaimer">{content.disclaimer}</p>
      </section>
    </div>
  );
}
