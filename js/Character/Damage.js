export default class Damage {
    constructor (totalHealth, bashing, lethal, aggravated) {
        this.bashing = ko.observable(bashing || 0);
        this.lethal = ko.observable(lethal || 0);
        this.aggravated = ko.observable(aggravated || 0);
        this.totalHealth = ko.observable(totalHealth);

        this.totalHealth.subscribe(val => {
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
        });
    }

    addBashing() {
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
            // TODO: Figure out how damage accumulates
            alert ("you ded");
        }
    }

    addLethal() {
        if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
            this.lethal(this.lethal() + 1);
        }
        else {
            if (this.anyEmpty()) {
                this.lethal(this.lethal() + 1);
            }
            else {
                // TODO: Figure out how damage accumulates
                alert("you ded");
            }
        }
    }

    addAggravated() {
        if (this.lethal() > 0) {
            this.lethal(this.lethal() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else if (this.bashing() > 0) {
            this.bashing(this.bashing() - 1);
            this.aggravated(this.aggravated() + 1);
        }
        else {
            if (this.anyEmpty()) {
                this.aggravated(this.aggravated() + 1);
            }
            else {
                // TODO: Figure out how damage accumulates
                alert("you ded");
            }
        }
    }

    anyEmpty() {
        return this.bashing() + this.lethal() + this.aggravated() < this.totalHealth();
    }
}

function updateDamageDisplay(element, valueAccessor) {
    const damageObj = valueAccessor().damage;
    const imgs = element.getElementsByTagName("img");
    for (let i = 0; i < imgs.length; i++) {
        if (i < damageObj.aggravated()) {
            imgs[i].src = "images/aggravated.png";
        }
        else if (i - damageObj.aggravated() < damageObj.lethal()) {
            imgs[i].src = "images/lethal.png";
        }
        else if (i - damageObj.aggravated() - damageObj.lethal() < damageObj.bashing()) {
            imgs[i].src = "images/bashing.png";
        }
        else {
            imgs[i].src = "images/none.png";
        }
    }
}

ko.bindingHandlers.damage = {
    init: function (element, valueAccessor) {
        let previousTotalSubscription;
        function setup() {
            [...element.getElementsByTagName("img")].forEach(e => e.remove());
            const damageObj = valueAccessor().damage;
            for (let i = 0; i < damageObj.totalHealth(); i++) {
                const cb = document.createElement("img");
                cb.style.border = "1px solid var(--body-color)";
                cb.style.margin = "0 2px";
                cb.src = "images/none.png";

                element.appendChild(cb);
            }

            updateDamageDisplay(element, valueAccessor);
            if (previousTotalSubscription) previousTotalSubscription.dispose();
            previousTotalSubscription = valueAccessor().damage.totalHealth.subscribe(setup);
        }

        setup();
        valueAccessor().app.character.subscribe(setup);
    },
    update: updateDamageDisplay
};