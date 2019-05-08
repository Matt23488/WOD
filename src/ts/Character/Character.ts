import Damage from "./Damage";
import Equipment from "./Equipment";
import InventoryItem from "./InventoryItem";
import Merit from "./Merit";
import Note from "./Note";
import { randomInteger } from "../utils";

export default class Character {
    public ghost: boolean = false;

    public name: KnockoutObservable<string>;
    public player: KnockoutObservable<string>;
    public age: KnockoutObservable<number>;
    public vice: KnockoutObservable<string>;
    public virtue: KnockoutObservable<string>;
    public origins: KnockoutObservable<string>;
    public gender: KnockoutObservable<string>;
    public concept: KnockoutObservable<string>;
    public chronicle: KnockoutObservable<string>;

    public intelligence: KnockoutObservable<number>;
    public strength: KnockoutObservable<number>;
    public presence: KnockoutObservable<number>;
    public wits: KnockoutObservable<number>;
    public dexterity: KnockoutObservable<number>;
    public manipulation: KnockoutObservable<number>;
    public resolve: KnockoutObservable<number>;
    public stamina: KnockoutObservable<number>;
    public composure: KnockoutObservable<number>;

    public academics: KnockoutObservable<number>;
    public robotics: KnockoutObservable<number>;
    public crafts: KnockoutObservable<number>;
    public investigation: KnockoutObservable<number>;
    public medicine: KnockoutObservable<number>;
    public occult: KnockoutObservable<number>;
    public politics: KnockoutObservable<number>;
    public science: KnockoutObservable<number>;
    
    public athletics: KnockoutObservable<number>;
    public brawl: KnockoutObservable<number>;
    public drive: KnockoutObservable<number>;
    public ranged: KnockoutObservable<number>;
    public larceny: KnockoutObservable<number>;
    public stealth: KnockoutObservable<number>;
    public survival: KnockoutObservable<number>;
    public weaponry: KnockoutObservable<number>;

    public animalKen: KnockoutObservable<number>;
    public empathy: KnockoutObservable<number>;
    public expression: KnockoutObservable<number>;
    public intimidation: KnockoutObservable<number>;
    public persuasion: KnockoutObservable<number>;
    public socialize: KnockoutObservable<number>;
    public streetwise: KnockoutObservable<number>;
    public subterfuge: KnockoutObservable<number>;

    public merits: KnockoutObservableArray<Merit>;
    public spells: KnockoutObservableArray<Merit>;
    public flaws: KnockoutObservableArray<Merit>;

    public size: KnockoutObservable<number>;
    public speed: KnockoutComputed<number>;
    public defense: KnockoutComputed<number>;
    public armor: KnockoutObservable<number>;
    public initiative: KnockoutComputed<number>;
    public experience: KnockoutObservable<number>;
    public morality: KnockoutObservable<number>;

    public weapons: KnockoutObservableArray<Equipment>;
    public equipment: KnockoutObservableArray<Equipment>;
    public inventory: KnockoutObservableArray<InventoryItem>;

    public notes: KnockoutObservableArray<Note>;

    public health: KnockoutComputed<number>;
    public damage: Damage;

    public magic: KnockoutComputed<number>;
    public usedMagic: KnockoutObservable<number>;

    public willpower: KnockoutComputed<number>;
    public usedWillpower: KnockoutObservable<number>;

    public constructor(json: CharacterJson) {
        this.name = ko.observable(json.name);
        this.player = ko.observable(json.player);
        this.age = ko.observable(json.age).extend({ numeric: { precision: 0 } });
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

        this.size = ko.observable(json.size).extend({ numeric: { precision: 0, min: 1, max: 10 } });
        this.speed = ko.computed(() => this.strength() + this.dexterity() + 5, this);
        this.defense = ko.computed(() => Math.min(this.dexterity(), this.wits()), this);
        this.armor = ko.observable(json.armor).extend({ numeric: { precision: 0 } });
        this.initiative = ko.computed(() => this.dexterity() + this.composure(), this);
        this.experience = ko.observable(json.experience).extend({ numeric: { precision: 0 } });
        this.morality = ko.observable(json.morality).extend({ numeric: { precision: 0, min: 1, max: 10 } });

        this.weapons = ko.observableArray(json.weapons.map(w => new Equipment(w.name, w.description)));
        this.equipment = ko.observableArray(json.equipment.map(e => new Equipment(e.name, e.description)));
        this.inventory = ko.observableArray(json.inventory.map(i => new InventoryItem(i.name, i.description, i.quantity)));

        this.notes = ko.observableArray(json.notes.map(n => new Note(n)));

        this.health = ko.computed(() => this.stamina() + this.size(), this);
        this.damage = new Damage(this.health, json.bashing, json.lethal, json.aggravated);

        this.magic = ko.computed(() => this.resolve() + this.composure(), this);
        this.usedMagic = ko.observable(json.usedMagic || 0);
        this.magic.subscribe(val => {
            if (this.usedMagic() > val) this.usedMagic(val);
        }, this);

        this.willpower = ko.computed(() => this.resolve() + this.composure(), this);
        this.usedWillpower = ko.observable(json.usedWillpower || 0);
        this.willpower.subscribe(val => {
            if (this.usedWillpower() > val) this.usedWillpower(val);
        }, this);
    }

