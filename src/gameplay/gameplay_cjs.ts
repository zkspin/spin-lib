import { GameplayAbstract } from "../interface";

import {
    initialize_game,
    step as _step,
    get_game_state,
} from "../../tests/wasm_images/image1/js/commonjs/gameplay";

export class GameplayCjs extends GameplayAbstract {
    constructor() {
        super();
    }

    async newGame(args: bigint[]): Promise<void> {
        initialize_game(new BigUint64Array(args));
    }

    step(command: bigint) {
        _step(command);
    }

    getGameState(): BigUint64Array {
        return get_game_state();
    }

    resetGame(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
