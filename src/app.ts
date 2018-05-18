import { NewInstance, inject } from 'aurelia-framework';
import { ValidationRules, ValidationController } from 'aurelia-validation';

@inject(NewInstance.of(ValidationController))
export class App {
  offFuncs: (() => void)[] = [];

  model = {
    name: 'hereiam'
    // myProp: {
    //   nestedProp: {
    //     deepProp: 4
    //   },

    // }
  };

  pageInfo = {
    customValidation: {
      rules: [
        {
          name: 'matchesProperty',
          func: (value, obj, model, otherPropertyName) => {
            const otherProp = getDeeplyNestedProperty(model, otherPropertyName);

            return value === null
              || value === undefined
              || value === ''
              || otherProp === null
              || otherProp === undefined
              || otherProp === ''
              || value === otherProp
          },
          message: '${$displayName} must match ${$getDisplayName($config.otherPropertyDisplayName || $config.otherPropertyName)}',
          config: (model, otherPropertyName, otherPropertyDisplayName) => ({ model, otherPropertyName, otherPropertyDisplayName })
        }
      ]
    },
    fields: [
      {
        field: 'simpleProp',
        validation: {
          required: true,
          minLength: 3
        }
      },
      {
        field: 'myProp.passwords.password',
        validation: {
          minLength: 3,
          maxLength: 6,
          customRules: [
            {
              name: 'matchesProperty',
              config: model => [model, 'myProp.passwords.confirmPassword', 'Confirm Password']
            }
          ]
        }
      },
      {
        field: 'myProp.passwords.confirmPassword',
        validation: {
          minLength: 3,
          maxLength: 6
        }
      },
      {
        field: 'myProp.nestedProp.deepProp',
        validation: {
          minLength: 5,
          maxLength: 10
        }
      },
    ]
  };

  constructor(private validationController: ValidationController) { }

  bind() {
    this.buildValidation();
  }

  resetValidation() {
    this.validationController.reset();
  }

  validate() {
    this.validationController.validate();
    console.log(this.model);
    console.log(this.validationController);
  }

  buildValidation() {
    if (this.pageInfo.customValidation && this.pageInfo.customValidation.rules) {
      this.pageInfo.customValidation.rules.map(({ name, func, message, config }) => {
        ValidationRules.customRule(
          name,
          func,
          message,
          config
        )
      });
    }

    const mappedFields = this.pageInfo.fields
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

    console.log('mappedFields', mappedFields);

    for (let [parent, fields] of mappedFields) {
      console.log('parent', parent);
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

      console.log('parentObject', parentObject);

      let rules: any = ValidationRules;

      fields.map(({ field: { label, validation: validationInfo }, propName }) => {
        if (parentObject[propName] === undefined) {
          parentObject[propName] = null;
        }

        rules = rules.ensure(propName);

        if (label) {
          rules.displayName(label);
        }

        Object.getOwnPropertyNames(validationInfo).map(prop => {
          if (prop === 'customRules') {
            validationInfo.customRules.map(({ name, config }) => {
              rules = rules.satisfiesRule(name, ...config(this.model));
            });
          } else if (typeof validationInfo[prop] !== 'object') {
            rules = rules[prop](validationInfo[prop]);
          }
        });
      });
      rules.on(parentObject);

      this.offFuncs.push(() => ValidationRules.off(parentObject));
    }

    console.log(this.model);
  }
}


export class NumberValueConverter {
  fromView(value) {
    try {
      return parseInt(value);
    } catch {
      return 0;
    }
  }
}

function getDeeplyNestedProperty(obj, property) {
  if (property) {
    const props = property.split('.');
    props.map(p => {
      if (obj[p] === undefined) {
        obj[p] = {};
      }
      obj = obj[p]
    });
  }

  return obj;
}
