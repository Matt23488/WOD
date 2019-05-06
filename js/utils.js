$(function () {
    function randomInteger(minInclusive, maxExclusive) {
        if (!minInclusive) minInclusive = 0;
        if (!maxExclusive) maxExclusive = 10;
        if (maxExclusive < minInclusive) {
            var temp = minInclusive;
            minInclusive = maxExclusive;
            maxExclusive = temp;
        }
    
        return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
    }

    function randomFloat(minInclusive, maxExclusive) {
        if (!minInclusive) minInclusive = 0;
        if (!maxExclusive) maxExclusive = 1;
        if (maxExclusive < minInclusive) {
            var temp = minInclusive;
            minInclusive = maxExclusive;
            maxExclusive = temp;
        }

        return Math.random() * (maxExclusive - minInclusive) + minInclusive;
    }

    window.randomInteger = randomInteger;
    window.randomFloat = randomFloat;
});