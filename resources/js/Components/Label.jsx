const Label = ({ labelFor, value, required, className, ...props }) => {
    if (value) {
        return (
            <label htmlFor={labelFor} className={`block text-sm text-gray-700 ${className}`} {...props}>
                {value}
                <small>{!required ? ' (Opcional)' : ' *'}</small>
            </label>
        )
    }

    return null
}

export default Label
