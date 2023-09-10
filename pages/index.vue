<template>
  <div class="text-center">
    <h1 class="py-3 text-3xl font-bold underline">Pokeguess</h1>
  </div>
  <div class="flex justify-center py-5">
    <div class="col-3 guesses">
      <div
        v-for="g in guesses"
        class="text-sm px-3"
        :style="'color: ' + (g.answer ? 'green' : 'red')"
      >
        {{ g.question }}
      </div>
    </div>
    <div class="col-3 text-center">
      <img
        :src="isSolved ? solutionPoke?.sprites.front_default?.toString() : pokeballUrl"
        class="inline"
        alt="ball"
        width="150"
        height="150"
      />
    </div>
    <div class="col-3"></div>
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
      v-model="selectedOptions.gen"
      :options="options.gens"
      :searchable="true"
      placeholder="Generations"
      @change="genSelected"
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
  <div class="flex py-3">
    <Multiselect
      v-model="selectedOptions.typesAmount"
      :options="options.typesAmount"
      :searchable="true"
      placeholder="Types Amount"
      style="width: 400px"
      @change="typesAmountSelected"
      valueProp="name"
      trackBy="name"
      label="name"
    />
    <Multiselect
      v-model="selectedOptions.types"
      :options="options.types"
      :searchable="true"
      mode="tags"
      :max="2"
      placeholder="Types"
      style="width: 400px"
      @change="typesSelected"
      valueProp="name"
      trackBy="name"
      label="name"
    />
  </div>
  <div class="py-3 text-center">
    <button
      type="button"
      @click="guess"
      class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
    >
      Guess
    </button>
    <button
      type="button"
      @click="reset"
      class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
    >
      Reset
    </button>
  </div>
</template>
<script setup lang="ts">
import Multiselect from "@vueform/multiselect";
import {
  MainClient,
  Pokemon,
  PokemonSpecies,
  Generation,
  Move,
  Type,
  Item,
} from "pokenode-ts";
import { getRandomInt } from "../utils/helpers";
import { Preview, Guess } from "../utils/types";
import {
  TKExpression,
  TObjectPokemon,
  TEqualPokemon,
  TObjectGeneration,
  TFromGeneration,
  TObjectSpecies,
  TObjectMove,
  TLearnMove,
  TObjectTypes,
  TEqualTypes,
  TObjectTypesAmounnt,
  TEqualTypesAmount,
  getDefaultExpression,
} from "../utils/expression";

const api = new MainClient();

const POKE_LIMIT = 1010;
const MOVE_LIMIT = 918;

const pokeballUrl = ref<string>();
const solutionPoke = ref<Pokemon>();
const isSolved = ref<boolean>(false);
const guesses = reactive<Guess[]>([]);

const options = ref<{
  pokemon: Preview[];
  moves: Preview[];
  types: Preview[];
  typesAmount: number[];
  gens: Preview[];
}>({
  pokemon: [],
  moves: [],
  types: [],
  typesAmount: [1, 2],
  gens: [],
});
const selectedOptions = ref<{
  pokemon: string;
  move: string;
  types: string[];
  typesAmount: number;
  gen: string;
}>({
  pokemon: "",
  move: "",
  types: [],
  typesAmount: 0,
  gen: "",
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
  const typeOptions = await api.pokemon.listTypes(0);
  options.value.types.splice(0) && options.value.types.push(...typeOptions.results);
  return typeOptions.results;
};

const getGenOptions = async (): Promise<Preview[]> => {
  const genOptions = await api.game.listGenerations(0);
  options.value.gens.splice(0) && options.value.gens.push(...genOptions.results);
  return genOptions.results;
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
    o2,
    true
  );
  currentExpression.value = exp;
  return exp;
};

const genSelected = async (
  genName: string
): Promise<TKExpression<Generation, PokemonSpecies>> => {
  if (!genName || !genName.length) {
    const exp: TKExpression<Generation, PokemonSpecies> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }
  const selectedGen = await api.game.getGenerationByName(genName);
  if (!selectedGen || !solutionPoke.value) {
    throw new Error("Selected Generation is Invalid");
  }
  const selectedSpecies: PokemonSpecies = await api.pokemon.getPokemonSpeciesByName(
    solutionPoke.value.name
  );
  const o1: TObjectGeneration = new TObjectGeneration(selectedGen);
  const o2: TObjectSpecies = new TObjectSpecies(selectedSpecies);
  const predicate: TFromGeneration = new TFromGeneration();
  const exp: TKExpression<Generation, PokemonSpecies> = new TKExpression<
    Generation,
    PokemonSpecies
  >(o1, predicate, o2);
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

const typesAmountSelected = async (
  typesAmount: number
): Promise<TKExpression<number, Pokemon>> => {
  if (typesAmount < 1 || typesAmount > 2) {
    const exp: TKExpression<number, Pokemon> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }

  if (!solutionPoke.value) {
    throw new Error("Selected Type Invalid");
  }
  const o1: TObjectTypesAmounnt = new TObjectTypesAmounnt(typesAmount);
  const o2: TObjectPokemon = new TObjectPokemon(solutionPoke.value);
  const predicate: TEqualTypesAmount = new TEqualTypesAmount();
  const exp: TKExpression<number, Pokemon> = new TKExpression<number, Pokemon>(
    o1,
    predicate,
    o2
  );
  currentExpression.value = exp;
  return exp;
};

//#endregion

const getPokeballUrl = async (): Promise<string> => {
  const pokeball: Item = await api.item.getItemByName("poke-ball");
  console.log(pokeball);
  pokeballUrl.value = pokeball.sprites.default;
  return pokeball.sprites.default;
};

const reset = async (): Promise<void> => {
  await getRandomPokemon(options.value.pokemon);
  const exp: TKExpression<null, null> = getDefaultExpression();
  currentExpression.value = exp;
  guesses.splice(0);
  isSolved.value = false;
};

const guess = (): Boolean => {
  if (!currentExpression.value) {
    throw new Error("Expression is not yet ready");
  }
  const result = currentExpression.value.evaluate();
  guesses.push({
    question: currentExpression.value.toString(),
    answer: currentExpression.value.getResult(),
  });
  if (currentExpression.value.getIsPokemonGuess() && result) {
    isSolved.value = true;
  }
  return result;
};
onMounted(async () => {
  await getPokemonOptions();
  await getGenOptions();
  await getMoveOptions();
  await getTypeOptions();
  await getPokeballUrl();
  await getRandomPokemon(options.value.pokemon);
  console.log(solutionPoke.value);
});
</script>
<style>
.col-3 {
  flex-grow: 1;
  width: 33%;
}

.guesses {
  height: 150px;
  overflow-y: auto;
}
</style>
