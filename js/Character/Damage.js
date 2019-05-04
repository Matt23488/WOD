$(function () {
    function Damage(totalHealth, bashing, lethal, aggravated) {
        var self = this;
        self.bashing = ko.observable(bashing || 0);
        self.lethal = ko.observable(lethal || 0);
        self.aggravated = ko.observable(aggravated || 0);
        self.totalHealth = ko.observable(totalHealth);

        self.totalHealth.subscribe(function (val) {
            while (self.bashing() + self.lethal() + self.aggravated() > val) {
                if (self.bashing() > 0) {
                    self.bashing(self.bashing() - 1);
                }
                else if (self.lethal() > 0) {
                    self.lethal(self.lethal() - 1);
                }
                else {
                    self.aggravated(self.aggravated() - 1);
                }
            }
        });
    }

    Damage.prototype.addBashing = function () {
        var self = this;
        if (self.anyEmpty()) {
            self.bashing(self.bashing() + 1);
        }
        else if (self.bashing() > 0) {
            self.bashing(self.bashing() - 1);
            self.lethal(self.length() + 1);
        }
        else if (self.lethal() > 0) {
            self.lethal(self.lethal() - 1);
            self.aggravated(self.aggravated() + 1);
        }
        else {
            // TODO: Figure out how damage accumulates
            alert("you ded");
        }
    };

    Damage.prototype.addLethal = function () {
        var self = this;
        if (self.bashing() > 0) {
            self.bashing(self.bashing() - 1);
            self.lethal(self.lethal() + 1);
        }
        else {
            if (self.anyEmpty()) {
                self.lethal(self.lethal() + 1);
            }
            else {
                // TODO: Figure out how damage accumulates
                alert("you ded");
            }
        }
    };

    Damage.prototype.addAggravated = function () {
        var self = this;
        if (self.lethal() > 0) {
            self.lethal(self.lethal() - 1);
            self.aggravated(self.aggravated() + 1);
        }
        else if (self.bashing() > 0) {
            self.bashing(self.bashing() - 1);
            self.aggravated(self.aggravated() + 1);
        }
        else {
            if (self.anyEmpty()) {
                self.aggravated(self.aggravated() + 1);
            }
            else {
                // TODO: Figure out how damage accumulates
                alert("you ded");
            }
        }
    };

    Damage.prototype.anyEmpty = function () {
        return this.bashing() + this.lethal() + this.aggravated() < this.totalHealth();
    };

    function updateDamageDisplay(element, valueAccessor) {
        var damageObj = valueAccessor().damage;
        var imgs = element.getElementsByTagName("img");
        for (var i = 0; i < imgs.length; i++) {
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
            var previousTotalSubscription;
            function setup() {
                var imgs = element.getElementsByTagName("img");
                for (var i = 0; i < imgs.length; i++) {
                    imgs[i].remove();
                }
                var damageObj = valueAccessor().damage;
                for (var i = 0; i < damageObj.totalHealth(); i++) {
                    var cb = document.createElement("img");
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

    window.Damage = Damage;
});