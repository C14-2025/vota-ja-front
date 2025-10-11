import React from "react";
import { CircleNotch } from "phosphor-react";
import styles from "./Button.module.css";
import type { ButtonProps } from "../../types/button";

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  className,
  disabled,
  type = "button",
  ...rest
}) => {
  const isDisabled = disabled || loading;

  const buttonClass = [
    styles.root,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20;

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span className={styles.loadingIcon}>
          <CircleNotch size={iconSize} weight="bold" />
        </span>
      ) : (
        LeftIcon && (
          <span className={styles.leftIcon}>
            <LeftIcon size={iconSize} />
          </span>
        )
      )}
      {children && <span className={styles.content}>{children}</span>}
      {!loading && RightIcon && (
        <span className={styles.rightIcon}>
          <RightIcon size={iconSize} />
        </span>
      )}
    </button>
  );
};

export default Button;
