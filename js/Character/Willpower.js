export default class Willpower {
    constructor(total, used) {
        this.used = ko.observable(used || 0);
        this.total = ko.observable(total);
        this.total.subscribe(val => {
            if (this.used() > val) this.used(val);
        });
    }

    clearUsed() {
        this.used(0);
    }
}

function updateUsedDisplay(element, valueAccessor) {
    const used = valueAccessor().willpower.used();
    const dots = element.getElementsByTagName("span");
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("filled-red");
        if (i < used) dots[i].classList.add("filled-red");
    }
}

ko.bindingHandlers.willpower = {
    init: function (element, valueAccessor) {
        let previousTotalSubscription;
        function setup() {
            [...element.getElementsByTagName("span")].forEach(e => e.remove());
            const dots = [];
            for (let i = 0; i < valueAccessor().willpower.total(); i++) {
                const dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                element.appendChild(dot);

                dots.push(dot);
                const captureDots = dots.map(dot => dot);

                dot.addEventListener("pointerenter", () => {
                    captureDots.forEach(dot => dot.classList.add("hoverFilled"));
                });
                dot.addEventListener("pointerleave", () => {
                    captureDots.forEach(dot => dot.classList.remove("hoverFilled"));
                });
            }
            dots.forEach((dot, index) => {
                dot.addEventListener("click", () => {
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