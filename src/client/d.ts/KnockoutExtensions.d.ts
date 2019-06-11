interface KnockoutSubscribableFunctions<T> {
    getName(): string;
}

interface KnockoutExtenders {
    lockable<T>(target: KnockoutObservable<T>, locked: KnockoutObservable<boolean>): KnockoutSubscribable<T>;
    numeric(target: KnockoutObservable<number>, args: { precision?: number, min?: number, max?: number }): KnockoutSubscribable<number>;
    named<T>(target: KnockoutObservable<T>, name: string): KnockoutSubscribable<T>;
}