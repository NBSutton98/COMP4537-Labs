import { messages } from "../lang/messages/en/user.js";

class GameButton {
  constructor(colour, order, clickHandler) {
    this.colour = colour;
    this.order = order;
    this.clickHandler = clickHandler;

    this.element = document.createElement("button");
    this.element.style.background = colour;
    this.element.style.width = "10em";
    this.element.style.height = "5em";
    this.element.style.position = "absolute";
    this.element.textContent = this.order + 1;
    this.element.style.top = "15em";
    this.element.style.left = order * 10 + "em"; //utilized gemini to understand effcient box organization by using the order number to mutiply the relitive size 

    this.element.onclick = () => this.handleClick(); //utilized arrow notation becuase the 'element' html tag does note need to use the handleClick method 
    document.body.appendChild(this.element);
  }

  setLocation(left, top) {
    // CSS uses 'left' and 'top', not x and y
    this.element.style.left = left;
    this.element.style.top = top;
  }

  handleClick() {
    this.clickHandler(this.order, this.element);
    //order is responsible for telling the game manager what button it is
    //element edits the button once clicked (in this case reveiling the order#)
  }
}
 

class GameEngine {
  constructor() {
    this.buttons = []; //list of all buttons in this round
    this.clickCount = 0;
  }

  initButtons(count) {
    if (this.buttons.length > 0) {
      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].element.remove();
      }
      this.buttons = [];
    }
    {
      for (let i = 0; i < count; i++) {
        let button = new GameButton(    
          this.getRandomColor(),
          i,
          this.buttonClickCheck.bind(this)
        );
        this.buttons.push(button);
      }
    }
  }
  runGame(count) {
    this.clickCount = 0;


    this.initButtons(count);

    // PAUSE LOGIC:
    // We multiply 'count' by 1000 to turn seconds into milliseconds.
    //if count is 3, we wait 3000ms (3 seconds).
    setTimeout(() => {
      this.scrambleButtons(count);
    }, count * 1000);
  }

  getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  randomizeLocation(button) {
    let browserWidth = window.innerWidth;
    let browserHeight = window.innerHeight;
    //dynamic size based on screen res

    let maxLeft = browserWidth - 200;
    let maxTop = browserHeight - 200;

    let randomLeft = Math.floor(Math.random() * maxLeft);
    let randomTop = Math.floor(Math.random() * maxTop);

    button.setLocation(randomLeft + "px", randomTop + "px");
  }

  scrambleButtons(count) {
    this.counter = 0;
    let timer = setInterval(() => { //utilized gemini to learn about setInterval and clearInterval
      //utilized gemini to use arrow notation to keep it to its outer scope of a GameEngine object

      for (let i = 0; i < this.buttons.length; i++) {
        this.randomizeLocation(this.buttons[i]);
      }

      this.counter = this.counter + 1;

      if (this.counter >= count) {
        clearInterval(timer);
        this.clearButtons();
      }
    }, 2000);
  }

  clearButtons() {
    for (let i = 0; i < this.buttons.length; i++) {
      // Set the text to an empty string to hide the number
      this.buttons[i].element.textContent = "";
    }
  }

  buttonClickCheck(clickedOrder, clickedElement) {
    if (clickedOrder == this.clickCount) {
      clickedElement.textContent = clickedOrder + 1;

      this.clickCount = this.clickCount + 1;

      if (this.clickCount == this.buttons.length) {
        alert(messages.CORRECT);
      }
    } else {
      alert(messages.INCORRECT);

      for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].element.textContent = this.buttons[i].order + 1;
      }
    }
  }
}




class UserInterface {
  constructor() {
    this.engine = new GameEngine();
  }

  draw() {
    let label = document.createElement("label");
    label.textContent = messages.BUTTON_AMOUNT;
    document.body.appendChild(label);

    let input = document.createElement("input");
    input.type = "number"; 
    document.body.appendChild(input);


    let goBtn = document.createElement("button");
    goBtn.textContent = messages.GO;
    document.body.appendChild(goBtn);

    goBtn.onclick = () => {
      let count = parseInt(input.value);
      if (count >= 3 && count <= 7) {
        this.engine.runGame(count);
        this.engine.initButtons(count);
        this.engine.scrambleButtons(count);
      } else {
        alert(messages.RANGE);
      }
    };
  }
}
let ui = new UserInterface();
ui.draw();