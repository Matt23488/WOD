import ICommand from "./ICommand";

export default class TextInputCommand implements ICommand {
    private _observable: KnockoutObservable<string>;
    private _newValue: string;
    private _oldValue: string;

    public constructor(observable: KnockoutObservable<string>, newValue: string, oldValue: string) {
        this._observable = observable;
        this._newValue = newValue;
        this._oldValue = oldValue;
    }

    public get type(): string { return "TextInputCommand"; }

    public execute(): void {
        this._observable(this._newValue);
    }

    public undo(): void  {
        this._observable(this._oldValue);
    }

    public doesNothing(): boolean {
        return this._newValue === this._oldValue;
    }
}