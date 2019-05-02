import { getBodyContent } from "./util.js";

class Damage {
    constructor (totalHealth) {
        this.bashing = ko.observable(0);
        this.lethal = ko.observable(0);
        this.aggravated = ko.observable(0);
        this.totalHealth = ko.observable(totalHealth);
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
        if (this.lethal() > 0) {
            this.lethal(this.lethal() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
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
        return this.bashing() + this.lethal() + this.aggravated() < this.totalHealth();
    }
}

class Willpower {
    constructor(totalWillpower) {
        this.usedWillpower = ko.observable(0);
        this.totalWillpower = ko.observable(totalWillpower);
    }
}

class Magic {
    constructor(totalMagic) {
        this.usedMagic = ko.observable(0);
        this.totalMagic = ko.observable(totalMagic);
    }
}

export default class Character {
    constructor(json) {
        //this._container = container;

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

        this.damage = new Damage(json.health);
        this.magic = new Magic(json.magic);
        this.willpower = new Willpower(json.willpower);
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
            composure: 1,

            health: 7,
            magic: 5,
            willpower: 5
        };

        return new Character(json);
    }

    static fromJson(json) {
        return new Character(json);
    }

    onComponentClick(char, e) {
        e.currentTarget.getElementsByTagName("input")[0].focus();
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
};

ko.bindingHandlers.capacity = {
    init: function (element, valueAccessor) {
        const dots = [];
        for (let i = 0; i < 12; i++) {
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
};

ko.bindingHandlers.damage = {
    init: function (element, valueAccessor) {
        const damageObj = valueAccessor();
        for (let i = 0; i < damageObj.totalHealth(); i++) {
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

// TODO: figure out how to subscribe to an observable changing
// to re-create the dots in init
ko.bindingHandlers.magic = {
    init: function (element, valueAccessor) {
        const dots = [];
        for (let i = 0; i < valueAccessor().totalMagic(); i++) {
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
                valueAccessor().usedMagic(index + 1);
            });
        });
    },
    update: function (element, valueAccessor) {
        const usedMagic = valueAccessor().usedMagic();
        const totalMagic = valueAccessor().totalMagic();

        const dots = [...element.getElementsByTagName("span")];

        if (dots.length < totalMagic) {
            while (dots.length < totalMagic) {
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
        }
        else if (dots.length > totalMagic) {
            while (dots.length > totalMagic) {
                dots.shift().remove();
            }
        }

        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("filled");
            if (i < usedMagic) {
                dots[i].classList.add("filled");
            }
        }
    }
};

ko.bindingHandlers.willpower = {
    init: function (element, valueAccessor) {
        const dots = [];
        for (let i = 0; i < valueAccessor().totalWillpower(); i++) {
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
                valueAccessor().usedWillpower(index + 1);
            });
        });
    },
    update: function (element, valueAccessor) {
        const usedWillpower = valueAccessor().usedWillpower();
        const totalWillpower = valueAccessor().totalWillpower();

        const dots = [...element.getElementsByTagName("span")];

        if (dots.length < totalWillpower) {
            while (dots.length < totalWillpower) {
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
        }
        else if (dots.length > totalWillpower) {
            while (dots.length > totalWillpower) {
                dots.shift().remove();
            }
        }

        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("filled");
            if (i < usedWillpower) {
                dots[i].classList.add("filled");
            }
        }
    }
};