export interface PageInfo {
  fields: {
    field: string;
    validation?: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      equals?: any;
      customRules?: { name: string, config: (...args) => {} }[]
    };
  }[];
  customValidation?: {
    rules: {
      name: string;
      func: (...args) => boolean | Promise<boolean>;
      message: string;
      config: (...args) => {};
    }[];
  };
}
