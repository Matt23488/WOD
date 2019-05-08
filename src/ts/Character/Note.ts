export default class Note {
    public value: KnockoutObservable<string>;

    public constructor(value?: string) {
        this.value = ko.observable(value || "");
    }
}