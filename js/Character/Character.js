import Damage from "./Damage.js";
import Magic from "./Magic.js";
import Willpower from "./Willpower.js";
import Merit from "./Merit.js";
import Equipment from "./Equipment.js";
import InventoryItem from "./InventoryItem.js";
import Note from "./Note.js";

export default class Character {
    constructor(json) {
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

        this.damage = new Damage(json.health, json.bashing, json.lethal, json.aggravated);
        this.magic = new Magic(json.magic, json.usedMagic);
        this.willpower = new Willpower(json.willpower, json.usedWillpower);

        this.academics = ko.observable(json.academics);
        this.robotics = ko.observable(json.robotics);
        this.crafts = ko.observable(json.crafts);
        this.investigation = ko.observable(json.investigation);
        this.medicine = ko.observable(json.medicine);
        this.occult = ko.observable(json.occult);
        this.politics = ko.observable(json.politics);
        this.science = ko.observable(json.science);

        this.athletics = ko.observable(json.athletics);
        this.brawl = ko.observable(json.brawl);
        this.drive = ko.observable(json.drive);
        this.ranged = ko.observable(json.ranged);
        this.larceny = ko.observable(json.larceny);
        this.stealth = ko.observable(json.stealth);
        this.survival = ko.observable(json.survival);
        this.weaponry = ko.observable(json.weaponry);

        this.animalKen = ko.observable(json.animalKen);
        this.empathy = ko.observable(json.empathy);
        this.expression = ko.observable(json.expression);
        this.intimidation = ko.observable(json.intimidation);
        this.persuasion = ko.observable(json.persuasion);
        this.socialize = ko.observable(json.socialize);
        this.streetwise = ko.observable(json.streetwise);
        this.subterfuge = ko.observable(json.subterfuge);

        this.merits = ko.observableArray(json.merits.map(m => new Merit(m.name, m.value)));
        this.spells = ko.observableArray(json.spells.map(s => new Merit(s.name, s.value)));
        this.flaws = ko.observableArray(json.flaws.map(f => new Merit(f.name, f.value)));

        this.size = ko.observable(json.size);
        this.speed = ko.computed(() => this.strength() + this.dexterity() + 5, this);
        this.defense = ko.computed(() => Math.min(this.dexterity(), this.wits()), this);
        this.armor = ko.observable(json.armor);
        this.initiative = ko.computed(() => this.dexterity() + this.composure(), this);
        this.experience = ko.observable(json.experience);
        this.morality = ko.observable(json.morality);

        this.weapons = ko.observableArray(json.weapons.map(w => new Equipment(w.name, w.description)));
        this.equipment = ko.observableArray(json.equipment.map(e => new Equipment(e.name, e.description)));
        this.inventory = ko.observableArray(json.inventory.map(i => new InventoryItem(i.name, i.description, i.quantity)));

        this.notes = ko.observableArray(json.notes.map(n => new Note(n)));
    }

    static newCharacter() {
        const json = {
            name: randomName(),
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

            health: 0,
            magic: 0,
            willpower: 0,

            academics: 0,
            robotics: 0,
            crafts: 0,
            investigation: 0,
            medicine: 0,
            occult: 0,
            politics: 0,
            science: 0,

            athletics: 0,
            brawl: 0,
            drive: 0,
            ranged: 0,
            larceny: 0,
            stealth: 0,
            survival: 0,
            weaponry: 0,

            animalKen: 0,
            empathy: 0,
            expression: 0,
            intimidation: 0,
            persuasion: 0,
            socialize: 0,
            streetwise: 0,
            subterfuge: 0,

            merits: [],
            spells: [],
            flaws: [],

            size: 5,
            armor: 0,
            experience: 0,
            morality: 7,

            weapons: [],
            equipment: [],
            inventory: [],

            notes: []
        };

        return new Character(json);
    }

    static fromJson(json) {
        return new Character(json);
    }

    onComponentClick(char, e) {
        e.currentTarget.getElementsByTagName("input")[0].focus();
    }

    newMerit() {
        this.merits.push(new Merit("", 0));
    }

    removeMerit(merit) {
        this.merits.remove(merit);
    }

    newSpell() {
        this.spells.push(new Merit("", 0));
    }

    removeSpell(spell) {
        this.spells.remove(spell);
    }

