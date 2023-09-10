<template>
  <div class="text-center">
    <h1 class="py-3 text-3xl font-bold underline">Pokeguess</h1>
  </div>
  <div class="py-3">
    <Multiselect
      v-model="selectedOptions.pokemon"
      :options="options.pokemon"
      :searchable="true"
      placeholder="Pokemon"
      @change="pokemonSelected"
      valueProp="name"
      trackBy="name"
      label="name"
    />
  </div>
  <div class="py-3">
    <Multiselect
      v-model="selectedOptions.move"
      :options="options.moves"
      :searchable="true"
      placeholder="Moves"
      @change="moveSelected"
      valueProp="name"
      trackBy="name"
      label="name"
    />
  </div>
  <div class="py-3 text-center">
    <button
      type="button"
      @click="evaluateExpression"
      class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
    >
      Evaluate Expression
    </button>
  </div>
</template>
<script setup lang="ts">
import Multiselect from "@vueform/multiselect";
import { MainClient, Pokemon, Move } from "pokenode-ts";
import { getRandomInt } from "../utils/helpers";
import { PokemonPreview, MovePreview } from "../utils/types";
import {
  TKExpression,
  TObjectPokemon,
  TEqualPokemon,
  TObjectMove,
  TLearnMove,
  getDefaultExpression,
} from "../utils/expression";

const api = new MainClient();

const POKE_LIMIT = 1010;
const MOVE_LIMIT = 918;

const solutionPoke = ref<Pokemon>();
const options = ref<{ pokemon: PokemonPreview[]; moves: MovePreview[] }>({
  pokemon: [],
  moves: [],
});
const selectedOptions = ref<{
  pokemon: PokemonPreview | undefined;
  move: Move | undefined;
}>({
  pokemon: undefined,
  move: undefined,
});
const currentExpression = ref<TKExpression<any, any>>();

const getRandomPokemon = async (optionsPoke: PokemonPreview[]): Promise<Pokemon> => {
  const pokemon = await api.pokemon.getPokemonByName(
    optionsPoke[getRandomInt(optionsPoke.length)].name
  );
  solutionPoke.value = pokemon;
  return pokemon;
};

//#region OPTIONS

const getOptionsPokemon = async (): Promise<PokemonPreview[]> => {
  const pokemonOptions = await api.pokemon.listPokemonSpecies(0, POKE_LIMIT);
  options.value.pokemon.splice(0) &&
    options.value.pokemon.push(...pokemonOptions.results);
  return pokemonOptions.results;
};

const getOptionsMoves = async (): Promise<MovePreview[]> => {
  const moveOptions = await api.move.listMoves(0, MOVE_LIMIT);
  options.value.moves.splice(0) && options.value.moves.push(...moveOptions.results);
  return moveOptions.results;
};

//#endregion

//#region SELECT

const pokemonSelected = async (
  pokemonName: string
): Promise<TKExpression<Pokemon, Pokemon>> => {
  if (!pokemonName || !pokemonName.length) {
    const exp: TKExpression<Pokemon, Pokemon> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }
  const selectedPokemon = await api.pokemon.getPokemonByName(pokemonName);
  if (!selectedPokemon || !solutionPoke.value) {
    throw new Error("Selected Pokemon Invalid");
  }
  const o1: TObjectPokemon = new TObjectPokemon(selectedPokemon);
  const o2: TObjectPokemon = new TObjectPokemon(solutionPoke.value);
  const predicate: TEqualPokemon = new TEqualPokemon();
  const exp: TKExpression<Pokemon, Pokemon> = new TKExpression<Pokemon, Pokemon>(
    o1,
    predicate,
    o2
  );
  currentExpression.value = exp;
  return exp;
};

const moveSelected = async (moveName: string): Promise<TKExpression<Move, Pokemon>> => {
  if (!moveName || !moveName.length) {
    const exp: TKExpression<Move, Pokemon> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }
  const selectedMove = await api.move.getMoveByName(moveName);
  if (!selectedMove || !solutionPoke.value) {
    throw new Error("Selected Move Invalid");
  }
  const o1: TObjectMove = new TObjectMove(selectedMove);
  const o2: TObjectPokemon = new TObjectPokemon(solutionPoke.value);
  const predicate: TLearnMove = new TLearnMove();
  const exp: TKExpression<Move, Pokemon> = new TKExpression<Move, Pokemon>(
    o1,
    predicate,
    o2
  );
  currentExpression.value = exp;
  return exp;
};

//#endregion

const evaluateExpression = (): Boolean => {
  if (!currentExpression.value) {
    throw new Error("Expression is not yet ready");
  }
  const result = currentExpression.value.evaluate();
  console.log(result);
  return result;
};
onMounted(async () => {
  await getOptionsPokemon();
  await getOptionsMoves();
  await getRandomPokemon(options.value.pokemon);
  console.log(solutionPoke.value);
});
</script>
