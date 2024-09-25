import { assert, expect } from "chai";
import { GameplayCjs } from "../src/gameplay/gameplay_cjs";
import * as path from "path";
import { GameplayCjsDynamic } from "../src/gameplay/gameplay_cjs_dynamic";
import { printMemoryUsage } from "./memory_usage_helper";

describe("Wasm Image Import", () => {
    it("should successfully load a gameplay", async () => {
        const gameplay = new GameplayCjs();

        const INITIAL_STATES = [1n, 2n];

        await gameplay.newGame(INITIAL_STATES);

        assert.deepEqual(
            gameplay.getGameState(),
            new BigUint64Array(INITIAL_STATES)
        );
    });

    it("Dynamic imports should work", async () => {
        const gameplay = new GameplayCjsDynamic();
        const INITIAL_STATES = [1n, 2n];

        // expect error before import is done
        expect(gameplay.getGameState.bind(gameplay)).to.be.throw(
            "Gameplay not imported yet. Run importGameplayWasm() first."
        );

        const absPath = path.join(
            __dirname,
            "wasm_images",
            "image1",
            "js",
            "commonjs",
            "gameplay.js"
        );

        // import
        await gameplay.importGameplayWasm(absPath);
        await gameplay.newGame(INITIAL_STATES);

        assert.deepEqual(
            gameplay.getGameState(),
            new BigUint64Array(INITIAL_STATES)
        );
    });

    it("Dynamic import multiple times should work", async () => {
        const gameplay = new GameplayCjsDynamic();
        const INITIAL_STATES = [1n, 2n];

        // import
        await gameplay.importGameplayWasm(
            path.join(
                __dirname,
                "wasm_images",
                "image1",
                "js",
                "commonjs",
                "gameplay.js"
            )
        );

        await gameplay.newGame(INITIAL_STATES);

        assert.deepEqual(
            gameplay.getGameState(),
            new BigUint64Array(INITIAL_STATES)
        );

        await gameplay.importGameplayWasm(
            path.join(
                __dirname,
                "wasm_images",
                "image2",
                "js",
                "commonjs",
                "gameplay.js"
            )
        );
        await gameplay.newGame(INITIAL_STATES);

        assert.deepEqual(
            gameplay.getGameState(),
            new BigUint64Array(INITIAL_STATES)
        );
    });

    it("Dynamic import cleanup memory", async () => {
        const gameplay = new GameplayCjsDynamic();
        const INITIAL_STATES = [1n, 2n];

        printMemoryUsage();

        const STRESS_TEST_COUNT = 50000;
        const STRESS_TEST_STEP_COUNT = 100;

        for (let i = 0; i < STRESS_TEST_COUNT; i++) {
            await gameplay.importGameplayWasm(
                path.join(
                    __dirname,
                    "wasm_images",
                    "image1",
                    "js",
                    "commonjs",
                    "gameplay.js"
                )
            );

            await gameplay.newGame(INITIAL_STATES);

            assert.deepEqual(
                gameplay.getGameState(),
                new BigUint64Array(INITIAL_STATES)
            );

            for (let j = 0; j < STRESS_TEST_STEP_COUNT; j++) {
                gameplay.step(0n);
            }
        }

        printMemoryUsage();
    });
});
