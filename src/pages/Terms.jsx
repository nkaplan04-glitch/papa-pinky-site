import EditableSections from '../components/EditableSections';

const DEFAULT_SECTIONS = [
  {
    title: 'Contract Agreement',
    body: 'By submitting their deposit and paying for the program, the user agrees that they have entered into a term contract for the duration of the selected plan.',
  },
  {
    title: 'Meal Selection Responsibility',
    body: 'It is the responsibility of the account holders to submit their meal selections to ensure timely delivery. Big Papa Pinky does not choose your meals; however, if you\'d like Big Papa Pinky to put a meal rotation together for your house, we can do that as well to make it stress free.',
  },
  {
    title: 'Refund Policy',
    body: 'There will be no refunds if individuals choose to drop out. If Big Papa Pinky can\'t continue service, all monies will be refunded immediately.',
  },
  {
    title: 'Delivery Access',
    body: 'Access to the driveway and entrance to the facility must be clear and free of debris for our delivery driver to deliver your food.',
  },
  {
    title: 'Delivery Delays',
    body: 'In the event of severe weather or unexpected heavy traffic, construction, etc., delivery may be delayed. In the event of a catastrophic disaster, unexpected event, or power outage, food will be provided and facilitated by Big Papa Pinky.',
  },
  {
    title: 'Certification & Insurance',
    body: 'Big Papa Pinky is certified and fully insured. Big Papa Pinky is a tax-paying LLC registered with the state of Michigan.',
  },
  {
    title: 'Equipment & Pickup',
    body: 'Big Papa Pinky will provide steam tables for each house. The delivery driver will turn the heating elements on, and it is the responsibility of the house members to turn the elements off after meal service is completed. All serving pans will be picked up between meals or the day after, depending on meal rotation.',
  },
];

export default function Terms() {
  return (
    <div className="page terms-page">
      <h1>Terms of Service</h1>
      <EditableSections contentKey="terms_sections" defaultSections={DEFAULT_SECTIONS} sectionClass="terms-section" />
    </div>
  );
}
