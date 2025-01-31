interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage: string;
}

const InputField = ({ label, errorMessage, ...props }: InputFieldProps) => {
  return (
    <div>
      <label className="floating-label validator">
        <input
          {...props}
          placeholder={label}
          className={`validator input input-lg w-full ${props.className ?? ""}`}
        />
        <span>{label}</span>
      </label>
      {errorMessage && (
        <p className="validator-hint font-semibold">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
