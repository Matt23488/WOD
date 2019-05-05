$(function () {
    function Merit(name, value) {
        var self = this;
        self.name = ko.observable(name);
        self.value = ko.observable(value);
    }

    window.Merit = Merit;
});