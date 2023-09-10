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
  <div class="py-3">
    <Multiselect
      v-model="selectedOptions.types"
      :options="options.types"
      :searchable="true"
      mode="tags"
      :max="2"
      placeholder="Types"
      @change="typesSelected"
      valueProp="name"
      trackBy="name"
      label="name"
    />
  </div>
  <!-- <div class="py-3">
    <Multiselect
      v-model="selectedOptions.type2"
      :options="options.moves"
      :searchable="true"
      placeholder="Moves"
      @change="moveSelected"
      valueProp="name"
      trackBy="name"
      label="name"
    />
  </div> -->
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
import { MainClient, Pokemon, Move, Type } from "pokenode-ts";
import { getRandomInt } from "../utils/helpers";
import { Preview } from "../utils/types";
import {
  TKExpression,
  TObjectPokemon,
  TEqualPokemon,
  TObjectMove,
  TLearnMove,
  TObjectTypes,
  TEqualTypes,
  getDefaultExpression,
} from "../utils/expression";

const api = new MainClient();

const POKE_LIMIT = 1010;
const MOVE_LIMIT = 918;

const solutionPoke = ref<Pokemon>();
const options = ref<{ pokemon: Preview[]; moves: Preview[]; types: Preview[] }>({
  pokemon: [],
  moves: [],
  types: [],
});
const selectedOptions = ref<{
  pokemon: string;
  move: string;
  types: string[];
}>({
  pokemon: "",
  move: "",
  types: [],
});
const currentExpression = ref<TKExpression<any, any>>();

const getRandomPokemon = async (optionsPoke: Preview[]): Promise<Pokemon> => {
  const pokemon = await api.pokemon.getPokemonByName(
    optionsPoke[getRandomInt(optionsPoke.length)].name
  );
  solutionPoke.value = pokemon;
  return pokemon;
};

//#region OPTIONS

const getPokemonOptions = async (): Promise<P[]> => {
  const pokemonOptions = await api.pokemon.listPokemonSpecies(0, POKE_LIMIT);
  options.value.pokemon.splice(0) &&
    options.value.pokemon.push(...pokemonOptions.results);
  return pokemonOptions.results;
};

const getMoveOptions = async (): Promise<Preview[]> => {
  const moveOptions = await api.move.listMoves(0, MOVE_LIMIT);
  options.value.moves.splice(0) && options.value.moves.push(...moveOptions.results);
  return moveOptions.results;
};

const getTypeOptions = async (): Promise<Preview[]> => {
  const typesOptions = await api.pokemon.listTypes(0);
  options.value.types.splice(0) && options.value.types.push(...typesOptions.results);
  return typesOptions.results;
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

const typesSelected = async (
  typesName: string[]
): Promise<TKExpression<Type[], Pokemon>> => {
  console.log(typesName);
  if (!typesName || !typesName.length || typesName.length > 2) {
    const exp: TKExpression<Type[], Pokemon> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }
  let selectedTypes: Type[] = [];
  selectedTypes.push(await api.pokemon.getTypeByName(typesName[0]));
  if (typesName.length == 2) {
    selectedTypes.push(await api.pokemon.getTypeByName(typesName[1]));
  }
  if (!selectedTypes.length || !solutionPoke.value) {
    throw new Error("Selected Type Invalid");
  }
  const o1: TObjectTypes = new TObjectTypes(selectedTypes);
  const o2: TObjectPokemon = new TObjectPokemon(solutionPoke.value);
  const predicate: TEqualTypes = new TEqualTypes();
  const exp: TKExpression<Type[], Pokemon> = new TKExpression<Type[], Pokemon>(
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
  await getPokemonOptions();
  await getMoveOptions();
  await getTypeOptions();
  await getRandomPokemon(options.value.pokemon);
  console.log(solutionPoke.value);
});
</script>
