import { ChangeEvent } from 'react';

type InputFieldProps = {
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  type?: 'text' | 'number';
  min?: number;
  step?: number;
  placeholder?: string;
};

const InputField = ({
  label,
  value,
  onChange,
  type = 'number',
  min,
  step = 1,
  placeholder,
}: InputFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const parsedValue = type === 'number' ? Number(rawValue) : rawValue;
    onChange(parsedValue);
  };

  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input
        className="field__input"
        type={type}
        value={value}
        min={min}
        step={step}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </label>
  );
};

export default InputField;
