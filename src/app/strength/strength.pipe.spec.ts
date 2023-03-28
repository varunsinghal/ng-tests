import { StrengthPipe } from "./strength.pipe"

describe("StrengthPipe", () => {
    let strength: StrengthPipe;

    beforeEach(() => {
        strength = new StrengthPipe();
    });

    it("should evaluate to weak", () => {
        expect(strength.transform(5)).toEqual("5 (weak)");
    });

    it("should evaluate to strong", () => {
        expect(strength.transform(11)).toEqual("11 (strong)");
    });

    it("should evaluate to unbelievable", () => {
        expect(strength.transform(22)).toEqual("22 (unbelievable)");
    });

})