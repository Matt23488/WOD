export default class Damage {
    public totalHealth: KnockoutComputed<number>;
    public bashing: KnockoutObservable<number>;
    public lethal: KnockoutObservable<number>;
    public aggravated: KnockoutObservable<number>;

    public constructor(totalHealthObservable: KnockoutComputed<number>, bashing?: number, lethal?: number, aggravated?: number) {
        this.totalHealth = totalHealthObservable;
        this.bashing = ko.observable(bashing || 0);
        this.lethal = ko.observable(lethal || 0);
        this.aggravated = ko.observable(aggravated || 0);

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

ko.bindingHandlers.damageDisplay = {
    init: (element: HTMLElement) => {
        for (let i = 0; i < 12; i++) {
            const span = document.createElement("span");
            span.classList.add("damage");
            span.classList.add("none");
            element.appendChild(span);
        }
    },
    update: (element: HTMLElement, valueAccessor: () => Damage) => {
        const damageObj = valueAccessor();
        const spans = element.getElementsByTagName("span");
        for (let i = 0; i < spans.length; i++) {
            if (i < damageObj.aggravated()) {
                spans[i].classList.remove("none");
                spans[i].classList.remove("bashing");
                spans[i].classList.remove("lethal");
                spans[i].classList.add("aggravated");
            }
            else if (i - damageObj.aggravated() < damageObj.lethal()) {
                spans[i].classList.remove("none");
                spans[i].classList.remove("bashing");
                spans[i].classList.remove("aggravated");
                spans[i].classList.add("lethal");
            }
            else if (i - damageObj.aggravated() - damageObj.lethal() < damageObj.bashing()) {
                spans[i].classList.remove("none");
                spans[i].classList.remove("lethal");
                spans[i].classList.remove("aggravated");
                spans[i].classList.add("bashing");
            }
            else {
                spans[i].classList.remove("bashing");
                spans[i].classList.remove("lethal");
                spans[i].classList.remove("aggravated");
                spans[i].classList.add("none");
            }

            if (i < damageObj.totalHealth()) {
                spans[i].classList.remove("HIDDEN");
            }
            else {
                spans[i].classList.add("HIDDEN");
            }
        }
    }
};