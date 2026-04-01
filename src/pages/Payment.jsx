export default function Payment() {
  return (
    <div className="page payment-page">
      <h1>Pricing & Payment Information</h1>

      <section className="meal-plans-section">
        <h2>Fall 2026 Meal Plans</h2>
        <div className="meal-plans">
          <div className="plan-card plan-featured">
            <div className="plan-header">
              <h3>Breakfast, Lunch & Dinner</h3>
              <span className="plan-price">$2,139</span>
              <span className="plan-period">full semester</span>
            </div>
            <ul className="plan-details">
              <li><strong>$7.66</strong> per meal</li>
              <li>279 total meals over 93 days</li>
              <li>$500 deposit due at sign up</li>
              <li>Balance due August 1st, 2026</li>
            </ul>
          </div>

          <div className="plan-card">
            <div className="plan-header">
              <h3>Lunch & Dinner</h3>
              <span className="plan-price">$1,767</span>
              <span className="plan-period">full semester</span>
            </div>
            <ul className="plan-details">
              <li><strong>$9.50</strong> per meal</li>
              <li>186 total meals over 93 days</li>
              <li>$500 deposit due at sign up</li>
              <li>Balance due August 1st, 2026</li>
            </ul>
          </div>

          <div className="plan-card">
            <div className="plan-header">
              <h3>Dinner Only</h3>
              <span className="plan-price">$1,209</span>
              <span className="plan-period">full semester</span>
            </div>
            <ul className="plan-details">
              <li><strong>$13.00</strong> per meal</li>
              <li>93 total meals over 93 days</li>
              <li>$500 deposit due at sign up</li>
              <li>Balance due August 1st, 2026</li>
            </ul>
          </div>
        </div>
        <p className="plan-footnote">All meals include food, labor, and taxes.</p>
      </section>

      <section className="payment-section">
        <h2>How to Pay</h2>
        <p className="payment-intro">
          Payment can be sent via Venmo or Zelle. Please include your house name in the payment memo.
        </p>

        <div className="payment-methods">
          <div className="payment-card">
            <h3>Venmo</h3>
            <p className="payment-handle">@bigpapapinky</p>
            <p className="payment-note">Include your house name in the note.</p>
          </div>

          <div className="payment-card">
            <h3>Zelle</h3>
            <p className="payment-handle">(734) 837-0716</p>
            <p className="payment-note">Include your house name in the memo.</p>
          </div>
        </div>

        <p className="payment-disclaimer">
          Questions about payment? Contact Chef Roger at (734) 837-0716.
        </p>
      </section>
    </div>
  );
}
