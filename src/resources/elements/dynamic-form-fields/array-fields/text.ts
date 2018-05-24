export class Text {
  model: any;
  activate(model) {
    this.model = model;

    console.log('this.model', this.model);
  }
}
