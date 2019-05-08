export default class InventoryItem {
    public name: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;
    public quantity: KnockoutObservable<number>;
    public displayText: KnockoutComputed<string>;

    public constructor(name?: string, description?: string, quantity?: number) {
        this.name = ko.observable(name || "");
        this.description = ko.observable(description || "");
        this.quantity = ko.observable(quantity || 1);
        this.displayText = ko.computed(this.getDisplayText, this);
    }

    public getDisplayText() : string {
        return `${this.quantity()} ${this.name()}`;
    }
}