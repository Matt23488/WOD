$(function () {
    var app = new Application();
    ko.applyBindings(app);

    // Exposing the view model to the global state in case manual changes need to be applied
    window.app = app;
    window.addEventListener("resize", function () {
        toggleTooltips(window.outerWidth >= 992);
    });
    toggleTooltips(window.outerWidth >= 992);
});

function toggleTooltips(enable) {
    var dispose;
    if (!enable) dispose = "dispose";
    $("[data-toggle='tooltip']").tooltip(dispose);
}