import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import EditableSections from '../components/EditableSections';

const DEFAULT_SECTIONS = [
  {
    title: '',
    body: 'Consistent breakfast, lunch, and dinner delivery service Sunday through Friday.',
  },
  {
    title: '',
    body: 'Chef Roger Urso handles daily meal planning and cooking for fraternity houses at the University of Michigan. No more messy spreadsheets — just pick your meals, submit before the cutoff, and we take care of the rest.',
  },
];

const DEFAULT_STEPS = [
  {
    title: 'Log In',
    body: 'Each house has its own login. Sign in to access your meal selection page.',
  },
  {
    title: 'Pick Your Meals',
    body: 'Choose 2 breakfast items, 1 lunch, and 1 dinner from the daily menu for the next day.',
  },
  {
    title: 'Submit Before 3:30 AM',
    body: 'Lock in your selections before the cutoff. Chef Roger handles the rest.',
  },
];

export default function Home() {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <img src={logo} alt="Papa Pinky Meal Service" className="hero-logo" />
        <h1>Papa Pinky Meal Service</h1>
        <EditableSections contentKey="home_hero" defaultSections={DEFAULT_SECTIONS} sectionClass="hero-editable-section" />
        <div className="hero-ctas">
          <Link to="/login" className="btn btn-primary">House Login</Link>
          <Link to="/about" className="btn btn-secondary">About Chef Roger</Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <EditableSections contentKey="home_steps" defaultSections={DEFAULT_STEPS} sectionClass="step" />
      </section>
    </div>
  );
}