    public static newCharacter(): Character {
        return new Character({
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
        });
    }

    public static fromJson(json: CharacterJson): Character {
        return new Character(json);
    }

    public onComponentClick(_: any, e: Event): void {
        const element = <HTMLElement>e.currentTarget;
        element.getElementsByTagName("input")[0].focus();
    }

    public newItem<T>(observableArray: KnockoutObservableArray<T>, constructor: new () => T): () => void {
        return () => {
            observableArray.push(new constructor());
        };
    }

    public removeItem<T>(observableArray: KnockoutObservableArray<T>): (item: T) => void {
        return (item: T) => {
            observableArray.remove(item);
        };
    }

    public moveItem<T>(observableArray: KnockoutObservableArray<T>, direction: number): (item: T) => void {
        return (item: T) => {
            const index = observableArray.indexOf(item);
            const newIndex = index + direction;

            if (newIndex < 0 || newIndex >= observableArray().length) return;

            observableArray.splice(index, 1);
            observableArray.splice(newIndex, 0, item);
        };
    }

    public clearUsed(usedObservable: KnockoutObservable<number>): () => void {
        return () => {
            usedObservable(0);
        };
    }

    public toJson(): CharacterJson {
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

            bashing: this.damage.bashing(),
            lethal: this.damage.lethal(),
            aggravated: this.damage.aggravated(),
            usedMagic: this.usedMagic(),
            usedWillpower: this.usedWillpower(),

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

ko.bindingHandlers.attribute = {
    init: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, max: number }) => {
        const dots: Array<HTMLSpanElement> = [];
        for (let i = 0; i < valueAccessor().max; i++) {
            const dot = document.createElement("span");
            dot.classList.add("attribute-dot");
            //dot.dataset.index = "" + i;
            dot.dataset.toggle = "tooltip";
            dot.title = "" + (i + 1);
            $(dot).tooltip();

            dots.push(dot);

            dot.addEventListener("pointerenter", () => {
                //const dotIndex = parseInt(spanElement.dataset.index);
                dots.forEach((dot: HTMLSpanElement, index: number) => {
                    if (index <= i) dot.classList.add("hoverFilled");
                });
            });
            dot.addEventListener("pointerleave", () => {
                dots.forEach((dot: HTMLSpanElement) => {
                    dot.classList.remove("hoverFilled");
                });
            });
        }

        const clearDot = document.createElement("div");
        clearDot.classList.add("clear-dot");
        clearDot.innerHTML = "&times;";
        clearDot.dataset.toggle = "tooltip";
        clearDot.title = "Clear";
        clearDot.addEventListener("click", () => {
            valueAccessor().value(0);
        });
        element.appendChild(clearDot);
        $(clearDot).tooltip();

        dots.forEach((dot: HTMLSpanElement, index: number) => {
            element.appendChild(dot);
            dot.addEventListener("click", () => {
                valueAccessor().value(index + 1);
            });
        });
    },
    update: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, max: number }) => {
        const value = valueAccessor().value();
        const dots = element.getElementsByClassName("attribute-dot");
        for (let i = 0; i < dots.length; i++) {
            const dot = <HTMLSpanElement>dots[i];
            dot.style.backgroundColor = null;
            dot.style.borderColor = null;
            if (i < value) {
                dot.style.backgroundColor = "var(--body-color)";
                dot.style.borderColor = "var(--body-color)";
            }
        }
    }
};

ko.bindingHandlers.readOnlyAttribute = {
    init: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, max: number }) => {
        for (let i = 0; i < valueAccessor().max; i++) {
            const dot = document.createElement("span");
            dot.classList.add("attribute-dot");
            element.appendChild(dot);
        }
    },
    update: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, max: number }) => {
        const value = valueAccessor().value();
        const dots = element.getElementsByTagName("span");
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("filled");
            if (i < value) {
                dots[i].classList.add("filled");
            }
        }
    }
};

