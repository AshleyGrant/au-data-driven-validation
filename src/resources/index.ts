import {FrameworkConfiguration, PLATFORM} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./attributes/data-driven-validation'),
    PLATFORM.moduleName('./elements/page-builder'),
    PLATFORM.moduleName('./binding-behaviors/dynamic-expression'),
    PLATFORM.moduleName('./value-converters/number')
  ]);
}
