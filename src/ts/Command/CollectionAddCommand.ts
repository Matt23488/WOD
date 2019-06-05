import ICommand from "./ICommand";

export default class CollectionAddCommand<T> implements ICommand {
    private _observable: KnockoutObservableArray<T>;
    private _newItem: T;

    public constructor(observable: KnockoutObservableArray<T>, newItem: T) {
        this._observable = observable;
        this._newItem = newItem;
    }

    public getType(): string { return "CollectionAddCommand"; }

    public execute(): void {
        this._observable.push(this._newItem);
    }

    public undo(): void {
        this._observable.remove(this._newItem);
    }

    public doesNothing(): boolean {
        return false;
    }
}