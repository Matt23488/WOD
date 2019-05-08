export default class Merit {
    public name: KnockoutObservable<string>;
    public value: KnockoutObservable<number>;

    public constructor(name?: string, value?: number) {
        this.name = ko.observable(name || "");
        this.value = ko.observable(value || 0);
    }
}