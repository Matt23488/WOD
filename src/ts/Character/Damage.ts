export default class Damage {
    public totalHealth: KnockoutComputed<number>;
    public bashing: KnockoutObservable<number>;
    public lethal: KnockoutObservable<number>;
    public aggravated: KnockoutObservable<number>;

    public constructor(totalHealthObservable: KnockoutComputed<number>, bashing?: number, lethal?: number, aggravated?: number, locked?: KnockoutObservable<boolean>) {
        this.totalHealth = totalHealthObservable;
        this.bashing = ko.observable(bashing || 0);
        this.lethal = ko.observable(lethal || 0);
        this.aggravated = ko.observable(aggravated || 0);

        if (locked) {
            this.bashing = this.bashing.extend({ lockable: locked });
            this.lethal = this.lethal.extend({ lockable: locked });
            this.aggravated = this.aggravated.extend({ lockable: locked });
        }

        totalHealthObservable.subscribe(val => {
            while (this.bashing() + this.lethal() + this.aggravated() > val) {
                if (this.bashing() > 0) {
                    this.bashing(this.bashing() - 1);
                }
                else if (this.lethal() > 0) {
                    this.lethal(this.lethal() - 1);
                }
                else {
                    this.aggravated(this.aggravated() - 1);
                }
            }
        }, this);
    }

    public anyEmpty(): boolean {
        return this.bashing() + this.lethal() + this.aggravated() < this.totalHealth();
    }

    public addBashing(): void {
        if (this.anyEmpty()) {
            this.bashing(this.bashing() + 1);
        }
        else if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
            this.lethal(this.lethal() + 1);
        }
        else if (this.lethal() > 0) {
            this.lethal(this.lethal() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else {
            alert("you ded");
        }
    }

    public addLethal(): void {
        if (this.anyEmpty()) {
            this.lethal(this.lethal() + 1);
        }
        else if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
            this.lethal(this.lethal() + 1);
        }
        else if (this.lethal() > 0) {
            this.lethal(this.lethal() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else {
            alert("you ded");
        }
    }

    public addAggravated(): void {
        if (this.anyEmpty()) {
            this.aggravated(this.aggravated() + 1);
        }
        else if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else if (this.lethal() > 0) {
            this.lethal(this.lethal() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else {
            alert("you ded");
        }
    }

    public clearAll(): void {
        this.bashing(0);
        this.lethal(0);
        this.aggravated(0);
    }
}