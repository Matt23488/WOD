$(function () {
    function InventoryItem(name, description, quantity) {
        var self = this;
        self.name = ko.observable(name);
        self.description = ko.observable(description);
        self.quantity = ko.observable(quantity);
        self.displayText = ko.computed(self.getDisplayText, self);
    }

    InventoryItem.prototype.getDisplayText = function () {
        return this.quantity() + " " + this.name();
    };

    window.InventoryItem = InventoryItem;
});