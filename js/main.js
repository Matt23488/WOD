import Character from "./Character.js";

class Application {
    constructor() {
        this.mode = ko.observable("sheet");
        this.character = Character.newCharacter("Jabe Frost");
    }
}

// const char = Character.newCharacter("Jabe Frost");
// ko.applyBindings(char);
const app = new Application();
ko.applyBindings(app);

window.app = app;