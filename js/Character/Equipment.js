$(function () {
    function Equipment(name, description) {
        var self = this;
        self.name = ko.observable(name);
        self.description = ko.observable(description);
    }

    window.Equipment = Equipment;
});