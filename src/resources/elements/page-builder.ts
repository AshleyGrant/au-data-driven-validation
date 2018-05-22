import { autoinject, bindable, bindingMode, computedFrom, customElement, PLATFORM } from 'aurelia-framework';
import { ValidationRules, ValidationController, FluentRules } from 'aurelia-validation';
import { PageDefinition } from 'resources/ts-defs/dynamic-ui';

// These calls are here simply to tell webpack to include these files
// There's probably a better way to do this, but I don't care ATM
PLATFORM.moduleName('./dynamic-form-fields/dropdown.html')
PLATFORM.moduleName('./dynamic-form-fields/text.html')
PLATFORM.moduleName('./dynamic-form-fields/textarea.html')

@customElement('page-builder')
@autoinject()
export class PageBuilder {
  @bindable() definition: PageDefinition;
  @bindable() model: any = {};

  private validationSubscription = {
    dispose: () => null
  };

  constructor(private validationController: ValidationController) {

  }

  @bindable({ defaultBindingMode: bindingMode.fromView })
  public isValid: boolean;

  async validate() {
    await this.validationController.validate();
  }

  bind() {
    this.validationSubscription = this.validationController.subscribe((e) => this.isValid = e.errors.length === 0);
  }

  detached() {
    this.validationSubscription.dispose();
  }
}
