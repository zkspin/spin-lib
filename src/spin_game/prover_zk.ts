import { SpinGameProverAbstract } from "../interface";
import { computeHashInU64Array, encodeU64ArrayToBytes } from "../util";
import { ZKProver } from "../zkwasm";
import {
    SubmissionMetaData,
    convertPlayerActionToPublicPrivateInputs,
} from "./spin_game";

export interface SpinZKProverSubmissionData {
    game_id: bigint;
    finalState: string;
    playerInputsHash: bigint[];
    proof: bigint[];
    verify_instance: bigint[];
    aux: bigint[];
    instances: bigint[];
}

export interface SpinZKProverInput {
    initialState: bigint[];
    playerActions: bigint[];
    metaData: SubmissionMetaData;
}

export class SpinZKProver extends SpinGameProverAbstract<
    SpinZKProverInput,
    SpinZKProverSubmissionData
> {
    zkProver: ZKProver;

    constructor(zkProver: ZKProver) {
        super();
        this.zkProver = zkProver;
    }

    async generateSubmission(
        submissionInput: SpinZKProverInput
    ): Promise<SpinZKProverSubmissionData> {
        const proof = await this.generateProof(
            submissionInput.initialState,
            submissionInput.playerActions,
            submissionInput.metaData
        );

        if (!proof) {
            throw new Error("Failed to generate proof");
        }

        return {
            game_id: submissionInput.metaData.game_id,
            finalState: encodeU64ArrayToBytes(submissionInput.initialState),
            playerInputsHash: computeHashInU64Array(
                submissionInput.playerActions
            ),
            proof: proof.proof,
            verify_instance: proof.verify_instance,
            aux: proof.aux,
            instances: proof.instances,
        };
    }

    // ================================================================================================

    async _generateProof(
        initialState: bigint[],
        playerActions: bigint[],
        metaData: SubmissionMetaData
    ) {
        const { publicInputs, privateInputs } =
            convertPlayerActionToPublicPrivateInputs(
                initialState,
                playerActions,
                metaData
            );

        console.log("initialState = ", initialState);
        console.log("playerActions = ", playerActions);
        console.log("metaData = ", metaData);
        console.log("publicInputs = ", publicInputs);
        console.log("privateInputs = ", privateInputs);

        const proof = await this.zkProver.prove(
            publicInputs.map((i: bigint) => `${i}:i64`),
            [...privateInputs.map((m: bigint) => `${m}:i64`)]
        );

        return proof;
    }

    async generateProof(
        initialState: bigint[],
        playerActions: bigint[],
        metaData: SubmissionMetaData,
        debug: boolean = false
    ) {
        if (!debug) {
            return await this._generateProof(
                initialState,
                playerActions,
                metaData
            );
        } else {
            // TODO ProofCacheAbstract
        }
    }
}
