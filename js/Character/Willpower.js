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
        var dots = element.getElementsByTagName("span");
        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.remove("filled-red");
            if (i < used) dots[i].classList.add("filled-red");
        }
    }
    
    // TODO: Fix the closure. Since I'm not using let/const for ES5 compatibility,
    //       the closures aren't working.
    ko.bindingHandlers.willpower = {
        init: function (element, valueAccessor) {
            var previousTotalSubscription;
            function setup() {
                var spans = element.getElementsByTagName("span");
                for (var i = 0; i < spans.length; i++) {
                    spans[i].remove();
                }
                var dots = [];
                for (var i = 0; i < valueAccessor().willpower.total(); i++) {
                    var dot = document.createElement("span");
                    dot.classList.add("attribute-dot");
                    element.appendChild(dot);
    
                    dots.push(dot);
                    var captureDots = dots.map(function (dot) { return dot; });
    
                    dot.addEventListener("pointerenter", function () {
                        captureDots.forEach(function (dot) { dot.classList.add("hoverFilled"); });
                    });
                    dot.addEventListener("pointerleave", function () {
                        captureDots.forEach(function (dot) { dot.classList.remove("hoverFilled"); });
                    });
                }
                dots.forEach(function (dot, index) {
                    dot.addEventListener("click", function () {
                        valueAccessor().willpower.used(index + 1);
                    });
                });
    
                updateUsedDisplay(element, valueAccessor);
                if (previousTotalSubscription) previousTotalSubscription.dispose();
                previousTotalSubscription = valueAccessor().willpower.total.subscribe(setup);
            }
    
            setup();
            valueAccessor().app.character.subscribe(setup);
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