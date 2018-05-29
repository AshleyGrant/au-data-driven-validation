import { FieldDefinition } from './../ts-defs/dynamic-ui.d';
import { I18N } from 'aurelia-i18n';
import { autoinject, bindable, bindingMode, computedFrom, customElement, PLATFORM, inject } from 'aurelia-framework';
import { ValidationRules, ValidationController, FluentRules } from 'aurelia-validation';
import { PageDefinition } from 'resources/ts-defs/dynamic-ui';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

@customElement('page-builder')
@inject(ValidationController, Element, I18N, EventAggregator)
export class PageBuilder {
  @bindable() definition: PageDefinition | FieldDefinition;
  @bindable() model: any = {};
  public fieldDefinitions : FieldDefinition[] = [];
  private errors: any;
  private eaSubscription: Subscription;


  private validationSubscription = {
    dispose: () => null
  };

  constructor(private validationController: ValidationController,
    private element: HTMLElement,
    private i18n: I18N,
    private ea: EventAggregator
  ) {
    ea.subscribe('i18n:locale:changed', payload => {
      this.i18n.updateTranslations(this.element);
    });
  }

  @bindable({ defaultBindingMode: bindingMode.fromView })
  public isValid: boolean;

  async validate() {
    await this.validationController.validate();
  }

  bind() {
    let pageDefinition: PageDefinition = {} as PageDefinition;

    if ((this.definition as PageDefinition).fieldDefinitions) {
      pageDefinition = this.definition as PageDefinition;
    }

    const fields = pageDefinition.fieldDefinitions || [this.definition as FieldDefinition];

    this.validationSubscription = this.validationController.subscribe((e) => {
      this.errors = e.errors.map(error => error.message);
      this.isValid = e.errors.length === 0;
    });
  }

  detached() {
    this.eaSubscription.dispose();
    this.validationSubscription.dispose();
  }

  addEmptyItem( array) {
    array.push({});
  }
}
