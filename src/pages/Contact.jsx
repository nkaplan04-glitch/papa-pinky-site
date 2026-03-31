export default function Contact() {
  return (
    <div className="page contact-page">
      <h1>Contact Us</h1>
      <p className="contact-intro">
        Have questions about Papa Pinky Meal Service? Want to get your house set up?
        Reach out and we'll get back to you.
      </p>

      <div className="contact-card">
        <h2>Chef Roger Urso</h2>
        <div className="contact-detail">
          <strong>Phone</strong>
          <a href="tel:+17348370716">(734) 837-0716</a>
        </div>
        <div className="contact-detail">
          <strong>Email</strong>
          <a href="mailto:papapinkymealservice@gmail.com">papapinkymealservice@gmail.com</a>
        </div>
        <p className="contact-note">
          Include your house name and any details about your meal plan needs.
          We typically respond within 24 hours.
        </p>
      </div>

      <div className="contact-card">
        <h2>Getting Started</h2>
        <p>If your house is interested in signing up for daily meal service:</p>
        <ol className="contact-steps">
          <li>Send us an email or give us a call with your house name and estimated headcount</li>
          <li>We'll set up a time to discuss the menu and logistics</li>
          <li>Once confirmed, Chef Roger will create your account and send you your login</li>
        </ol>
      </div>
    </div>
  );
}
