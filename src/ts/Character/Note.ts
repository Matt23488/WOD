export default class Note {
    public value: KnockoutObservable<string>;

    public constructor(value?: string, locked?: KnockoutObservable<boolean>) {
        this.value = ko.observable(value || "");

        if (locked) {
            this.value = this.value.extend({ lockable: locked });
        }
    }

    public static createLockable(locked: KnockoutObservable<boolean>) {
        return new Note(null, locked);
    }
}