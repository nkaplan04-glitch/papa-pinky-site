import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <img src={logo} alt="Papa Pinky Meal Service" className="hero-logo" />
        <h1>Papa Pinky Meal Service</h1>
        <p className="tagline">Consistent food delivery service Sunday through Friday.</p>
        <p className="hero-description">
          Chef Roger Urso handles daily meal planning and cooking for fraternity houses
          at the University of Michigan. No more messy spreadsheets — just pick your meals,
          submit before the cutoff, and we take care of the rest.
        </p>
        <div className="hero-ctas">
          <Link to="/login" className="btn btn-primary">House Login</Link>
          <Link to="/about" className="btn btn-secondary">About Chef Roger</Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Log In</h3>
            <p>Each house has its own login. Sign in to access your meal selection page.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Pick Your Meals</h3>
            <p>Choose 2 breakfast items, 1 lunch, and 1 dinner from the daily menu for the next day.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Submit Before 3:30 AM</h3>
            <p>Lock in your selections before the cutoff. Chef Roger handles the rest.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
