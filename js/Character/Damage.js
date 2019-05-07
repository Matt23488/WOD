$(function () {
    function Damage(bashing, lethal, aggravated, totalHealthObservable) {
        var self = this;
        self.bashing = ko.observable(bashing || 0);
        self.lethal = ko.observable(lethal || 0);
        self.aggravated = ko.observable(aggravated || 0);
        self.totalHealth = totalHealthObservable;

        totalHealthObservable.subscribe(function (val) {
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
            self.lethal(self.lethal() + 1);
        }
        else if (self.lethal() > 0) {
            self.lethal(self.lethal() - 1);
            self.aggravated(self.aggravated() + 1);
        }
        else {
            alert("you ded");
        }
    };

    Damage.prototype.addLethal = function () {
        var self = this;
        if (self.anyEmpty()) {
            self.lethal(self.lethal() + 1);
        }
        else if (self.bashing() > 0) {
            self.bashing(self.bashing() - 1);
            self.lethal(self.lethal() + 1);
        }
        else if (self.lethal() > 0) {
            self.lethal(self.lethal() - 1);
            self.aggravated(self.aggravated() + 1);
        }
        else {
            alert("you ded");
        }
    };

    Damage.prototype.addAggravated = function () {
        var self = this;
        if (self.anyEmpty()) {
            self.aggravated(self.aggravated() + 1);
        }
        else if (self.bashing() > 0) {
            self.bashing(self.bashing() - 1);
            self.aggravated(self.aggravated() + 1);
        }
        else if (self.lethal() > 0) {
            self.lethal(self.lethal() - 1);
            self.aggravated(self.aggravated() + 1);
        }
        else {
            alert("you ded");
        }
    };

    Damage.prototype.clearAll = function () {
        this.bashing(0);
        this.lethal(0);
        this.aggravated(0);
    };

    Damage.prototype.anyEmpty = function () {
        return this.bashing() + this.lethal() + this.aggravated() < this.totalHealth();
    };
    
    ko.bindingHandlers.damage = {
        init: function (element) {
            for (var i = 0; i < 12; i++) {
                var span = document.createElement("span");
                span.classList.add("damage");
                span.classList.add("none");
                element.appendChild(span);
            }
        },
        update: function (element, valueAccessor) {
            var damageObj = valueAccessor().value;
            var spans = element.getElementsByTagName("span");
            for (var i = 0; i < spans.length; i++) {
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

    window.Damage = Damage;
});