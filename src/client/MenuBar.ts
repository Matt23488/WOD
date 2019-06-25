import { registerKeyboardCommand } from "./Keyboard";

export default class MenuBar {
    // private _menus: Menu[];
    public menus: KnockoutObservableArray<Menu>;

    public constructor() {
        // this._menus = [];
        this.menus = ko.observableArray([]);
    }

    // public *getMenus(): IterableIterator<Menu> {
    //     for (let menu of this._menus) yield menu;
    // }

    public addMenu(text: string): Menu {
        const menu = new Menu(text);
        this.menus.push(menu);
        return menu;
    }
}

class Menu {
    // private _options: MenuOption[];
    
    public text: KnockoutObservable<string>;
    public options: KnockoutObservableArray<MenuOption>;

    public constructor(text: string) {
        this.text = ko.observable(text);
        // this._options = [];
        this.options = ko.observableArray([]);
    }

    // public *getMenuOptions(): IterableIterator<MenuOption> {
    //     for (let option of this._options) yield option;
    // }

    public addMenuOption(text: string, visible: KnockoutObservable<boolean>, callback: () => void, commandKey?: string) {
        this.options.push(new MenuOption(text, visible, callback, commandKey));
    }
}

class MenuOption {
    private _commandKey: string;
    private _callback: () => void;
    
    private text: KnockoutObservable<string>;
    public enabled: KnockoutObservable<boolean>;

    public constructor(text: string, enabled: KnockoutObservable<boolean>, callback: () => void, commandKey?: string) {
        this._commandKey = commandKey;
        this._callback = callback;
        
        this.text = ko.observable(text);
        this.enabled = enabled;

        if (commandKey) {
            registerKeyboardCommand(commandKey, () => {
                this.doCommand();
            });
        }
    }

    public doCommand(): void {
        if (this.enabled()) this._callback();
    }

    // public get text(): string { return this._text; }
    // public get visible(): KnockoutObservable<boolean> { return this._visible; }
    public get commandKey(): string { return this._commandKey; }
    // public get callback(): () => void { return this._callback; }
}