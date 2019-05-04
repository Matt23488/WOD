$(function () {
    function Willpower(total, used) {
        var self = this;
        self.used = ko.observable(used || 0);
        self.total = ko.observable(total);
        self.total.subscribe(function (val) {
            if (self.used() > val) self.used(val);
        });
    }

    Willpower.prototype.clearUsed = function () {
        this.used(0);
    };
    
    function updateUsedDisplay(element, valueAccessor) {
        var used = valueAccessor().willpower.used();
        var total = valueAccessor().willpower.total();
        var dots = element.getElementsByTagName("span");
        for (var i = 0; i < dots.length; i++) {
            if (i < used) dots[i].classList.add("filled-red");
            else dots[i].classList.remove("filled-red");

            if (i < total) dots[i].classList.remove("HIDDEN");
            else dots[i].classList.add("HIDDEN");
        }
    }
    
    ko.bindingHandlers.willpower = {
        init: function (element, valueAccessor) {
            var totalSub;
            function setup() {
                var dots = [];
                for (var i = 0; i < 12; i++) {
                    var dot = document.createElement("span");
                    dot.classList.add("attribute-dot");
                    dot.dataset.index = i;
                    element.appendChild(dot);
    
                    dots.push(dot);
    
                    dot.addEventListener("pointerenter", function () {
                        var dotIndex = parseInt(this.dataset.index);
                        dots.forEach(function (dot, index) {
                            if (index <= dotIndex) dot.classList.add("hoverFilled");
                        });
                    });
                    dot.addEventListener("pointerleave", function () {
                        dots.forEach(function (dot) {
                            dot.classList.remove("hoverFilled");
                        });
                    });
                }
                dots.forEach(function (dot, index) {
                    dot.addEventListener("click", function () {
                        valueAccessor().willpower.used(index + 1);
                    });
                });
    
                updateUsedDisplay(element, valueAccessor);
                if (totalSub) totalSub.dispose();
                totalSub = valueAccessor().willpower.total.subscribe(updateUsedDisplay.bind(this, element, valueAccessor));
            }
    
            setup();
            valueAccessor().app.character.subscribe(updateUsedDisplay.bind(this, element, valueAccessor));
        },
        update: updateUsedDisplay
    };
    
    ko.bindingHandlers.remainingTooltip = {
        update: function (element, valueAccessor) {
            $(element).tooltip("dispose");
            $(element).tooltip({ title: `${valueAccessor().total() - valueAccessor().used()} points left` });
        }
    };

    window.Willpower = Willpower;
});