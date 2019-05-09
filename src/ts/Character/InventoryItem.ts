export default class InventoryItem {
    public name: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public quantity: KnockoutObservable<number>;
    public displayText: KnockoutComputed<string>;

    public constructor(name?: string, description?: string, quantity?: number, locked?: KnockoutObservable<boolean>) {
        this.name = ko.observable(name || "");
        this.description = ko.observable(description || "");
        this.quantity = ko.observable(quantity || 1);

        if (locked) {
            this.name = this.name.extend({ lockable: locked });
            this.description = this.description.extend({ lockable: locked });
            this.quantity = this.quantity.extend({ lockable: locked });
        }

        this.displayText = ko.computed(this.getDisplayText, this);
    }

    public getDisplayText() : string {
        return `${this.quantity()} ${this.name()}`;
    }

    public static createLockable(locked: KnockoutObservable<boolean>) {
        return new InventoryItem(null, null, null, locked);
    }
}