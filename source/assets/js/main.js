

class ShowHide {
  constructor(element) {
    this.element = element;
  }

  instanceMethod() {
    return "Instance hello";
  }

  static utilMethod () {
    return "Static hello";
  }
}


let shElement = document.createElement('div');

let thisShowHider = new ShowHide(shElement);

console.log(ShowHide.utilMethod());

console.log(thisShowHider.instanceMethod());
