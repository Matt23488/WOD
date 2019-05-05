$(function () {
    function Note(value) {
        var self = this;
        self.value = ko.observable(value);
    }

    window.Note = Note;
});