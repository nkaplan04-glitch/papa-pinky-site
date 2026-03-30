export default function SelectionSection({
  title,
  note,
  options,
  selected,
  onChange,
  maxSelections,
  disabled,
}) {
  const isMulti = maxSelections > 1;

  function handleToggle(option) {
    if (disabled) return;

    if (isMulti) {
      const alreadySelected = selected.includes(option);
      if (alreadySelected) {
        onChange(selected.filter((s) => s !== option));
      } else if (selected.length < maxSelections) {
        onChange([...selected, option]);
      }
    } else {
      onChange(option === selected ? null : option);
    }
  }

  const currentSelected = isMulti ? selected : (selected ? [selected] : []);

  return (
    <div className="selection-section">
      <h3>
        {title}
        <span className="selection-count">
          {isMulti
            ? ` (${currentSelected.length}/${maxSelections} selected)`
            : currentSelected.length === 1
              ? ' (1/1 selected)'
              : ' (0/1 selected)'}
        </span>
      </h3>
      {note && <p className="selection-note">{note}</p>}
      <div className="selection-options">
        {options.map((option) => {
          const isActive = currentSelected.includes(option);
          const atMax = isMulti && selected.length >= maxSelections && !isActive;
          return (
            <button
              key={option}
              className={`selection-option ${isActive ? 'active' : ''} ${atMax ? 'at-max' : ''}`}
              onClick={() => handleToggle(option)}
              disabled={disabled}
              type="button"
            >
              <span className="option-check">{isActive ? '✓' : ''}</span>
              <span className="option-text">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
