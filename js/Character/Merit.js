export default class Merit {
    constructor(name, value) {
        this.name = ko.observable(name);
        this.value = ko.observable(value);
    }
}