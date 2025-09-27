import { ChangeEvent } from 'react';

type InputFieldProps = {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  type?: 'text' | 'number' | 'range';
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  helper?: string;
  multiline?: boolean;
  maxLength?: number;
  rows?: number;
};

const InputField = ({
  label,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step = 1,
  placeholder,
  helper,
  multiline = false,
  maxLength,
  rows = 3,
}: InputFieldProps) => {
  const containerClass = `field${multiline ? ' field--multiline' : ''}${type === 'range' ? ' field--range' : ''}`;
  const inputClass = `field__input${multiline ? ' field__input--textarea' : ''}${type === 'range' ? ' field__input--range' : ''}`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const parsedValue = type === 'text' ? rawValue : Number(rawValue);
    onChange(parsedValue);
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className={containerClass}>
      <span className="field__label">{label}</span>
      {multiline ? (
        <textarea
          className={inputClass}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          onChange={handleTextareaChange}
        />
      ) : (
        <input
          className={inputClass}
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          onChange={handleChange}
        />
      )}
      {helper && <small className="field__helper">{helper}</small>}
    </label>
  );
};

export default InputField;
