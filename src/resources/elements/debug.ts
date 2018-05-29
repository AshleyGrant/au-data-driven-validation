import { bindable } from "aurelia-framework";

export class Debug {
  @bindable properties: string[] = [];
  json: string;
  interval: any;
  bindingContext = null;

  updateJson() {
    if (this.bindingContext === null) {
      this.json = 'null';
    } else if (this.bindingContext === undefined) {
      this.json = 'undefined'
    } else {
      const cache = [];

      let objectoToStringify = {};

      if (this.properties && this.properties.length > 0) {
        for (const prop of this.properties) {
          objectoToStringify[prop] = this.bindingContext[prop];
        }
      } else {
        objectoToStringify = this.bindingContext;
      }

      this.json = JSON.stringify(objectoToStringify, function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      }, 2);
    }
  }

  bind(bindingContext) {
    this.bindingContext = bindingContext;
    this.updateJson();
    this.interval = setInterval(() => this.updateJson(), 150);
  }

  unbind() {
    this.bindingContext = null;
    clearInterval(this.interval);
  }
}
