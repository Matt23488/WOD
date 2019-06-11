export default class Merit {
    public name: KnockoutObservable<string>;
    public value: KnockoutObservable<number>;

    public constructor(name?: string, value?: number, locked?: KnockoutObservable<boolean>) {
        this.name = ko.observable(name || "");
        this.value = ko.observable(value || 0);

        if (locked) {
            this.name = this.name.extend({ lockable: locked });
            this.value = this.value.extend({ lockable: locked });
        }
    }

    public static createLockable(locked: KnockoutObservable<boolean>) {
        return new Merit(null, null, locked);
    }
}