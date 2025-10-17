import React from 'react';
import styles from './IconButton.module.css';

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon?: React.ComponentType<{ size?: number | string; color?: string }>;
  src?: string;
  color?: string;
  size?: number | string;
};

export const IconButton: React.FC<IconButtonProps> = ({
  Icon,
  src,
  color,
  size = 24,
  className,
  children,
  ...rest
}) => {
  const sizeStyle = typeof size === 'number' ? `${size}px` : size;

  return (
    <button
      type="button"
      className={[styles.root, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {Icon ? (
        React.createElement(Icon, { size, color })
      ) : src ? (
        <img
          src={src}
          alt={rest?.['aria-label'] ? String(rest['aria-label']) : 'icon'}
          style={{ width: sizeStyle, height: sizeStyle }}
        />
      ) : (
        <span
          className={styles.placeholder}
          style={{ width: sizeStyle, height: sizeStyle }}
        />
      )}
      {children}
    </button>
  );
};

export default IconButton;
