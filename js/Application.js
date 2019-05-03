import Character from "./Character/Character.js";

export default class Application {
    constructor() {
        let savedCharacters = (JSON.parse(window.localStorage.getItem("characters")) || []).map(c => Character.fromJson(c));
        if (!savedCharacters) savedCharacters = [];

        this.mode = ko.observable(savedCharacters.length > 0 ? "list" : "sheet");

        if (savedCharacters.length === 0) {
            savedCharacters.push(Character.newCharacter());
        }

        this.characterId = ko.observable(0);
        this.characters = ko.observableArray(savedCharacters);
        this.character = ko.computed(() => this.characters()[this.characterId()], this);

        this.dicePool = ko.observable(1);
        this.rollRounds = ko.observableArray([]);
        this.totalDiceSuccesses = ko.computed(() => this.rollRounds().reduce((total, r) => total + r.reduce((total, d) => total + (d > 7 ? 1 : 0), 0), 0));
    }

    goBack() {
        if (this.mode() === "sheet") this.mode("list");
        else this.mode("sheet");
    }

    newCharacter() {
        this.characters.push(Character.newCharacter());
        this.characterId(this.characters().length - 1);
        this.mode("sheet");
    }

    selectCharacter(character) {
        this.characterId(this.characters.indexOf(character));
        this.mode("sheet");
    }

    deleteCharacter() {
        const id = this.characterId();

        if (this.characters().length === 1) {
            this.characters.push(Character.newCharacter(""));
            this.characterId(0);
        }
        else {
            if (id > 0) {
                this.characterId(id - 1);
            }
            this.mode("list");
        }

        this.characters.remove(this.characters()[id]);
    }

    saveCharacters() {
        window.localStorage.setItem("characters", JSON.stringify(this.characters().map(c => c.toJson())));
        swal("Characters saved successfully!", {
            buttons: false,
            timer: 1000,
            icon: "success"
        });
    }

    downloadCharacter() {
        const json = JSON.stringify(this.character().toJson());

        const dl = document.createElement("a");
        dl.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(json)}`);
        dl.setAttribute("download", `${this.character().name()}.json`);

        dl.style.display = "none";
        document.body.appendChild(dl);

        dl.click();

        document.body.removeChild(dl);
    }

    uploadCharacter() {
        const ul = document.createElement("input");
        ul.type = "file";
        ul.accept = ".json";
        ul.style.display = "none";

        ul.addEventListener("change", e => {
            const file = ul.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = e => {
                const json = e.target.result;
                this.characters.push(Character.fromJson(JSON.parse(json)));
                this.characterId(this.characters().length - 1);
                this.mode("sheet");
            };
            reader.readAsText(file);
        });

        document.body.appendChild(ul);

        ul.click();

        document.body.removeChild(ul);
    }

    rollDice() {
        this.rollRounds.removeAll();
        let numRolls = this.dicePool();
        while (numRolls > 0) {
            let nextRoundRolls = 0;
            const currentRound = [];
            for (let i = 0; i < numRolls; i++) {
                const roll = Math.floor(Math.random() * 10) + 1;
                if (roll === 10) nextRoundRolls++;
                currentRound.push(roll)
            }
            this.rollRounds.push(currentRound);
            numRolls = nextRoundRolls;
        }
    }

    switchMode(mode) {
        return () => this.mode(mode);
    }
}

ko.bindingHandlers.dice = {
    update: function (element, valueAccessor) {
        element.innerHTML = "";
        const rollRounds = valueAccessor()();
        for (let rolls of rollRounds) {
            const div = document.createElement("div");
            div.style.marginBottom = "25px";
            for (let roll of rolls) {
                const img = document.createElement("img");
                img.src = `images/dice-${roll}.png`;
                img.style.width = "72px";
                img.style.height = "72px";
                div.appendChild(img);
            }
            element.appendChild(div);
        }
    }
};