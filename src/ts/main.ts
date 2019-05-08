import Application from "./Application";
import Equipment from "./Character/Equipment";
import InventoryItem from "./Character/InventoryItem";
import Merit from "./Character/Merit";
import Note from "./Character/Note";

const constructors = {
    Equipment: Equipment,
    InventoryItem: InventoryItem,
    Merit: Merit,
    Note: Note
};
Object.defineProperty(window, "constructors", { value: constructors });

const app = new Application();
ko.applyBindings(app);

// Exposing the view model to the global state in case manual changes need to be applied
Object.defineProperty(window, "app", { value: app });

function toggleTooltips(enable: boolean): void {
    if (enable) $("[data-toggle='tooltip']").tooltip();
    else $("[data-toggle='tooltip']").tooltip("dispose");
}

window.addEventListener("resize", () => {
    toggleTooltips(window.outerWidth >= 992);
});
toggleTooltips(window.outerWidth >= 992);