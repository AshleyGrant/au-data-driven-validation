import { matchesProperty } from './resources/custom-validation-rules/matches-property';
import { NewInstance, inject, bindable } from 'aurelia-framework';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { PageDefinition } from 'resources/ts-defs/dynamic-ui';



@inject(NewInstance.of(ValidationController))
export class App {

  model = { };

  pageInfo : PageDefinition = {
    title: 'Avenger Application',
    customValidation: {
      rules: [
        matchesProperty
      ]
    },
    fieldDefinitions: [
      {
        field: 'names.givenName',
        label: 'Given Name',
        type: 'text',
        validation: {
          required: true,
          minLength: 3,
          message: '${$displayName}\'s gotta be at least three characters long, yo!'
        }
      },
      {
        field: 'names.superHeroName',
        label: 'Super Hero Name',
        type: 'text',
        validation: {
          minLength: 3,
          maxLength: 15,
          customRules: [
            {
              name: 'matchesProperty',
              configValues: ['names.confirmSuperHeroName', 'Confirm Hero Name']
            }
          ]
        }
      },
      {
        field: 'names.confirmSuperHeroName',
        label: 'Confirm Super Hero Name',
        type: 'text',
        validation: {
          minLength: 3,
          maxLength: 15
        }
      },
      {
        field: 'powers.firstPower',
        type: 'text',
        label: 'What\'s your power?',
        validation: {
          displayName: 'First Power',
          minLength: 5,
          maxLength: 10
        }
      },
    ]
  };

  constructor(private validationController: ValidationController) { (this.validationController as any).foo = 'lalalala' }

  bind() {
    // this.buildValidation();
  }

  resetValidation() {
    this.validationController.reset();
  }

  validate() {
    this.validationController.validate();
    console.log(this.model);
    console.log(this.validationController);
  }
}
