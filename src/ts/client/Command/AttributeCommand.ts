import ICommand from "./ICommand";

export default class AttributeCommand implements ICommand {
    private _observable: KnockoutObservable<number>;
    private _newValue: number;
    private _oldValue: number;

    public constructor(observable: KnockoutObservable<number>, newValue: number, oldValue: number) {
        this._observable = observable;
        this._newValue = newValue;
        this._oldValue = oldValue;
    }

    public getType(): string { return "AttributeCommand"; }
    public toString(): string {
        return `${this._observable.getName()}: ${this._oldValue} => ${this._newValue}`;
    }

    public execute(): void {
        this._observable(this._newValue);
    }

    public undo(): void {
        this._observable(this._oldValue);
    }

    public doesNothing(): boolean {
        return this._newValue === this._oldValue;
    }
}