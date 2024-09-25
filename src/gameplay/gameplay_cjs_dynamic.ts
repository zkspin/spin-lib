import { GameplayAbstract } from "../interface";

export class UnimportedError extends Error {
    constructor() {
        super("Gameplay not imported yet. Run importGameplayWasm() first.");
    }
}

export class GameplayCjsDynamic extends GameplayAbstract {
    wasm_func_get_game_state: () => BigUint64Array;
    wasm_func_step: (command: bigint) => void;
    wasm_func_initialize_game: (args: BigUint64Array) => void;

    constructor() {
        super();

        this.wasm_func_get_game_state = () => {
            throw new UnimportedError();
        };
        this.wasm_func_step = () => {
            throw new UnimportedError();
        };
        this.wasm_func_initialize_game = () => {
            throw new UnimportedError();
        };
    }

    async newGame(args: bigint[]): Promise<void> {
        this.wasm_func_initialize_game(new BigUint64Array(args));
    }

    step(command: bigint): void {
        this.wasm_func_step(command);
    }

    getGameState(): BigUint64Array {
        return this.wasm_func_get_game_state();
    }

    resetGame(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async importGameplayWasm(gameplayPath: string) {
        const modules = await import(gameplayPath);

        this.wasm_func_get_game_state = modules.get_game_state;
        this.wasm_func_step = modules.step;
        this.wasm_func_initialize_game = modules.initialize_game;
    }

    /**
     * Cleanup the memory used by the gameplay and WASM imports
     * Check "Dynamic import cleanup memory" test
     * The more imported gameplay the more memory will be used
     */
    async cleanup() {
        throw new Error("Method not implemented.");
    }
}
