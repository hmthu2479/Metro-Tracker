//png img file is non-js.ts so typescript can't handle them
declare module '*.png' {
    const value: string;
    export default value;
  }
  