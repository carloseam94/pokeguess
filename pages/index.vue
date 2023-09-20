<template>
  <div class="text-center">
    <h1 class="py-3 text-3xl font-bold underline">Pokeguess</h1>
  </div>
  <div class="flex justify-center">
    <div id="guesses" class="col-3 guesses">
      <div v-for="g in guesses" class="text-sm px-3" :style="'color: ' + (g.answer ? 'green' : 'red')">
        {{ g.question }}
      </div>
    </div>
    <div class="col-3 text-center">
      <img :src="isSolved ? solutionPoke?.sprites.front_default?.toString() : pokeballUrl" class="inline" alt="ball"
        width="150" height="150" />
    </div>
    <div class="col-3"></div>
  </div>
  <div class="py-3 text-center">
    <button type="button" @click="guess" :disabled="!currentExpression"
      class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
      Guess
    </button>
    <button type="button" @click="reset"
      class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
      Reset
    </button>
  </div>
  <div class="py-3">
    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400" id="tabOptions"
        role="tablist">
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="pokemon-tab" type="button" role="tab" aria-controls="pokemon" aria-selected="false">
            Pokemon
          </button>
        </li>
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="gensgames-tab" type="button" role="tab" aria-controls="gensgames" aria-selected="false">
            Gens and Games
          </button>
        </li>
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="types-tab" type="button" role="tab" aria-controls="types" aria-selected="false">
            Types
          </button>
        </li>
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="moves-tab" type="button" role="tab" aria-controls="moves" aria-selected="false">
            Moves
          </button>
        </li>
        <li role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="others-tab" type="button" role="tab" aria-controls="others" aria-selected="false">
            Others
          </button>
        </li>
      </ul>
    </div>
    <div id="tabContent">
      <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="pokemon" role="tabpanel"
        aria-labelledby="gensgames-tab">
        <div class="py-3">
          <Multiselect v-model="selectedOptions.pokemon" :options="options.pokemon" :searchable="true"
            placeholder="Pokemon" @change="pokemonSelected" valueProp="name" trackBy="name" label="name" />
        </div>
      </div>
      <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="gensgames" role="tabpanel"
        aria-labelledby="gensgames-tab">
        <div class="flex py-3">
          <Multiselect v-model="selectedOptions.gen.pred" :options="options.predicates" :searchable="true"
            placeholder="Predicates" @change="genPredSelected" valueProp="name" trackBy="name" label="name" />
          <Multiselect v-model="selectedOptions.gen.value" :options="options.gens" :searchable="true"
            placeholder="Generations" @change="genSelected" valueProp="name" trackBy="name" label="name" />
        </div>
      </div>
      <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="types" role="tabpanel"
        aria-labelledby="types-tab">
        <div class="flex py-3">
          <Multiselect v-model="selectedOptions.typesAmount" :options="options.typesAmount" :searchable="true"
            placeholder="Types Amount" style="width: 400px" @change="typesAmountSelected" valueProp="name" trackBy="name"
            label="name" />
          <Multiselect v-model="selectedOptions.types" :options="options.types" :searchable="true" mode="tags" :max="2"
            placeholder="Types" style="width: 400px" @change="typesSelected" valueProp="name" trackBy="name"
            label="name" />
        </div>
      </div>
      <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="moves" role="tabpanel"
        aria-labelledby="moves-tab">
        <div class="py-3">
          <Multiselect v-model="selectedOptions.move" :options="options.moves" :searchable="true" placeholder="Moves"
            @change="moveSelected" valueProp="name" trackBy="name" label="name" />
        </div>
      </div>
      <div class="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="others" role="tabpanel"
        aria-labelledby="others-tab"></div>
    </div>
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
  TFromGenerationE,
  TFromGenerationLE,
  TFromGenerationGE,
  TObjectSpecies,
  TObjectMove,
  TLearnMove,
  TObjectTypes,
  TEqualTypes,
  TObjectTypesAmounnt,
  TEqualTypesAmount,
  getDefaultExpression,
} from "../utils/expression";

