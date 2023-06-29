const Label = ({ labelFor, value, required, ...props }) => {
   if (value) {
    return (
      <label htmlFor={labelFor} className={`block text-sm text-gray-700 ${props.className || ''}`} {...props}>
        {value}
        {!required ? '(Opcional)' : <small> *</small>}
      </label>
    );
  }

  return null;
};

export default Label;
