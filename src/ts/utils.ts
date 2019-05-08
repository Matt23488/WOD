export function randomInteger(minInclusive = 0, maxExclusive = 10): number {
    if (maxExclusive < minInclusive) {
        [minInclusive, maxExclusive] = [maxExclusive, minInclusive];
    }

    return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
}

export function randomFloat(minInclusive = 0, maxExclusive = 1): number {
    if (maxExclusive < minInclusive) {
        [minInclusive, maxExclusive] = [maxExclusive, minInclusive];
    }

    return Math.random() * (maxExclusive - minInclusive) + minInclusive;
}