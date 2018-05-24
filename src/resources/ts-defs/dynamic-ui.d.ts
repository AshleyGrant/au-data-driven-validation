export interface PageDefinition {
  title: string;
  fieldDefinitions: FieldDefinition[];
  columns?: number;
  customValidation?: {
    rules: CustomValidationRuleConfig[];
  };
}

export interface CustomValidationRuleConfig {
  name: string;
  func: (...args) => boolean | Promise<boolean>;
  message: string;
  config: (...args) => {};
}

export interface FieldDefinition {
  field: string;
  type: string;
  label?: string;
  column?: number;
  colspan?: number;
  rowspan?: number;
  placeholder?: string;
  readonly?: boolean;
  defaultValue?: any;
  values?: FieldValueDefiniton[];
  validation?: FieldValidationDefinition;
  arrayItemFieldDefinitions?: FieldDefinition[];
}

export interface FieldValidationDefinition {
  displayName?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  equals?: any;
  email?: boolean;
  message?: string;
  matches?: RegExp;
  minItems?: number;
  maxItems?: number;
  customRules?: FieldCustomValidationRuleConfig[]
}

export interface FieldCustomValidationRuleConfig {
  name: string,
  configValues: any[]
}

export interface FieldValueDefiniton {
  text: string;
  value: any;
}
