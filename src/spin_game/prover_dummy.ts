import { SpinGameProverAbstract } from "../interface";

export class SpinDummyProver extends SpinGameProverAbstract<any, any> {
    async generateSubmission(): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