import { Tabs } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";

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
  predicates: string[];
}>({
  pokemon: [],
  moves: [],
  types: [],
  typesAmount: [1, 2],
  gens: [],
  predicates: ["=", "<=", ">="],
});
const selectedOptions = ref<{
  pokemon: string;
  move: string;
  types: string[];
  typesAmount: number;
  gen: { value: string; pred: string };
}>({
  pokemon: "",
  move: "",
  types: [],
  typesAmount: 0,
  gen: { value: "", pred: "=" },
});
const currentExpression = ref<TKExpression<any, any> | null>();

const getRandomPokemon = async (optionsPoke: Preview[]): Promise<Pokemon> => {
  const pokemon = await api.pokemon.getPokemonByName(
    optionsPoke[getRandomInt(optionsPoke.length)].name
  );
  solutionPoke.value = pokemon;
  return pokemon;
};

//#region OPTIONS

const initializeTabs = async (): Promise<void> => {
  const tabElements: TabItem[] = [
    {
      id: "pokemon",
      triggerEl: document.querySelector("#pokemon-tab")!,
      targetEl: document.querySelector("#pokemon")!,
    },
    {
      id: "gensgames",
      triggerEl: document.querySelector("#gensgames-tab")!,
      targetEl: document.querySelector("#gensgames")!,
    },
    {
      id: "types",
      triggerEl: document.querySelector("#types-tab")!,
      targetEl: document.querySelector("#types")!,
    },
    {
      id: "moves",
      triggerEl: document.querySelector("#moves-tab")!,
      targetEl: document.querySelector("#moves")!,
    },
    {
      id: "others",
      triggerEl: document.querySelector("#others-tab")!,
      targetEl: document.querySelector("#others")!,
    },
  ];

  const tabOptions: TabsOptions = {
    defaultTabId: "pokemon",
    activeClasses:
      "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400 border-blue-600 dark:border-blue-500",
    inactiveClasses:
      "text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
    onShow: () => {
      // console.log("tab is shown");
    },
  };

  const tabs: TabsInterface = new Tabs(tabElements, tabOptions);
  tabs.show("pokemon");
};

const getPokemonOptions = async (): Promise<Preview[]> => {
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
): Promise<TKExpression<Generation, Generation>> => {
  if (!genName || !genName.length) {
    const exp: TKExpression<Generation, Generation> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }
  const selectedGen = await api.game.getGenerationByName(genName);
  if (!selectedGen || !solutionPoke.value) {
    throw new Error("Selected Generation is Invalid");
  }
  const solSpecies: PokemonSpecies = await api.pokemon.getPokemonSpeciesByName(
    solutionPoke.value.name
  );
  const solGeneration: Generation = await api.game.getGenerationByName(
    solSpecies.generation.name
  );
  const o1: TObjectGeneration = new TObjectGeneration(selectedGen);
  const o2: TObjectGeneration = new TObjectGeneration(solGeneration);
  let predicate = null;
  switch (selectedOptions.value.gen.pred) {
    case "<=":
      predicate = new TFromGenerationGE();
      break;
    case ">=":
      predicate = new TFromGenerationLE();
      break;
    default:
      predicate = new TFromGenerationE();
      break;
  }
  const exp: TKExpression<Generation, Generation> = new TKExpression<
    Generation,
    Generation
  >(o1, predicate, o2);
  console.log(exp);
  currentExpression.value = exp;
  return exp;
};

const genPredSelected = async (
  pred: string
): Promise<TKExpression<Generation, Generation>> => {
  if (!pred || !pred.length) {
    const exp: TKExpression<Generation, Generation> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }

  let predicate = null;
  switch (pred) {
    case "<=":
      predicate = new TFromGenerationGE();
      break;
    case ">=":
      predicate = new TFromGenerationLE();
      break;
    default:
      predicate = new TFromGenerationE();
      break;
  }
  console.log(predicate);
  const exp = new TKExpression<Generation, Generation>(
    currentExpression.value?.getO1() as TObjectGeneration,
    predicate,
    currentExpression.value?.getO2() as TObjectGeneration
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
  nextTick(() => {
    var elem = document.getElementById("guesses");
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  });
  if (currentExpression.value.getIsPokemonGuess() && result) {
    isSolved.value = true;
  }
  currentExpression.value = null;
  return result;
};
onMounted(async () => {
  await initializeTabs();
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
  padding: 5px 10px;
  /* background-color: rgba(0, 0, 0, 0.05); */
}

.multiselect {
  max-width: 300px;
}
</style>
