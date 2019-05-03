import Application from "./Application.js";

const app = new Application();
ko.applyBindings(app);

// exposing the view model to the global state in case manual changes need to be applied
window.app = app;