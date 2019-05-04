$(function () {
    var app = new Application();
    ko.applyBindings(app);

    // Exposing the view model to the global state in case manual changes need to be applied
    window.app = app;
});