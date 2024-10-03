import { assert, expect } from "chai";
import { computeHashInU64Array } from "../src/util";

describe("Utilities", () => {
    it("should compute hash in u64", async () => {
        const hashInU64 = computeHashInU64Array([10, 0].map(BigInt));

        assert.deepEqual(hashInU64, [
            1635600225298169792n,
            288306058934854982n,
            9851717529821750519n,
            1782441492159610024n,
        ]);
    });
});
