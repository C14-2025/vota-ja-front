import React, { useState } from 'react';
import { Eye, EyeSlash } from 'phosphor-react';
import styles from './Input.module.css';
import type { InputProps } from '../../types/input';

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  label,
  error,
  helperText,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type = 'text',
  className,
  disabled,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword && showPassword ? 'text' : type;
  const effectiveVariant = error ? 'error' : variant;

  const inputWrapperClass = [
    styles.inputWrapper,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(' ');

  const inputClass = [
    styles.input,
    styles[effectiveVariant],
    LeftIcon && styles.hasLeftIcon,
    (RightIcon || isPassword) && styles.hasRightIcon,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={inputWrapperClass}>
      {label && (
        <label className={styles.label}>
          {label}
          {rest.required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {LeftIcon && (
          <div className={styles.leftIconContainer}>
            <LeftIcon size={20} color="var(--muted)" />
          </div>
        )}
        <input
          type={effectiveType}
          className={inputClass}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${rest.id}-error` : undefined}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            tabIndex={-1}
            disabled={disabled}
          >
            {showPassword ? (
              <EyeSlash size={20} color="var(--muted)" />
            ) : (
              <Eye size={20} color="var(--muted)" />
            )}
          </button>
        )}
        {RightIcon && !isPassword && (
          <div className={styles.rightIconContainer}>
            <RightIcon size={20} color="var(--muted)" />
          </div>
        )}
      </div>
      {error && (
        <span className={styles.errorText} id={`${rest.id}-error`} role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
};

export default Input;
