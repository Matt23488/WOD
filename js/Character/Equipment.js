export default class Equipment {
    constructor(name, description) {
        this.name = ko.observable(name);
        this.description = ko.observable(description);
    }
}