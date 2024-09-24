import {
    SpinGameRegistryContractABI,
    SpinOPZKGameContractABI,
    decodeBytesToU64Array,
} from ".";

async function getOnchainStatesWagmi(
    playerAddress: string,
    gameContractAddress: string,
    gameId: bigint,
    stateSize: number,
    wagmiReadContractFunction: any,
    wagmiConfig: any
) {
    const registryContractAddress = (await wagmiReadContractFunction(
        wagmiConfig,
        {
            abi: SpinOPZKGameContractABI.abi,
            address: gameContractAddress,
            functionName: "getRegistryContract",
            args: [],
        }
    )) as `0x${string}`;

    const result = (await wagmiReadContractFunction(wagmiConfig, {
        abi: SpinGameRegistryContractABI.abi,
        address: registryContractAddress,
        functionName: "getStates",
        args: [gameId, playerAddress],
    })) as string;

    const decoded = decodeBytesToU64Array(result, stateSize);

    return decoded;
}

export { getOnchainStatesWagmi };