ko.bindingHandlers.used = {
    init: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, total: KnockoutComputed<number> }) => {
        const dots: Array<HTMLSpanElement> = [];
        for (let i = 0; i < 12; i++) {
            const dot = document.createElement("span");
            dot.classList.add("attribute-dot");
            // dot.dataset.index = "" + i;
            element.appendChild(dot);

            dots.push(dot);

            dot.addEventListener("pointerenter", () => {
                //var dotIndex = parseInt(this.dataset.index);
                dots.forEach((dot: HTMLSpanElement, index: number) => {
                    if (index <= i) dot.classList.add("hoverFilled");
                });
            });
            dot.addEventListener("pointerleave", () => {
                dots.forEach((dot: HTMLSpanElement) => {
                    dot.classList.remove("hoverFilled");
                });
            });
        }
        dots.forEach((dot: HTMLSpanElement, index: number) => {
            dot.addEventListener("click", () => {
                valueAccessor().value(index + 1);
            });
        });
    },
    update: (element: HTMLElement, valueAccessor: () => { value: KnockoutObservable<number>, total: KnockoutComputed<number> }) => {
        const used = valueAccessor().value();
        const total = valueAccessor().total();
        const dots = element.getElementsByTagName("span");
        for (let i = 0; i < dots.length; i++) {
            if (i < used) dots[i].classList.add("filled-red");
            else dots[i].classList.remove("filled-red");

            if (i < total) dots[i].classList.remove("HIDDEN");
            else dots[i].classList.add("HIDDEN");
        }
    }
};

ko.bindingHandlers.focusOnCreation = {
    init: (element: HTMLInputElement | HTMLTextAreaElement) => {
        window.setTimeout(() => {
            if (element.value) return;
            element.focus();
        }, 1);
    }
};

// Hmm, this isn't working
// interface KnockoutExtenders {
//     numeric(target: any, args: any): KnockoutObservable<number>;
// }

// TODO: figure this one out
(<any>ko.extenders).numeric = (target: any, args: { precision?: number, min?: number, max?: number }) => {
    // if (!args.precision) args.precision = 0;
    // if (!args.min) args.min = -Infinity;
    // if (!args.max) args.max = Infinity;
    const precision = args.precision || 0;
    const min = args.min || -Infinity;
    const max = args.max || Infinity;

    // Create a writeable computed observable to intercept writes to our observable
    const result = ko.pureComputed({
        read: target, // Always return the original observable's value
        write: (newValue: any) => {
            const current = target();
            const roundingMultiplier = Math.pow(10, precision);
            const newValueAsNum = isNaN(newValue) ? 0 : +newValue;
            let valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
            if (valueToWrite < min) valueToWrite = min;
            else if (valueToWrite > max) valueToWrite = max;

            // Only write if it changed
            if (valueToWrite !== current) {
                target(valueToWrite);
            }
            else {
                // If the rounded value is the same, but a different value was written,
                // force a notification for the current field
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    }).extend({ notify: "always" });

    // Initialize with current value to make sure it is rounded appropriately
    result(target());

    // Return the new computed observable
    return result;
};

export type CharacterJson = {
    name: string,
    player: string,
    age: number,
    vice: string,
    virtue: string,
    origins: string,
    gender: string,
    concept: string,
    chronicle: string,

    intelligence: number,
    strength: number,
    presence: number,
    wits: number,
    dexterity: number,
    manipulation: number,
    resolve: number,
    stamina: number,
    composure: number,

    academics: number,
    robotics: number,
    crafts: number,
    investigation: number,
    medicine: number,
    occult: number,
    politics: number,
    science: number,

    athletics: number,
    brawl: number,
    drive: number,
    ranged: number,
    larceny: number,
    stealth: number,
    survival: number,
    weaponry: number,

    animalKen: number,
    empathy: number,
    expression: number,
    intimidation: number,
    persuasion: number,
    socialize: number,
    streetwise: number,
    subterfuge: number,

    merits: Array<{ name: string, value: number }>,
    spells: Array<{ name: string, value: number }>,
    flaws: Array<{ name: string, value: number }>,

    size: number,
    armor: number,
    experience: number,
    morality: number,

    weapons: Array<{ name: string, description: string }>,
    equipment: Array<{ name: string, description: string }>,
    inventory: Array<{ name: string, description: string, quantity: number }>,

    notes: Array<string>,

    bashing?: number,
    lethal?: number,
    aggravated?: number,

    usedMagic?: number,
    usedWillpower?: number
};