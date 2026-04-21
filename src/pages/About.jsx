import EditableSections from '../components/EditableSections';

const DEFAULT_SECTIONS = [
  {
    title: 'Meet Chef Roger Urso',
    body: 'Chef Roger Urso is a personal chef based at the University of Michigan, cooking daily meals for fraternity houses across campus. With a hands-on approach and a real passion for feeding people well, Roger brings restaurant-quality food directly to the house — lunch and dinner.',
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
    body: 'Each house logs in, picks meals for any day using the calendar, and submits their order. Chef Roger takes care of everything from shopping to cooking to delivery coordination. It\'s that simple.',
  },
];

export default function About() {
  return (
    <div className="page about-page">
      <h1>About Papa Pinky Meal Service</h1>
      <EditableSections contentKey="about_sections" defaultSections={DEFAULT_SECTIONS} sectionClass="about-section" />
    </div>
  );
}
