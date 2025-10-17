export type CssModuleClasses<T extends string = string> = Record<T, string>;

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
