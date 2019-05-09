export default class Equipment {
    public name: KnockoutObservable<string>;
    public description: KnockoutObservable<string>;

    public constructor(name?: string, description?: string, locked?: KnockoutObservable<boolean>) {
        this.name = ko.observable(name || "");
        this.description = ko.observable(description || "");

        if (locked) {
            this.name = this.name.extend({ lockable: locked });
            this.description = this.description.extend({ lockable: locked });
        }
    }

    public static createLockable(locked: KnockoutObservable<boolean>) {
        return new Equipment(null, null, locked);
    }
}