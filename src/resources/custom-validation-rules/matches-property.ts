import { getDeeplyNestedProperty } from "resources/util/get-deeply-nested-property";

export const matchesProperty = {
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