    newFlaw() {
        this.flaws.push(new Merit("", 0));
    }

    removeFlaw(flaw) {
        this.flaws.remove(flaw);
    }

    newWeapon() {
        this.weapons.push(new Equipment("", ""));
    }

    removeWeapon(weapon) {
        this.weapons.remove(weapon);
    }

    newEquipment() {
        this.equipment.push(new Equipment("", ""));
    }

    removeEquipment(equipment) {
        this.equipment.remove(equipment);
    }

    newInventoryItem() {
        this.inventory.push(new InventoryItem("", "", 1));
    }

    removeInventoryItem(item) {
        this.inventory.remove(item);
    }

    newNote() {
        this.notes.push(new Note(""));
    }

    removeNote(note) {
        this.notes.remove(note);
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
            composure: this.composure(),

            health: this.damage.totalHealth(),
            bashing: this.damage.bashing(),
            lethal: this.damage.lethal(),
            aggravated: this.damage.aggravated(),
            magic: this.magic.totalMagic(),
            usedMagic: this.magic.usedMagic(),
            willpower: this.willpower.totalWillpower(),
            usedWillpower: this.willpower.usedWillpower(),

            academics: this.academics(),
            robotics: this.robotics(),
            crafts: this.crafts(),
            investigation: this.investigation(),
            medicine: this.medicine(),
            occult: this.occult(),
            politics: this.politics(),
            science: this.science(),

            athletics: this.athletics(),
            brawl: this.brawl(),
            drive: this.drive(),
            ranged: this.ranged(),
            larceny: this.larceny(),
            stealth: this.stealth(),
            survival: this.survival(),
            weaponry: this.weaponry(),

            animalKen: this.animalKen(),
            empathy: this.empathy(),
            expression: this.expression(),
            intimidation: this.intimidation(),
            persuasion: this.persuasion(),
            socialize: this.socialize(),
            streetwise: this.streetwise(),
            subterfuge: this.subterfuge(),

            merits: this.merits().map(m => { return { name: m.name(), value: m.value() }; }),
            spells: this.spells().map(s => { return { name: s.name(), value: s.value() }; }),
            flaws: this.flaws().map(f => { return { name: f.name(), value: f.value() }; }),

            size: this.size(),
            armor: this.armor(),
            experience: this.experience(),
            morality: this.morality(),

            weapons: this.weapons().map(w => { return { name: w.name(), description: w.description() }; }),
            equipment: this.equipment().map(e => { return { name: e.name(), description: e.description() }; }),
            inventory: this.inventory().map(i => { return { name: i.name(), description: i.description(), quantity: i.quantity() }; }),

            notes: this.notes().map(n => n.value())
        };
    }
}

const alphabet = "abcdefghijklmnopqrstuvwxyz";
function randomName() {
    const firstNameLength = randomInteger(5, 12);
    const lastNameLength = randomInteger(5, 12);
    let firstName = "";
    let lastName = "";

    for (let i = 0; i < firstNameLength; i++) {
        let newLetter = alphabet.charAt(randomInteger(0, alphabet.length));
        if (i === 0) newLetter = newLetter.toUpperCase();

        firstName += newLetter;
    }

    for (let i = 0; i < lastNameLength; i++) {
        let newLetter = alphabet.charAt(randomInteger(0, alphabet.length));
        if (i === 0) newLetter = newLetter.toUpperCase();

        lastName += newLetter;
    }

    return `${firstName} ${lastName}`;
}

function randomInteger(minInclusive = 0, maxExclusive = 10) {
    if (maxExclusive < minInclusive) {
        // const temp = minInclusive;
        // minInclusive = maxExclusive;
        // maxExclusive = temp;
        [minInclusive, maxExclusive] = [maxExclusive, minInclusive];
    }

    return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
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

ko.bindingHandlers.readOnlyAttribute = {
    init: function (element, valueAccessor) {
        for (let i = 0; i < 5; i++) {
            const dot = document.createElement("span");
            dot.classList.add("attribute-dot");
            element.appendChild(dot);
        }
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

ko.bindingHandlers.tooltip = {
    update: function (element, valueAccessor) {
        $(element).tooltip("dispose");
        $(element).tooltip({ title: valueAccessor()() });
    }
};