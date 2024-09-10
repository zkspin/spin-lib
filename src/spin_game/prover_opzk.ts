import {
    SegmentData,
    SpinGameProverAbstract,
    SubmissionData,
} from "../interface";

import { computeOPZKSubmissionHash } from "../util";

export interface SpinOPZKProverOutput {
    data: SubmissionData;
}

export interface SpinOPZKCredential {
    operator_url: string;
}

export interface SpinOPZKProverInput {
    game_id: bigint;
    segments: SegmentData[];
}

export class SpinOPZKProver extends SpinGameProverAbstract<
    SpinOPZKProverInput,
    SpinOPZKProverOutput
> {
    credential: SpinOPZKCredential;

    getSubmissionNonce: () => Promise<bigint>;
    getPlayerSignature: (submissionHash: string) => Promise<{
        player_address: string;
        player_signature: string;
    }>;

    constructor(
        credential: SpinOPZKCredential,
        getSubmissionNonce: () => Promise<bigint>,
        getPlayerSignature: (submissionHash: string) => Promise<{
            player_address: string;
            player_signature: string;
        }>
    ) {
        super();
        this.credential = credential;
        this.getSubmissionNonce = getSubmissionNonce;
        this.getPlayerSignature = getPlayerSignature;
    }

    async generateSubmission(
        submissionInput: SpinOPZKProverInput
    ): Promise<SpinOPZKProverOutput> {
        const submissionNonce = await this.getSubmissionNonce();

        const submissionHash = computeOPZKSubmissionHash({
            game_id: submissionInput.game_id,
            submission_nonce: submissionNonce,
            segments: submissionInput.segments,
        });
        const { player_address, player_signature } =
            await this.getPlayerSignature(submissionHash);

        return {
            data: {
                game_id: submissionInput.game_id,
                segments: submissionInput.segments,
                submission_nonce: submissionNonce,
                submission_hash: submissionHash,
                player_address,
                player_signature,
            },
        };
    }
}
