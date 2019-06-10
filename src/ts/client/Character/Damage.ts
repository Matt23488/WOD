import CommandStack from "../Command/CommandStack";
import AttributeCommand from "../Command/AttributeCommand";
import BatchCommand from "../Command/BatchCommand";

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
            let bashing = this.bashing();
            let lethal = this.lethal();
            let aggravated = this.aggravated();
            while (bashing + lethal + aggravated > val) {
                if (bashing > 0) {
                    bashing--;
                }
                else if (lethal > 0) {
                    lethal--;
                }
                else {
                    aggravated--;
                }
            }
            CommandStack.instance.executeWithPrevious(new BatchCommand(
                new AttributeCommand(this.bashing, bashing, this.bashing()),
                new AttributeCommand(this.lethal, lethal, this.lethal()),
                new AttributeCommand(this.aggravated, aggravated, this.aggravated())
            ));
        }, this);
    }

    public anyEmpty(): boolean {
        return this.bashing() + this.lethal() + this.aggravated() < this.totalHealth();
    }

    public addBashing(): void {
        if (this.anyEmpty()) {
            CommandStack.instance.execute(new AttributeCommand(this.bashing, this.bashing() + 1, this.bashing()));
        }
        else if (this.bashing() > 0) {
            CommandStack.instance.execute(new BatchCommand(
                new AttributeCommand(this.bashing, this.bashing() - 1, this.bashing()),
                new AttributeCommand(this.lethal, this.lethal() + 1, this.lethal())
            ));
        }
        else if (this.lethal() > 0) {
            CommandStack.instance.execute(new BatchCommand(
                new AttributeCommand(this.lethal, this.lethal() - 1, this.lethal()),
                new AttributeCommand(this.aggravated, this.aggravated() + 1, this.aggravated())
            ));
        }
        else {
            alert("you ded");
        }
    }

    public addLethal(): void {
        if (this.anyEmpty()) {
            CommandStack.instance.execute(new AttributeCommand(this.lethal, this.lethal() + 1, this.lethal()));
        }
        else if (this.bashing() > 0) {
            CommandStack.instance.execute(new BatchCommand(
                new AttributeCommand(this.bashing, this.bashing() - 1, this.bashing()),
                new AttributeCommand(this.lethal, this.lethal() + 1, this.lethal())
            ));
        }
        else if (this.lethal() > 0) {
            CommandStack.instance.execute(new BatchCommand(
                new AttributeCommand(this.lethal, this.lethal() - 1, this.lethal()),
                new AttributeCommand(this.aggravated, this.aggravated() + 1, this.aggravated())
            ));
        }
        else {
            alert("you ded");
        }
    }

    public addAggravated(): void {
        if (this.anyEmpty()) {
            CommandStack.instance.execute(new AttributeCommand(this.aggravated, this.aggravated() + 1, this.aggravated()));
        }
        else if (this.bashing() > 0) {
            CommandStack.instance.execute(new BatchCommand(
                new AttributeCommand(this.bashing, this.bashing() - 1, this.bashing()),
                new AttributeCommand(this.aggravated, this.aggravated() + 1, this.aggravated())
            ));
        }
        else if (this.lethal() > 0) {
            CommandStack.instance.execute(new BatchCommand(
                new AttributeCommand(this.lethal, this.lethal() - 1, this.lethal()),
                new AttributeCommand(this.aggravated, this.aggravated() + 1, this.aggravated())
            ));
        }
        else {
            alert("you ded");
        }
    }

    public clearAll(): void {
        CommandStack.instance.execute(new BatchCommand(
            new AttributeCommand(this.bashing, 0, this.bashing()),
            new AttributeCommand(this.lethal, 0, this.lethal()),
            new AttributeCommand(this.aggravated, 0, this.aggravated())
        ));
    }
}