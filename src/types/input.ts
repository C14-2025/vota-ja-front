export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ComponentType<{ size?: number | string; color?: string }>;
  rightIcon?: React.ComponentType<{ size?: number | string; color?: string }>;
}
