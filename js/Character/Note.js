export default class Note {
    constructor(value) {
        this.value = ko.observable(value);
    }
}