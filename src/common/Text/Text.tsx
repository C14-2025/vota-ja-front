import React from 'react';
import styles from './Text.module.css';
import type { TextProps } from '../../types/text';

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  as: asProp = 'span',
  children,
  className,
  color,
  align,
  style,
  ...rest
}) => {
  const effectiveVariant = variant as keyof typeof styles;
  const variantClass = styles[effectiveVariant] || styles.body;
  const alignClass = align ? styles[align] : undefined;

  const combinedStyle = { ...(style as React.CSSProperties), color };

  const Component = asProp as React.ElementType;

  return (
    <Component
      className={[styles.root, variantClass, alignClass, className]
        .filter(Boolean)
        .join(' ')}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Text;
