import ICommand from "./ICommand";

export default class ClearUsedCommand implements ICommand {
    private _observable: KnockoutObservable<number>;
    private _oldValue: number;

    public constructor(observable: KnockoutObservable<number>) {
        this._observable = observable;
        this._oldValue = observable();
    }

    public get type(): string { return "ClearUsedCommand"; }

    public execute(): void {
        this._observable(0);
    }

    public undo(): void {
        this._observable(this._oldValue);
    }

    public doesNothing(): boolean {
        return this._oldValue === 0;
    }
}