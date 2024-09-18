export * from "./interface";

export * from "./util";

export * from "./zkwasm";

export * from "./gameplay_simulator";

export * from "./spin_game/prover_dummy";

export * from "./spin_game/prover_zk";

export * from "./spin_game/prover_opzk";

export * from "./spin_game/spin_game";

import SpinOPZKGameContractABI from "./contracts/game_opzk/GameContract.sol/SpinOPZKGameContract.json";

import SpinZKGameContractABI from "./contracts/game_zk/GameContract.sol/SpinZKGameContract.json";

import StakingContractABI from "./contracts/game_opzk/StakingContract.sol/StakingContract.json";

import GameStateStorageABI from "./contracts/shared/GameStateStorage.sol/GameStateStorage.json";

import MultiSenderABI from "./contracts/shared/MultiSender.sol/MultiSender.json";

export {
    SpinOPZKGameContractABI,
    SpinZKGameContractABI,
    StakingContractABI,
    GameStateStorageABI,
    MultiSenderABI,
};
