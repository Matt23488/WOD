import Damage from "./Damage";
import Equipment from "./Equipment";
import InventoryItem from "./InventoryItem";
import Merit from "./Merit";
import Note from "./Note";
import { randomInteger } from "../utils";
import CommandStack from "../Command/CommandStack";
import CollectionAddCommand from "../Command/CollectionAddCommand";
import CollectionRemoveCommand from "../Command/CollectionRemoveCommand";
import CollectionMoveCommand from "../Command/CollectionMoveCommand";
import ClearUsedCommand from "../Command/ClearUsedCommand";
import AttributeCommand from "../Command/AttributeCommand";

export default class Character {
    public ghost: boolean = false;
    public locked: KnockoutObservable<boolean> = ko.observable(true);

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
        this.name = ko.observable(json.name).extend({ lockable: this.locked, undoable: { batchConsecutiveWrites: true } });
        this.player = ko.observable(json.player).extend({ lockable: this.locked, undoable: { batchConsecutiveWrites: true } });
        this.age = ko.observable(json.age).extend({ numeric: { precision: 0 }, lockable: this.locked, undoable: { batchConsecutiveWrites: true } });
        this.vice = ko.observable(json.vice).extend({ lockable: this.locked, undoable: { batchConsecutiveWrites: true } });
        this.virtue = ko.observable(json.virtue).extend({ lockable: this.locked, undoable: { batchConsecutiveWrites: true } });
        this.origins = ko.observable(json.origins).extend({ lockable: this.locked, undoable: { batchConsecutiveWrites: true } });
        this.gender = ko.observable(json.gender).extend({ lockable: this.locked, undoable: { batchConsecutiveWrites: true } });
        this.concept = ko.observable(json.concept).extend({ lockable: this.locked, undoable: { batchConsecutiveWrites: true } });
        this.chronicle = ko.observable(json.chronicle).extend({ lockable: this.locked, undoable: { batchConsecutiveWrites: true } });

        this.intelligence = ko.observable(json.intelligence).extend({ lockable: this.locked });
        this.strength = ko.observable(json.strength).extend({ lockable: this.locked });
        this.presence = ko.observable(json.presence).extend({ lockable: this.locked });
        this.wits = ko.observable(json.wits).extend({ lockable: this.locked });
        this.dexterity = ko.observable(json.dexterity).extend({ lockable: this.locked });
        this.manipulation = ko.observable(json.manipulation).extend({ lockable: this.locked });
        this.resolve = ko.observable(json.resolve).extend({ lockable: this.locked });
        this.stamina = ko.observable(json.stamina).extend({ lockable: this.locked });
        this.composure = ko.observable(json.composure).extend({ lockable: this.locked });

        this.academics = ko.observable(json.academics).extend({ lockable: this.locked });
        this.robotics = ko.observable(json.robotics).extend({ lockable: this.locked });
        this.crafts = ko.observable(json.crafts).extend({ lockable: this.locked });
        this.investigation = ko.observable(json.investigation).extend({ lockable: this.locked });
        this.medicine = ko.observable(json.medicine).extend({ lockable: this.locked });
        this.occult = ko.observable(json.occult).extend({ lockable: this.locked });
        this.politics = ko.observable(json.politics).extend({ lockable: this.locked });
        this.science = ko.observable(json.science).extend({ lockable: this.locked });

        this.athletics = ko.observable(json.athletics).extend({ lockable: this.locked });
        this.brawl = ko.observable(json.brawl).extend({ lockable: this.locked });
        this.drive = ko.observable(json.drive).extend({ lockable: this.locked });
        this.ranged = ko.observable(json.ranged).extend({ lockable: this.locked });
        this.larceny = ko.observable(json.larceny).extend({ lockable: this.locked });
        this.stealth = ko.observable(json.stealth).extend({ lockable: this.locked });
        this.survival = ko.observable(json.survival).extend({ lockable: this.locked });
        this.weaponry = ko.observable(json.weaponry).extend({ lockable: this.locked });

