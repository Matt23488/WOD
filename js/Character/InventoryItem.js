export default class InventoryItem {
    constructor(name, description, quantity) {
        this.name = ko.observable(name);
        this.description = ko.observable(description);
        this.quantity = ko.observable(quantity);
        this.displayText = ko.computed(this.getDisplayText, this);
    }

    getDisplayText() {
        return `${this.quantity()} ${this.name()}`;
    }
}