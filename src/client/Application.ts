import Character from "./Character/Character";
import Dice from "./Dice";
// import swal from "sweetalert";
import CommandStack from "./Command/CommandStack";
import ICharacterRepository, { getCharacterRepository } from "./Character/Repository/ICharacterRepository";
import { registerKeyboardCommand } from "./Keyboard";

export default class Application {
    private _characterRepo: ICharacterRepository;
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
    public canUndo: KnockoutComputed<boolean>;
    public canRedo: KnockoutComputed<boolean>;

    public constructor() {
        this._characterRepo = getCharacterRepository("LocalStorage");

        const savedCharacters = this._characterRepo.loadCharacters();
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
            else if (hours === 0) hours = 12;
            return `${hours}:${minutePrefix}${minutes}:${secondPrefix}${seconds} ${suffix}`;
        }, this);

        this.canUndo = ko.computed(() => CommandStack.instance.canUndo() && !this.character().locked(), this);
        this.canRedo = ko.computed(() => CommandStack.instance.canRedo() && !this.character().locked(), this);

        window.setInterval(() => {
            this.currentTime(new Date());
        }, 1000);

        registerKeyboardCommand("s", () => this.saveCharacters());
        registerKeyboardCommand("z", () => { 
            if (this.mode() === "list") return;
            this.undo();
        });
        registerKeyboardCommand("Z", () => {
            if (this.mode() === "list") return;
            this.redo();
        });
        registerKeyboardCommand("l", () => {
            if (this.mode() === "list") return;
            this.toggleCharacterLock();
        });
        registerKeyboardCommand("o", () => this.toggleClock());
        registerKeyboardCommand("q", () => CommandStack.instance.log());
        registerKeyboardCommand("y", async () => {
            const name = prompt("Name?");
            const password = prompt("Password?");
            let response = await fetch("http://localhost:3000/api/JoinRoom", {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, password })
            });
            let resJson = await response.json();
            if (!resJson.success) {
                alert(resJson.message);
                return;
            }
            console.log(resJson);
            alert(`Joined room "${name}" and your token is "${resJson.data.token}"`);
        });
        registerKeyboardCommand("d", async () => {
            const response = await fetch("http://localhost:3000/debug/GetRoomData");
            const resJson = await response.json();
            if (!resJson.success) {
                alert(resJson.message);
                return;
            }
            console.log(resJson.data);
        });

        window.addEventListener("hashchange", e => {
            const hash = window.location.hash.substring(1);
            if (!hash) return;

            var offset = 80; // TODO: Don't hardcode this maybe?
            var $domElement = $(`#${hash}`);
            $(window).scrollTop($domElement.offset().top - offset);
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
        this.selectCharacter(newChar);
    }

    public selectCharacter(character: Character): void {
        const charIndex = this.characters.indexOf(character);
        if (this.characterId() !== charIndex) {
            this.characterId(charIndex);
            CommandStack.instance.reset();
        }
        this.mode("sheet");
    }

    public deleteCharacter(character: Character): void {
        if (this.character().locked()) return;
        swal({
            title: `Delete ${this.character().name()}`,
            text: "Are you sure? (As long as you don't save, your character won't be gone.)",
            icon: "warning",
            buttons: ["Cancel", "Delete"],
            dangerMode: true
        })
        .then((willDelete: boolean) => {
            if (willDelete) {
                const id = this.characterId();
                this.characterId(0);
                this.characters.remove(this.characters()[id]);
                this.mode("list");
            }
        });
    }

    public saveCharacters(): void {
        this._characterRepo.saveCharacters(this.realCharacters());
        swal("Characters saved successfully!", {
            buttons: {},
            timer: 1000,
            icon: "success"
        });
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

    public undo(): void {
        if (!this.canUndo()) return;
        CommandStack.instance.undo();
    }

    public redo(): void {
        if (!this.canRedo()) return;
        CommandStack.instance.redo();
    }
}