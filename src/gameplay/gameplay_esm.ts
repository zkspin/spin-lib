import { GameplayAbstract } from "../interface";

import {
    default as init,
    initialize_game,
    step as _step,
    get_game_state,
} from "../../tests/wasm_images/image1/js/esm/gameplay";

export class GameplayEsm extends GameplayAbstract {
    constructor() {
        super();
    }

    async newGame(args: bigint[]): Promise<void> {
        await init()
            .then(() => {
                console.log("Game logic initialized");
            })
            .catch((e: any) =>
                console.error("Error initializing game logic", e)
            );
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
