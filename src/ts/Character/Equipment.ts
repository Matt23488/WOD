export default class Equipment {
    public name: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;

    public constructor(name?: string, description?: string) {
        this.name = ko.observable(name || "");
        this.description = ko.observable(description || "");
    }
}