

class ShowHide {
  constructor(element) {
    this.element = element;
  }
}


let shElement = document.createElement('div');

let thisShowHider = new ShowHide(shElement);

console.log(thisShowHider.element);
