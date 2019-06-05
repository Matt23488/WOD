import ICommand from "./ICommand";

export default class CollectionMoveCommand<T> implements ICommand {
    private _observable: KnockoutObservableArray<T>;
    private _item: T;
    private _newIndex: number;
    private _oldIndex: number;

    public constructor(observable: KnockoutObservableArray<T>, item: T, newIndex: number, oldIndex: number) {
        this._observable = observable;
        this._item = item;
        this._newIndex = newIndex;
        this._oldIndex = oldIndex;
    }

    public get type(): string { return "CollectionMoveCommand"; }

    public execute(): void {
        this._observable.splice(this._oldIndex, 1);
        this._observable.splice(this._newIndex, 0, this._item);
    }

    public undo(): void {
        this._observable.splice(this._newIndex, 1);
        this._observable.splice(this._oldIndex, 0, this._item);
    }

    public doesNothing(): boolean {
        return this._newIndex === this._oldIndex;
    }
}