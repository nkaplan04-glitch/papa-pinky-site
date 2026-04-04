import EditableSections from '../components/EditableSections';

const DEFAULT_SECTIONS = [
  {
    title: '',
    body: 'Have questions about Papa Pinky Meal Service? Want to get your house set up? Reach out and we\'ll get back to you.',
  },
  {
    title: 'Chef Roger Urso',
    body: 'Phone: (734) 837-0716\nEmail: ursoroger60@gmail.com\nInclude your house name and any details about your meal plan needs. We typically respond within 24 hours.',
  },
  {
    title: 'Getting Started',
    body: 'If your house is interested in signing up for daily meal service:\n1. Send us an email or give us a call with your house name and estimated headcount\n2. We\'ll set up a time to discuss the menu and logistics\n3. Once confirmed, Chef Roger will create your account and send you your login',
  },
];

export default function Contact() {
  return (
    <div className="page contact-page">
      <h1>Contact Us</h1>
      <EditableSections contentKey="contact_sections" defaultSections={DEFAULT_SECTIONS} sectionClass="contact-editable-section" />
    </div>
  );
}
