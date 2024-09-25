use provable_game_logic::spin::SpinGame;
use provable_game_logic::spin::SpinGameTrait;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn initialize_game(args: Vec<u64>) {
    SpinGame::initialize_game(args);
}

#[wasm_bindgen]
pub fn step(input: u64) {
    SpinGame::step(input);
}

#[wasm_bindgen]
pub fn get_game_state() -> Vec<u64> {
    SpinGame::get_game_state()
}