$(function () {
    function Character(json) {
        var self = this;
        self.name = ko.observable(json.name);
        self.player = ko.observable(json.player);
        self.age = ko.observable(json.age);
        self.vice = ko.observable(json.vice);
        self.virtue = ko.observable(json.virtue);
        self.origins = ko.observable(json.origins);
        self.gender = ko.observable(json.gender);
        self.concept = ko.observable(json.concept);
        self.chronicle = ko.observable(json.chronicle);

        self.intelligence = ko.observable(json.intelligence);
        self.strength = ko.observable(json.strength);
        self.presence = ko.observable(json.presence);
        self.wits = ko.observable(json.wits);
        self.dexterity = ko.observable(json.dexterity);
        self.manipulation = ko.observable(json.manipulation);
        self.resolve = ko.observable(json.resolve);
        self.stamina = ko.observable(json.stamina);
        self.composure = ko.observable(json.composure);

        self.damage = new Damage(json.health, json.bashing, json.lethal, json.aggravated);
        self.magic = new Willpower(json.magic, json.usedMagic);
        self.willpower = new Willpower(json.willpower, json.usedWillpower);

        self.academics = ko.observable(json.academics);
        self.robotics = ko.observable(json.robotics);
        self.crafts = ko.observable(json.crafts);
        self.investigation = ko.observable(json.investigation);
        self.medicine = ko.observable(json.medicine);
        self.occult = ko.observable(json.occult);
        self.politics = ko.observable(json.politics);
        self.science = ko.observable(json.science);

        self.athletics = ko.observable(json.athletics);
        self.brawl = ko.observable(json.brawl);
        self.drive = ko.observable(json.drive);
        self.ranged = ko.observable(json.ranged);
        self.larceny = ko.observable(json.larceny);
        self.stealth = ko.observable(json.stealth);
        self.survival = ko.observable(json.survival);
        self.weaponry = ko.observable(json.weaponry);

        self.animalKen = ko.observable(json.animalKen);
        self.empathy = ko.observable(json.empathy);
        self.expression = ko.observable(json.expression);
        self.intimidation = ko.observable(json.intimidation);
        self.persuasion = ko.observable(json.persuasion);
        self.socialize = ko.observable(json.socialize);
        self.streetwise = ko.observable(json.streetwise);
        self.subterfuge = ko.observable(json.subterfuge);

        self.merits = ko.observableArray(json.merits.map(function (m) { return new Merit(m.name, m.value); }));
        self.spells = ko.observableArray(json.spells.map(function (s) { return new Merit(s.name, s.value); }));
        self.flaws = ko.observableArray(json.flaws.map(function (f) { return new Merit(f.name, f.value); }));

        self.size = ko.observable(json.size);
        self.speed = ko.computed(function () { return self.strength() + self.dexterity() + 5; });
        self.defense = ko.computed(function () { return Math.min(self.dexterity(), self.wits()); });
        self.armor = ko.observable(json.armor);
        self.initiative = ko.computed(function () { return self.dexterity() + self.composure(); });
        self.experience = ko.observable(json.experience);
        self.morality = ko.observable(json.morality);

        self.weapons = ko.observableArray(json.weapons.map(function (w) { return new Equipment(w.name, w.description); }));
        self.equipment = ko.observableArray(json.equipment.map(function (e) { return new Equipment(e.name, e.description); }));
        self.inventory = ko.observableArray(json.inventory.map(function(i) { return new InventoryItem(i.name, i.description, i.quantity); }));

        self.notes = ko.observableArray(json.notes.map(function (n) { return new Note(n); }));
    }

    Character.newCharacter = function () {
        var json = {
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
    };

    Character.fromJson = function (json) {
        return new Character(json);
    };

    Character.prototype.onComponentClick = function(_, e) {
        e.currentTarget.getElementsByTagName("input")[0].focus();
    };

    Character.prototype.newItem = function (observableArray, constructor) {
        return function () {
            observableArray.push(new constructor());
        }
    };

    Character.prototype.removeItem = function (observableArray) {
        return function (item) {
            observableArray.remove(item);
        };
    }

    Character.prototype.moveItem = function (observableArray, direction) {
        return function (item) {
            var index = observableArray.indexOf(item);
            var newIndex = index + direction;

            if (newIndex < 0 || newIndex >= observableArray().length) return;

            observableArray.splice(index, 1);
            observableArray.splice(newIndex, 0, item);
        };
    };

    Character.prototype.toJson = function () {
        var self = this;
        return {
            name: self.name(),
            player: self.player(),
            age: self.age(),
            vice: self.vice(),
            virtue: self.virtue(),
            origins: self.origins(),
            gender: self.gender(),
            concept: self.concept(),
            chronicle: self.chronicle(),

            intelligence: self.intelligence(),
            wits: self.wits(),
            resolve: self.resolve(),
            strength: self.strength(),
            dexterity: self.dexterity(),
            stamina: self.stamina(),
            presence: self.presence(),
            manipulation: self.manipulation(),
            composure: self.composure(),

            health: self.damage.totalHealth(),
            bashing: self.damage.bashing(),
            lethal: self.damage.lethal(),
            aggravated: self.damage.aggravated(),
            magic: self.magic.total(),
            usedMagic: self.magic.used(),
            willpower: self.willpower.total(),
            usedWillpower: self.willpower.used(),

            academics: self.academics(),
            robotics: self.robotics(),
            crafts: self.crafts(),
            investigation: self.investigation(),
            medicine: self.medicine(),
            occult: self.occult(),
            politics: self.politics(),
            science: self.science(),

            athletics: self.athletics(),
            brawl: self.brawl(),
            drive: self.drive(),
            ranged: self.ranged(),
            larceny: self.larceny(),
            stealth: self.stealth(),
            survival: self.survival(),
            weaponry: self.weaponry(),

            animalKen: self.animalKen(),
            empathy: self.empathy(),
            expression: self.expression(),
            intimidation: self.intimidation(),
            persuasion: self.persuasion(),
            socialize: self.socialize(),
            streetwise: self.streetwise(),
            subterfuge: self.subterfuge(),

            merits: self.merits().map(function (m) { return { name: m.name(), value: m.value() }; }),
            spells: self.spells().map(function (s) { return { name: s.name(), value: s.value() }; }),
            flaws: self.flaws().map(function (f) { return { name: f.name(), value: f.value() }; }),

            size: self.size(),
            armor: self.armor(),
            experience: self.experience(),
            morality: self.morality(),

            weapons: self.weapons().map(function (w) { return { name: w.name(), description: w.description() }; }),
            equipment: self.equipment().map(function (e) { return { name: e.name(), description: e.description() }; }),
            inventory: self.inventory().map(function (i) { return { name: i.name(), description: i.description(), quantity: i.quantity() }; }),

            notes: self.notes().map(n => n.value())
        };
    };

    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    function randomName() {
        var firstNameLength = randomInteger(5, 12);
        var lastNameLength = randomInteger(5, 12);
        var firstName = "";
        var lastName = "";

        for (var i = 0; i < firstNameLength; i++) {
            var newLetter = alphabet.charAt(randomInteger(0, alphabet.length));
            if (i === 0) newLetter = newLetter.toUpperCase();

            firstName += newLetter;
        }

        for (var i = 0; i < lastNameLength; i++) {
            var newLetter = alphabet.charAt(randomInteger(0, alphabet.length));
            if (i === 0) newLetter = newLetter.toUpperCase();

            lastName += newLetter;
        }

        return firstName + " " + lastName;
    }

    ko.bindingHandlers.attribute = {
        init: function (element, valueAccessor) {
            var dots = [];
            for (var i = 0; i < 5; i++) {
                var dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                dot.dataset.index = i;
                element.appendChild(dot);
    
                dots.push(dot);
    
                dot.addEventListener("pointerenter", function () {
                    var dotIndex = parseInt(this.dataset.index);
                    dots.forEach(function (dot, index) {
                        if (index <= dotIndex) dot.classList.add("hoverFilled");
                    });
                });
                dot.addEventListener("pointerleave", function () {
                    dots.forEach(function (dot) {
                        dot.classList.remove("hoverFilled");
                    });
                });
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    var params = valueAccessor();
                    var observable = params.value;
                    observable(index + 1);
                });
            });
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor().value();
            var color = valueAccessor().color;
            var dots = element.getElementsByTagName("span");
            for (var i = 0; i < dots.length; i++) {
                dots[i].style.backgroundColor = null;
                dots[i].style.borderColor = null;
                if (i < value) {
                    dots[i].style.backgroundColor = color;
                    dots[i].style.borderColor = color;
                }
            }
        }
    };
    
    ko.bindingHandlers.readOnlyAttribute = {
        init: function (element) {
            for (var i = 0; i < 5; i++) {
                var dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                element.appendChild(dot);
            }
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor()();
            var dots = element.getElementsByTagName("span");
            for (var i = 0; i < dots.length; i++) {
                dots[i].classList.remove("filled");
                if (i < value) {
                    dots[i].classList.add("filled");
                }
            }
        }
    };
    
    ko.bindingHandlers.capacity = {
        init: function (element, valueAccessor) {
            var dots = [];
            for (let i = 0; i < 12; i++) {
                var dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                dot.dataset.index = i;
                element.appendChild(dot);
    
                dots.push(dot);
    
                dot.addEventListener("pointerenter", function () {
                    var dotIndex = parseInt(this.dataset.index);
                    dots.forEach(function (dot, index) {
                        if (index <= dotIndex) dot.classList.add("hoverFilled");
                    });
                });
                dot.addEventListener("pointerleave", function () {
                    dots.forEach(function (dot) {
                        dot.classList.remove("hoverFilled");
                    });
                });
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    var observable = valueAccessor();
                    observable(index + 1);
                });
            });
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor()();
            var dots = element.getElementsByTagName("span");
            for (var i = 0; i < dots.length; i++) {
                dots[i].classList.remove("filled");
                if (i < value) {
                    dots[i].classList.add("filled");
                }
            }
        }
    };

    ko.bindingHandlers.focusOnCreation = {
        init: function (element) {
            window.setTimeout(function () {
                element.focus();
            }, 1);
        }
    };

    window.Character = Character;
});