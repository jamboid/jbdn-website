

class ShowHide {
  constructor(element) {
    this.element = element;
  }

  get element() {
    return this.element;
  }
}


const shElement = document.createElement('div');

const thisShowHider = new ShowHide(shElement);

console.log(thisShowHider);
