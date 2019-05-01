import { getBodyContent } from "./util.js";

class Damage {
    constructor (totalHealth) {
        this.bashing = ko.observable(0);
        this.lethal = ko.observable(0);
        this.aggravated = ko.observable(0);
        this.totalHealth = totalHealth;
    }

    addBashing() {
        if (this.anyEmpty()) {
            this.bashing(this.bashing() + 1);
        }
        else if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
            this.lethal(this.lethal() + 1);
        }
        else if (this.lethal() > 0) {
            this.lethal(this.lethal() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else {
            // TODO: Figure out how damage accumulates
            alert ("you ded");
        }
    }

    addLethal() {
        if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
            this.lethal(this.lethal() + 1);
        }
        else {
            if (this.anyEmpty()) {
                this.lethal(this.lethal() + 1);
            }
            else {
                // TODO: Figure out how damage accumulates
                alert("you ded");
            }
        }
    }

    addAggravated() {
        if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else if (this.lethal() > 0) {
            this.lethal(this.lethal() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else {
            if (this.anyEmpty()) {
                this.aggravated(this.aggravated() + 1);
            }
            else {
                // TODO: Figure out how damage accumulates
                alert("you ded");
            }
        }
    }

    anyEmpty() {
        return this.bashing() + this.lethal() + this.aggravated() < this.totalHealth;
    }
}

export default class Character {
    constructor(container, json) {
        this._container = container;

        this.name = ko.observable(json.name);
        this.player = ko.observable(json.player);
        this.age = ko.observable(json.age);
        this.vice = ko.observable(json.vice);
        this.virtue = ko.observable(json.virtue);
        this.origins = ko.observable(json.origins);
        this.gender = ko.observable(json.gender);
        this.concept = ko.observable(json.concept);
        this.chronicle = ko.observable(json.chronicle);

        this.intelligence = ko.observable(json.intelligence);
        this.strength = ko.observable(json.strength);
        this.presence = ko.observable(json.presence);
        this.wits = ko.observable(json.wits);
        this.dexterity = ko.observable(json.dexterity);
        this.manipulation = ko.observable(json.manipulation);
        this.resolve = ko.observable(json.resolve);
        this.stamina = ko.observable(json.stamina);
        this.composure = ko.observable(json.composure);

        this.damage = new Damage(6);
    }

    static newCharacter(name) {
        const json = {
            name: name,
            player: "",
            age: 0,
            vice: "",
            virtue: "",
            origins: "",
            gender: "",
            concept: "",
            chronicle: "",

            intelligence: 1,
            strength: 1,
            presence: 1,
            wits: 1,
            dexterity: 1,
            manipulation: 1,
            resolve: 1,
            stamina: 1,
            composure: 1
        };

        return new Character(createHTML(name), json);
    }

    static fromJson(json) {
        return new Character(createHTML(json.name), json);
    }

    toJson() {
        return {
            name: this.name(),
            player: this.player(),
            age: this.age(),
            vice: this.vice(),
            virtue: this.virtue(),
            origins: this.origins(),
            gender: this.gender(),
            concept: this.concept(),
            chronicle: this.chronicle(),

            intelligence: this.intelligence(),
            wits: this.wits(),
            resolve: this.resolve(),
            strength: this.strength(),
            dexterity: this.dexterity(),
            stamina: this.stamina(),
            presence: this.presence(),
            manipulation: this.manipulation(),
            composure: this.composure()
        };
    }
}

function createHTML(name) {
    const container = document.createElement("div");
    container.id = `ch-${name}`;
    container.classList.add("character");

    let row = newBSRow();
    row.appendChild(createTextSection("name", "Name:", "col-sm-4"));
    row.appendChild(createTextSection("vice", "Vice:", "col-sm-4"));
    row.appendChild(createTextSection("gender", "Gender:", "col-sm-4"));
    container.appendChild(row);

    row = newBSRow();
    row.appendChild(createTextSection("player", "Player:", "col-sm-4"));
    row.appendChild(createTextSection("virtue", "Virtue:", "col-sm-4"));
    row.appendChild(createTextSection("concept", "Concept:", "col-sm-4"));
    container.appendChild(row);

    row = newBSRow();
    row.appendChild(createTextSection("age", "Age:", "col-sm-4", "number"));
    row.appendChild(createTextSection("origins", "Origins:", "col-sm-4"));
    row.appendChild(createTextSection("chronicle", "Chronicle:", "col-sm-4"));
    container.appendChild(row);

    container.appendChild(document.createElement("hr"));

    row = newBSRow();
    row.appendChild(createAttributeSection("intelligence", "Intelligence:", "col-sm-4"));
    row.appendChild(createAttributeSection("strength", "Strength:", "col-sm-4"));
    row.appendChild(createAttributeSection("presence", "Presence:", "col-sm-4"));
    container.appendChild(row);

    row = newBSRow();
    row.appendChild(createAttributeSection("wits", "Wits:", "col-sm-4"));
    row.appendChild(createAttributeSection("dexterity", "Dexterity:", "col-sm-4"));
    row.appendChild(createAttributeSection("manipulation", "Manipulation:", "col-sm-4"));
    container.appendChild(row);

    row = newBSRow();
    row.appendChild(createAttributeSection("resolve", "Resolve:", "col-sm-4"));
    row.appendChild(createAttributeSection("stamina", "Stamina:", "col-sm-4"));
    row.appendChild(createAttributeSection("composure", "Composure:", "col-sm-4"));
    container.appendChild(row);

    container.appendChild(document.createElement("hr"));

    // Damage TEMPORARY
    row = newBSRow();
    row.dataset.bind = "damage: damage";
    container.appendChild(row);
    row = newBSRow();
    row.dataset.bind = "with: damage";
    const addBashingButton = document.createElement("button");
    addBashingButton.innerText = "Add Bashing";
    addBashingButton.dataset.bind = "click: addBashing";
    row.appendChild(addBashingButton);
    const addLethalButton = document.createElement("button");
    addLethalButton.innerText = "Add Lethal";
    addLethalButton.dataset.bind = "click: addLethal";
    row.appendChild(addLethalButton);
    const addAggravatedButton = document.createElement("button");
    addAggravatedButton.innerText = "Add Aggravated";
    addAggravatedButton.dataset.bind = "click: addAggravated";
    row.appendChild(addAggravatedButton);
    container.appendChild(row);

    getBodyContent().appendChild(container);

    return container;
}

function newBSRow() {
    const row = document.createElement("div");
    row.classList.add("row");
    return row;
}

function createAttributeSection(property, label, bsClass) {
    const container = document.createElement("div");
    if (bsClass) container.classList.add(bsClass);

    const label_ = document.createElement("label");
    label_.innerText = label;

    const dotDisplay = document.createElement("div");
    dotDisplay.style.display = "inline";
    dotDisplay.dataset.bind = `attribute: ${property}`;

    container.appendChild(label_);
    container.append(" ");
    container.appendChild(dotDisplay);

    return container;
}

function createTextSection(property, label, bsClass, type = "text") {
    const container = document.createElement("div");
    if (bsClass) container.classList.add(bsClass);

    const label_ = document.createElement("label");
    label_.innerText = label;

    const input = document.createElement("input");
    input.type = type;
    input.dataset.bind = `value: ${property}`;

    container.appendChild(label_);
    container.append(" ");
    container.appendChild(input);

    container.addEventListener("click", () => {
        input.focus();
    });

    input.addEventListener("keypress", e => {
        if (e.keyCode !== 13) return;

        input.blur();
    });

    return container;
}

ko.bindingHandlers.attribute = {
    init: function (element, valueAccessor) {
        const dots = [];
        for (let i = 0; i < 5; i++) {
            const dot = document.createElement("span");
            dot.classList.add("attribute-dot");
            element.appendChild(dot);

            dots.push(dot);
            const captureDots = dots.map(dot => dot);

            dot.addEventListener("pointerenter", () => {
                captureDots.forEach(dot => dot.classList.add("hoverFilled"));
            });
            dot.addEventListener("pointerleave", () => {
                captureDots.forEach(dot => dot.classList.remove("hoverFilled"));
            });
        }
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                const observable = valueAccessor();
                observable(index + 1);
            });
        });
    },
    update: function (element, valueAccessor) {
        const value = valueAccessor()();
        const dots = element.getElementsByTagName("span");
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("filled");
            if (i < value) {
                dots[i].classList.add("filled");
            }
        }
    }
}

ko.bindingHandlers.damage = {
    init: function (element, valueAccessor) {
        const damageObj = valueAccessor();
        for (let i = 0; i < damageObj.totalHealth; i++) {
            const cb = document.createElement("img");
            cb.style.border = "1px solid black";
            cb.style.margin = "0 2px";
            cb.src = "images/none.png";

            element.appendChild(cb);
        }
    },
    update: function (element, valueAccessor) {
        const damageObj = valueAccessor();
        const imgs = element.getElementsByTagName("img");
        for (let i = 0; i < imgs.length; i++) {
            if (i < damageObj.aggravated()) {
                imgs[i].src = "images/aggravated.png";
            }
            else if (i - damageObj.aggravated() < damageObj.lethal()) {
                imgs[i].src = "images/lethal.png";
            }
            else if (i - damageObj.aggravated() - damageObj.lethal() < damageObj.bashing()) {
                imgs[i].src = "images/bashing.png";
            }
            else {
                imgs[i].src = "images/none.png";
            }
        }
    }
};