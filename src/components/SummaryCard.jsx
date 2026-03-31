export default function SummaryCard({ house, submission }) {
  const hasSubmitted = !!submission;

  return (
    <div className={`summary-card ${hasSubmitted ? 'submitted' : 'not-submitted'}`}>
      <div className="summary-card-header">
        <h3>{house.name}</h3>
        <span className={`submission-badge ${hasSubmitted ? 'badge-submitted' : 'badge-pending'}`}>
          {hasSubmitted ? 'Submitted' : 'Not Submitted'}
        </span>
      </div>
      {hasSubmitted ? (
        <div className="summary-card-body">
          <div className="summary-meal">
            <strong>Breakfast{submission.breakfastTime ? ` — ${submission.breakfastTime}` : ''}</strong>
            <ul>
              {submission.breakfast.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="summary-meal">
            <strong>Lunch{submission.lunchTime ? ` — ${submission.lunchTime}` : ''}</strong>
            <p>{submission.lunch}</p>
          </div>
          <div className="summary-meal">
            <strong>Dinner{submission.dinnerTime ? ` — ${submission.dinnerTime}` : ''}</strong>
            <p>{submission.dinner}</p>
          </div>
          {submission.submittedAt && (
            <p className="summary-timestamp">
              Last updated: {new Date(submission.submittedAt).toLocaleString()}
            </p>
          )}
        </div>
      ) : (
        <p className="summary-empty">No selections submitted yet.</p>
      )}
    </div>
  );
}
