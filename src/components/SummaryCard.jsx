export default function SummaryCard({ house, submission, headcount, planLabel }) {
  const hasSubmitted = !!submission;
  const hasLunch = hasSubmitted && submission.lunch;
  const hasDinner = hasSubmitted && submission.dinner;

  return (
    <div className={`summary-card ${hasSubmitted ? 'submitted' : 'not-submitted'}`}>
      <div className="summary-card-header">
        <div>
          <h3>{house.name}</h3>
          {headcount > 0 && (
            <span className="summary-headcount">
              {hasSubmitted && submission.dailyHeadcount
                ? `${submission.dailyHeadcount} eating`
                : `${headcount} on meal plan`}
              {planLabel && ` · ${planLabel}`}
            </span>
          )}
        </div>
        <span className={`submission-badge ${hasSubmitted ? 'badge-submitted' : 'badge-pending'}`}>
          {hasSubmitted ? 'Submitted' : 'Not Submitted'}
        </span>
      </div>
      {hasSubmitted ? (
        <div className="summary-card-body">
          {hasLunch && (
            <div className="summary-meal">
              <strong>Lunch{submission.lunchTime ? ` — ${submission.lunchTime}` : ''}</strong>
              <p>{submission.lunch}</p>
            </div>
          )}
          {hasDinner && (
            <div className="summary-meal">
              <strong>Dinner{submission.dinnerTime ? ` — ${submission.dinnerTime}` : ''}</strong>
              <p>{submission.dinner}</p>
            </div>
          )}
          {!hasLunch && !hasDinner && (
            <p className="summary-empty">No meals selected.</p>
          )}
          {submission.notes && (
            <div className="summary-notes">
              <strong>Notes:</strong>
              <p>{submission.notes}</p>
            </div>
          )}
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