        this.animalKen = ko.observable(json.animalKen).extend({ lockable: this.locked });
        this.empathy = ko.observable(json.empathy).extend({ lockable: this.locked });
        this.expression = ko.observable(json.expression).extend({ lockable: this.locked });
        this.intimidation = ko.observable(json.intimidation).extend({ lockable: this.locked });
        this.persuasion = ko.observable(json.persuasion).extend({ lockable: this.locked });
        this.socialize = ko.observable(json.socialize).extend({ lockable: this.locked });
        this.streetwise = ko.observable(json.streetwise).extend({ lockable: this.locked });
        this.subterfuge = ko.observable(json.subterfuge).extend({ lockable: this.locked });

        this.merits = ko.observableArray(json.merits.map(m => new Merit(m.name, m.value, this.locked)));
        this.spells = ko.observableArray(json.spells.map(s => new Merit(s.name, s.value, this.locked)));
        this.flaws = ko.observableArray(json.flaws.map(f => new Merit(f.name, f.value, this.locked)));

        this.size = ko.observable(json.size).extend({ numeric: { precision: 0, min: 1, max: 10 }, lockable: this.locked });
        this.speed = ko.computed(() => this.strength() + this.dexterity() + 5, this);
        this.defense = ko.computed(() => Math.min(this.dexterity(), this.wits()), this);
        this.armor = ko.observable(json.armor).extend({ numeric: { precision: 0 } }).extend({ lockable: this.locked });
        this.initiative = ko.computed(() => this.dexterity() + this.composure(), this);
        this.experience = ko.observable(json.experience).extend({ numeric: { precision: 0 }, lockable: this.locked });
        this.morality = ko.observable(json.morality).extend({ numeric: { precision: 0, min: 1, max: 10 }, lockable: this.locked });

        this.weapons = ko.observableArray(json.weapons.map(w => new Equipment(w.name, w.description, this.locked)));
        this.equipment = ko.observableArray(json.equipment.map(e => new Equipment(e.name, e.description, this.locked)));
        this.inventory = ko.observableArray(json.inventory.map(i => new InventoryItem(i.name, i.description, i.quantity, this.locked)));

        this.notes = ko.observableArray(json.notes.map(n => new Note(n, this.locked)));

        this.health = ko.computed(() => this.stamina() + this.size(), this);
        this.damage = new Damage(this.health, json.bashing, json.lethal, json.aggravated, this.locked);

        this.magic = ko.computed(() => this.resolve() + this.composure(), this);
        this.usedMagic = ko.observable(json.usedMagic || 0).extend({ lockable: this.locked });
        this.magic.subscribe(val => {
            if (this.usedMagic() > val) CommandStack.instance.executeWithPrevious(new AttributeCommand(this.usedMagic, val, this.usedMagic()));
        }, this);

        this.willpower = ko.computed(() => this.resolve() + this.composure(), this);
        this.usedWillpower = ko.observable(json.usedWillpower || 0).extend({ lockable: this.locked });
        this.willpower.subscribe(val => {
            if (this.usedWillpower() > val) CommandStack.instance.executeWithPrevious(new AttributeCommand(this.usedWillpower, val, this.usedWillpower()));
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

    public newItem<T>(observableArray: KnockoutObservableArray<T>, constructor: { createLockable(locked: KnockoutObservable<boolean>): T}): () => void {
        return () => {
            if (this.locked()) return;
            CommandStack.instance.execute(new CollectionAddCommand(observableArray, constructor.createLockable(this.locked)));
        };
    }

    public removeItem<T>(observableArray: KnockoutObservableArray<T>): (item: T) => void {
        return (item: T) => {
            if (this.locked()) return;
            CommandStack.instance.execute(new CollectionRemoveCommand(observableArray, item));
        };
    }

    public moveItem<T>(observableArray: KnockoutObservableArray<T>, direction: number): (item: T) => void {
        return (item: T) => {
            if (this.locked()) return;
            const index = observableArray.indexOf(item);
            const newIndex = index + direction;

            if (newIndex < 0 || newIndex >= observableArray().length) return;

            CommandStack.instance.execute(new CollectionMoveCommand(observableArray, item, newIndex, index));
        };
    }

    public clearUsed(usedObservable: KnockoutObservable<number>): () => void {
        return () => {
            CommandStack.instance.execute(new ClearUsedCommand(usedObservable));
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

type CharacterJson = {
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