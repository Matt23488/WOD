import ICommand from "./ICommand";

export default class ObservableWriteCommand<T> implements ICommand {
    private _observable: KnockoutObservable<T>;
    private _newValue: T;
    private _oldValue: T;

    public constructor(observable: KnockoutObservable<T>, newValue: T, oldValue: T) {
        this._observable = observable;
        this._newValue = newValue;
        this._oldValue = oldValue;
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