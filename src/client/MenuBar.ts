import { registerKeyboardCommand } from "./Keyboard";

export default class MenuBar {
    private _menus: Menu[];

    public constructor() {
        this._menus = [];
    }

    public *getMenus(): IterableIterator<Menu> {
        for (let menu of this._menus) yield menu;
    }

    public addMenu(text: string): Menu {
        const menu = new Menu(text);
        this._menus.push(menu);
        return menu;
    }
}

class Menu {
    private _text: string;
    private _options: MenuOption[];

    public constructor(text: string) {
        this._text = text;
        this._options = [];
    }

    public get text(): string { return this._text; }

    public *getMenuOptions(): IterableIterator<MenuOption> {
        for (let option of this._options) yield option;
    }

    public addMenuOption(text: string, visible: KnockoutObservable<boolean>, callback: () => void, commandKey?: string) {
        this._options.push(new MenuOption(text, visible, callback, commandKey));
    }
}

class MenuOption {
    private _text: string;
    private _visible: KnockoutObservable<boolean>;
    private _commandKey: string;
    private _callback: () => void;

    public constructor(text: string, visible: KnockoutObservable<boolean>, callback: () => void, commandKey?: string) {
        this._text = text;
        this._visible = visible;
        this._commandKey = commandKey;
        this._callback = callback;

        // TODO: Should this be in the binding?
        if (commandKey) {
            registerKeyboardCommand(commandKey, () => {
                if (visible()) callback();
            });
        }
    }

    public get text(): string { return this._text; }
    public get visible(): KnockoutObservable<boolean> { return this._visible; }
    public get commandKey(): string { return this._commandKey; }
    public get callback(): () => void { return this._callback; }
}