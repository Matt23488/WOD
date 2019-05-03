export default class Willpower {
    constructor(total, used) {
        this.used = ko.observable(used || 0);
        this.total = ko.observable(total);
        this.total.subscribe(val => {
            if (this.usedWillpower() > val) this.usedWillpower(val);
        });
    }

    clearUsed() {
        this.used(0);
    }
}

ko.bindingHandlers.willpower = {
    init: function (element, valueAccessor) {
        function setup() {
            [...element.getElementsByTagName("span")].forEach(e => e.remove());
            const dots = [];
            for (let i = 0; i < valueAccessor().total(); i++) {
                const dot = document.createElement("span");
                dot.classList.add("attribute-dot");
                if (i < valueAccessor().used()) {
                    dot.classList.add("filled-red");
                }
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
                    valueAccessor().used(index + 1);
                });
            });
        }

        setup();
        valueAccessor().total.subscribe(setup);
    },
    update: function (element, valueAccessor) {
        const used = valueAccessor().used();
        const dots = element.getElementsByTagName("span");

        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("filled-red");
            if (i < used) {
                dots[i].classList.add("filled-red");
            }
        }
    }
};

ko.bindingHandlers.remainingTooltip = {
    update: function (element, valueAccessor) {
        $(element).tooltip("dispose");
        $(element).tooltip({ title: `${valueAccessor().total() - valueAccessor().used()} points left` });
    }
};