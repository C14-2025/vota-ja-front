export type TextVariant =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'small'
  | 'success'
  | 'error'
  | 'form'
  | 'placeholder';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: React.ElementType;
  color?: string;
  align?: 'left' | 'center' | 'right';
}
