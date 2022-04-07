class Mathmatic {
    static toInt(n : number) {
        return this.hasDecimalPlaces(n)?parseInt((n*100).toFixed()):n;
    }

    static hasDecimalPlaces(n: number) : boolean {
        return n % 1 != 0;
    }
}

export { Mathmatic };