import Character from "./Character/Character";
import Dice from "./Dice";
import swal from "sweetalert";

export default class Application {
    public mode: KnockoutObservable<string>;
    public characterId: KnockoutObservable<number>;
    public characters: KnockoutObservableArray<Character>;
    public realCharacters: KnockoutComputed<Array<Character>>;
    public character: KnockoutComputed<Character>;
    public dice: Dice;
    public lockButtonClass: KnockoutComputed<string>;
    public lockButtonIcon: KnockoutComputed<string>;
    private _previousSection: string;
    public showClock: KnockoutObservable<boolean>;
    public currentTime: KnockoutObservable<Date>;
    public currentTimeDisplay: KnockoutComputed<string>;

    public constructor() {
        const savedCharacters: Array<Character> = (JSON.parse(window.localStorage.getItem("characters")) || []).map(Character.fromJson);
        savedCharacters.unshift(Character.newCharacter());
        savedCharacters[0].ghost = true;

        this.mode = ko.observable("list");
        this.characterId = ko.observable(0);
        this.characters = ko.observableArray(savedCharacters);
        this.realCharacters = ko.computed(() => this.characters().filter(c => !c.ghost), this);
        this.character = ko.computed(() => this.characters()[this.characterId()], this);
        this.dice = new Dice();
        this.lockButtonClass = ko.computed(() => this.character().locked() ? "btn-danger" : "btn-outline-success", this);
        this.lockButtonIcon = ko.computed(() => this.character().locked() ? "fas fa-lock" : "fas fa-lock-open", this);
        this._previousSection = null;
        this.showClock = ko.observable(false);
        this.currentTime = ko.observable(new Date());

        this.currentTimeDisplay = ko.computed(() => {
            const time = this.currentTime();
            let hours = time.getHours();
            const minutes = time.getMinutes();
            const seconds = time.getSeconds();
            const suffix = hours < 12 ? "AM" : "PM";
            const minutePrefix = minutes < 10 ? "0" : "";
            const secondPrefix = seconds < 10 ? "0" : "";
            if (hours > 12) hours -= 12;
            return `${hours}:${minutePrefix}${minutes}:${secondPrefix}${seconds} ${suffix}`;
        }, this);

        window.setInterval(() => {
            this.currentTime(new Date());
        }, 1000);

        window.addEventListener("keydown", e => {
            if (e.key === "s" && e.ctrlKey === true) {
                e.preventDefault();
                this.saveCharacters();
            }
        });
    }

    public toggleClock(): void {
        this.showClock(!this.showClock());
    }

    public goBack(): void {
        if (this.mode() === "sheet") this.mode("list");
        else {
            this.mode("sheet");

            if (this._previousSection) window.location.hash = this._previousSection;
        }
    }

    public newCharacter(): void {
        const newChar = Character.newCharacter();
        newChar.locked(false);
        this.characters.push(newChar);
        this.characterId(this.characters().length - 1);
        this.mode("sheet");
    }

    public selectCharacter(character: Character): void {
        this.characterId(this.characters.indexOf(character));
        this.mode("sheet");
    }

    public deleteCharacter(character: Character): void {
        // swal({
        //     title: `Delete ${this.character().name()}`,
        //     text: "Are you sure? (As long as you don't save, your character won't be gone.)",
        //     icon: "warning",
        //     buttons: ["Cancel", "Delete"],
        //     dangerMode: true
        // })
        // .then((willDelete: boolean) => {
        //     if (willDelete) {
        //         const id = this.characterId();
        //         this.characterId(0);
        //         this.characters.remove(this.characters()[id]);
        //         this.mode("list");
        //     }
        // });
        if (this.character().locked()) return;
        if (confirm(`Are you sure you want to delete ${this.character().name()}? (As long as you don't save, your character won't be gone.)`)) {
            const id = this.characterId();
            this.characterId(0);
            this.characters.remove(this.characters()[id]);
            this.mode("list");
        }
    }

    public saveCharacters(): void {
        window.localStorage.setItem("characters", JSON.stringify(this.realCharacters().map(c => c.toJson())));
        // swal("Characters saved successfully!", {
        //     buttons: [],
        //     timer: 1000,
        //     icon: "success"
        // });
        alert("Characters saved successfully!");
    }

    public downloadCharacter(): void {
        const json = JSON.stringify(this.character().toJson());

        const dl = document.createElement("a");
        dl.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(json)}`);
        dl.setAttribute("download", `${this.character().name()}.json`);

        dl.style.display = "none";
        document.body.appendChild(dl);

        dl.click();

        document.body.removeChild(dl);
    }

    public uploadCharacter(): void {
        const ul = document.createElement("input");
        ul.type = "file";
        ul.accept = ".json";
        ul.style.display = "none";

        ul.addEventListener("change", e => {
            const file = ul.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e: any) => {
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

    public toggleCharacterLock(): void {
        const character = this.character();
        character.locked(!character.locked());
    }

    public switchMode(mode: string): () => void {
        return () => {
            if (this.mode() !== "list" && document.getElementById(mode)) {
                this._previousSection = mode;
            }
            else this._previousSection = null;

            window.location.hash = "";
            this.mode(mode);
        }
    }
}