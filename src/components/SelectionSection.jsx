import { TAG_LEGEND } from '../data/menuOptions';

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

  function getName(option) {
    return typeof option === 'string' ? option : option.name;
  }

  function getTags(option) {
    return typeof option === 'string' ? [] : (option.tags || []);
  }

  function handleToggle(optionName) {
    if (disabled) return;

    if (isMulti) {
      const alreadySelected = selected.includes(optionName);
      if (alreadySelected) {
        onChange(selected.filter((s) => s !== optionName));
      } else if (selected.length < maxSelections) {
        onChange([...selected, optionName]);
      }
    } else {
      onChange(optionName === selected ? null : optionName);
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
          const name = getName(option);
          const tags = getTags(option);
          const isActive = currentSelected.includes(name);
          const atMax = isMulti && selected.length >= maxSelections && !isActive;
          return (
            <button
              key={name}
              className={`selection-option ${isActive ? 'active' : ''} ${atMax ? 'at-max' : ''}`}
              onClick={() => handleToggle(name)}
              disabled={disabled}
              type="button"
            >
              <span className="option-check">{isActive ? '✓' : ''}</span>
              <span className="option-text">
                {name}
                {tags.length > 0 && (
                  <span className="option-tags">
                    {tags.map((tag) => (
                      <span key={tag} className={`tag tag-${tag.toLowerCase()}`} title={TAG_LEGEND[tag]?.label}>
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
