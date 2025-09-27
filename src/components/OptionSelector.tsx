type Option = {
  value: string;
  label: string;
  helper?: string;
  icon?: string;
};

type OptionSelectorProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

const OptionSelector = ({ label, value, options, onChange }: OptionSelectorProps) => {
  return (
    <fieldset className="selector">
      <legend className="selector__label">{label}</legend>
      <div className="selector__options">
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className={`selector__option${isActive ? ' selector__option--active' : ''}`}
              onClick={() => onChange(option.value)}
            >
              {option.icon && <span className="selector__option-icon" aria-hidden>{option.icon}</span>}
              <span className="selector__option-label">{option.label}</span>
              {option.helper && <small className="selector__option-helper">{option.helper}</small>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default OptionSelector;
