import { autoinject } from 'aurelia-dependency-injection';
import { ValidationController, ValidationRules } from "aurelia-validation";
import { bindable } from "aurelia-framework";
import { PageDefinition } from 'resources/ts-defs/dynamic-ui';

@autoinject()
export class DataDrivenValidationCustomAttribute {
  @bindable validationConfig: PageDefinition;
  @bindable model: any;

  offFuncs: (() => void)[] = [];

  constructor(private validationController: ValidationController) { }

  bind() {
    this.buildValidation();
  }

  unbind() {
    this.turnOffValidation();
  }

  buildValidation() {
    this.turnOffValidation();

    if (this.validationConfig) {
      if (this.validationConfig.customValidation && this.validationConfig.customValidation.rules) {
        this.validationConfig.customValidation.rules.map(({ name, func, message, config }) => {
          ValidationRules.customRule(
            name,
            func,
            message,
            config
          )
        });
      }

      const mappedFields = this.validationConfig.fieldDefinitions
        .sort((f1, f2) => {
          return f1.field.split('.').length - f2.field.split('.').length;
        })
        .map(f => {
          const props = f.field.split('.');
          const propName = props.pop();
          return {
            parent: props.join('.'),
            propName,
            field: f
          };
        }).reduce((map, curr) => {
          const fields = map.get(curr.parent) || [];
          fields.push({
            field: curr.field,
            propName: curr.propName
          });
          map.set(curr.parent, fields);
          return map;
        }, new Map<string, any[]>());

      for (let [parent, fields] of mappedFields) {
        let parentObject = this.model;

        if (parent.length) {
          const props = parent.split('.');
          props.map(p => {
            if (parentObject[p] === undefined) {
              parentObject[p] = {};
            }
            parentObject = parentObject[p]
          });
        }

        let rules: any = ValidationRules;

        fields.map(({ field: { label, validation: validationInfo }, propName }) => {
          if (parentObject[propName] === undefined) {
            parentObject[propName] = null;
          }

          if (validationInfo) {
            rules = rules.ensure(propName);

            if (label) {
              rules = rules.displayName(label);
            }

            Object.getOwnPropertyNames(validationInfo).map(prop => {
              switch (prop) {
                case 'customRules':
                  validationInfo.customRules.map(({ name, configValues }) => {
                    rules = rules.satisfiesRule(name, this.model, ...configValues);
                  });
                  break;
                case 'message':
                  rules = rules.withMessage(validationInfo[prop]);
                  break;
                default:
                  if (typeof validationInfo[prop] !== 'object') {
                    rules = rules[prop](validationInfo[prop]);
                  }
                  break;
              }
            });
          }
        });
        rules.on(parentObject);

        this.offFuncs.push(() => ValidationRules.off(parentObject));
      }
    } else {
      throw new Error('No validation config provided.');
    }
  }

  private turnOffValidation() {
    if (this.offFuncs.length) {
      this.offFuncs.map(f => f());
      this.offFuncs = [];
    }
  }
}
