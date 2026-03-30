import { isOrderingLocked, getCutoffTimeString } from '../utils/cutoff';

export default function StatusBanner() {
  const locked = isOrderingLocked();

  return (
    <div className={`status-banner ${locked ? 'locked' : 'open'}`}>
      <span className="status-dot" />
      <span>
        {locked
          ? `Ordering is closed (cutoff was ${getCutoffTimeString()})`
          : `Ordering is open — cutoff at ${getCutoffTimeString()}`}
      </span>
    </div>
  );
}
