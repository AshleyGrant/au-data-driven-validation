import { valueConverter } from "aurelia-binding";

@valueConverter('number')
export class NumberValueConverter {
  fromView(value) {
    try {
      return parseInt(value);
    } catch {
      return 0;
    }
  }
}
