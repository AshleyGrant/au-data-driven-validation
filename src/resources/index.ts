import {FrameworkConfiguration, PLATFORM} from 'aurelia-framework';
import { i18tnValidation } from 'resources/startup/i18tn-validation';

export function configure(config: FrameworkConfiguration) {
  i18tnValidation(config.aurelia);
  
  config.globalResources([
    PLATFORM.moduleName('./elements/debug'),
    PLATFORM.moduleName('./attributes/data-driven-validation'),
    PLATFORM.moduleName('./elements/page-builder'),
    PLATFORM.moduleName('./binding-behaviors/dynamic-expression'),
    PLATFORM.moduleName('./value-converters/number')
  ]);
}
