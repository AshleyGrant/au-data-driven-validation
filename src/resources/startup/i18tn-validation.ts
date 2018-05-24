import { Aurelia } from 'aurelia-framework';
import { ValidationMessageProvider } from "aurelia-validation";
import { I18N } from 'aurelia-i18n';

export function i18tnValidation(aurelia: Aurelia) {
  const originalGetMessage = ValidationMessageProvider.prototype.getMessage;
  const originalGetDisplayName = ValidationMessageProvider.prototype.getDisplayName;
  ValidationMessageProvider.prototype.getMessage = function (key) {
    const i18n = aurelia.container.get(I18N);
    const translation = i18n.tr(`errorMessages.${key}`);
    const message = this.parser.parse(translation);

    if (message.value === translation) {
      return originalGetMessage.call(this, key);
    }
    return message;
  };

  ValidationMessageProvider.prototype.getDisplayName = function (propertyName, displayName) {
    const i18n = aurelia.container.get(I18N);

    if (displayName !== null && displayName !== undefined) {
      const translation = i18n.tr(displayName);

      if( translation === displayName ) {
        return originalGetDisplayName.call(this, propertyName, displayName);
      }

      return translation;
    }
    const translation = i18n.tr(propertyName);


    if( translation === propertyName ) {
      return originalGetDisplayName.call(this, propertyName, displayName);
    }

    return translation;
  };
}
