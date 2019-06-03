import ICommand from "./ICommand";

export default class CollectionRemoveCommand<T> implements ICommand {
    private _observable: KnockoutObservableArray<T>;
    private _item: T;
    private _itemIndex: number;

    public constructor(observable: KnockoutObservableArray<T>, item: T) {
        this._observable = observable;
        this._item = item;
        this._itemIndex = this._observable.indexOf(this._item);
    }

    public execute(): void {
        this._observable.remove(this._item);
    }

    public undo(): void {
        this._observable.splice(this._itemIndex, 0, this._item);
    }

    public doesNothing(): boolean {
        return false;
    }
}