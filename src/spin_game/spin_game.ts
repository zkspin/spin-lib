import { GameplayAbstract, SpinGameProverAbstract } from "../interface";

import {
    EMPTY_STATE_HASH,
    computeSegmentHash,
    bytes32ToU64Array,
    computeHashInU64Array,
} from "../util";

export interface SubmissionMetaData {
    game_id: bigint;
}

export function convertPlayerActionToPublicPrivateInputs(
    initialStates: bigint[],
    playerActions: bigint[],
    metaData: SubmissionMetaData
): {
    publicInputs: bigint[];
    privateInputs: bigint[];
} {
    const onchain_meta_transaction_hash = computeSegmentHash({
        gameID: metaData.game_id,
        onChainGameStateHash: initialStates.every((x) => x === BigInt(0))
            ? bytes32ToU64Array(EMPTY_STATE_HASH) // no state stored on-chain, use empty state
            : computeHashInU64Array(initialStates),
        gameInputHash: computeHashInU64Array(playerActions),
    });

    const publicInputs = onchain_meta_transaction_hash;

    const privateInputs = [
        metaData.game_id,
        ...initialStates,
        BigInt(playerActions.length),
        ...playerActions,
    ];

    return { publicInputs, privateInputs };
}

export interface SpinConstructor<TInput, TOutput> {
    gameplay: GameplayAbstract;
    gameplayProver: SpinGameProverAbstract<TInput, TOutput>;
}

/* This Class is used to facilated core gameplay and zk proving*/
export class SpinGame<TInput, TOutput> {
    gamePlay: GameplayAbstract;
    gameplayProver: SpinGameProverAbstract<TInput, TOutput>;
    initialState: bigint[] = []; // public inputs
    playerInputs: bigint[] = []; // public inputs
    finalState: bigint[] = []; // private inputs

    /* Constructor */
    constructor({
        gameplay,
        gameplayProver,
    }: SpinConstructor<TInput, TOutput>) {
        this.gamePlay = gameplay;
        this.gameplayProver = gameplayProver;
    }

    step(command: bigint) {
        this.gamePlay.step(command);
        this.playerInputs.push(command);
    }

    getCurrentGameState() {
        return this.gamePlay.getGameState();
    }

    async newGame({ initialStates }: { initialStates: bigint[] }) {
        for (const arg of initialStates) {
            this.initialState.push(arg);
        }

        await this.gamePlay.newGame(initialStates);
    }

    async generateSubmission(submissionInput: TInput) {
        return await this.gameplayProver.generateSubmission(submissionInput);
    }

    /* Reset the game
     * Keeping the same onReady callback and cloud credentials
     */

    async resetGame() {
        this.initialState = [];
        this.playerInputs = [];
        this.finalState = [];

        await this.gamePlay.resetGame();
    }
}
