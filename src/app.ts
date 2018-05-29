import { matchesProperty } from './resources/custom-validation-rules/matches-property';
import { NewInstance, inject, bindable, observable } from 'aurelia-framework';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { PageDefinition } from 'resources/ts-defs/dynamic-ui';
import { I18N } from 'aurelia-i18n';

@inject(NewInstance.of(ValidationController), I18N)
export class App {
  @observable selectedLocale;
  locales = [
    {
      displayName: 'Australia',
      localeCode: 'en-AU'
    }, {
      displayName: 'Middle Earth',
      localeCode: 'en-NZ'
    }
  ];

  model = {
    phoneNumbers: [
      // {
      //   number: '12345'
      // }, {
      //   number: '67890'
      // }
    ]
  };

  pageInfo: PageDefinition = {
    title: 'avengerApplication',
    customValidation: {
      rules: [
        matchesProperty
      ]
    },
    fieldDefinitions: [
      {
        field: 'names.givenName',
        label: 'givenName',
        type: 'text',
        placeholder: 'givenNamePlaceholder',
        validation: {
          required: true,
          minLength: 3,
          message: '${$displayName}\'s gotta be at least three characters long, yo!'
        }
      },
      {
        field: 'phoneNumbers',
        label: 'phoneNumbers',
        type: 'array',
        validation: {
          required: true,
          minItems: 1,
          message: 'There must be at least one phone number.'
        },
        arrayItemFieldDefinitions: [{
          field: 'number',
          label: 'phoneNumber',
          type: 'text',
          validation: {
            required: true,
            minLength: 5,
          }
        }]
      },
      // {
      //   field: 'names.superHeroName',
      //   label: 'heroName',
      //   type: 'text',
      //   validation: {
      //     minLength: 3,
      //     maxLength: 15,
      //     customRules: [
      //       {
      //         name: 'matchesProperty',
      //         configValues: ['names.confirmSuperHeroName', 'confirmHeroName']
      //       }
      //     ]
      //   }
      // },
      // {
      //   field: 'names.confirmSuperHeroName',
      //   label: 'confirmHeroName',
      //   type: 'text',
      //   validation: {
      //     minLength: 3,
      //     maxLength: 15
      //   }
      // },
      // {
      //   field: 'powers.firstPower',
      //   type: 'text',
      //   label: 'whatsPower',
      //   validation: {
      //     displayName: 'firstPower',
      //     minLength: 5,
      //     maxLength: 10
      //   }
      // },
    ]
  };

  constructor(private validationController: ValidationController, private i18n: I18N) { (this.validationController as any).foo = 'lalalala' }

  bind() {
    // this.buildValidation();
  }

  async selectedLocaleChanged(newValue) {
    await this.i18n.setLocale(newValue.localeCode);
  }

  resetValidation() {
    this.validationController.reset();
  }

  validate() {
    this.validationController.validate();
  }
}
