<template>
  <div class="text-center">
    <h1 class="py-3 text-3xl font-bold underline">Pokeguess</h1>
  </div>
  <div class="flex justify-center">
    <div class="col-3">
      <span class="flex justify-center mb-2 font-semibold"
        >Guesses: {{ guesses.length }}</span
      >
      <ul
        id="guesses"
        class="list-disc h-[150px] overflow-auto bg-gray-50 py-3 px-5 rounded-lg border border-gray-200 shadow-lg"
      >
        <li v-for="g in guesses" class="text-sm mb-1">
          {{ g.question }}
          <b :class="g.answer ? 'text-green-500' : 'text-red-500'">{{
            g.answer ? "Yes" : "No"
          }}</b>
        </li>
      </ul>
    </div>
    <div class="col-3 text-center">
      <img
        :src="isSolved ? solutionPoke?.sprites.front_default?.toString() : ballUrl"
        class="inline"
        alt="ball"
        width="150"
        height="150"
      />
    </div>
    <div class="col-3"></div>
  </div>
  <div class="py-3 text-center">
    <button
      type="button"
      @click="guess"
      :disabled="!currentExpression"
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
  <div class="py-3 border border-gray-200 bg-gray-50 rounded-lg shadow-lg">
    <div class="mb-4 border-b">
      <ul
        class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500"
        id="tabOptions"
        role="tablist"
      >
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="pokemon-tab"
            type="button"
            role="tab"
            aria-controls="pokemon"
            aria-selected="false"
          >
            Pokemon
          </button>
        </li>
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="gensgames-tab"
            type="button"
            role="tab"
            aria-controls="gensgames"
            aria-selected="false"
          >
            Gens and Games
          </button>
        </li>
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="evolutions-tab"
            type="button"
            role="tab"
            aria-controls="evolutions"
            aria-selected="false"
          >
            Evolutions
          </button>
        </li>
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="types-tab"
            type="button"
            role="tab"
            aria-controls="types"
            aria-selected="false"
          >
            Types
          </button>
        </li>
        <li class="mr-2" role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="moves-tab"
            type="button"
            role="tab"
            aria-controls="moves"
            aria-selected="false"
          >
            Moves
          </button>
        </li>
        <li role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="stats-tab"
            type="button"
            role="tab"
            aria-controls="stats"
            aria-selected="false"
          >
            Stats
          </button>
        </li>
        <li role="presentation">
          <button
            class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
            id="others-tab"
            type="button"
            role="tab"
            aria-controls="others"
            aria-selected="false"
          >
            Others
          </button>
        </li>
      </ul>
    </div>
    <div id="tabContent">
      <div
        class="hidden p-4"
        id="pokemon"
        role="tabpanel"
        aria-labelledby="gensgames-tab"
      >
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
      </div>
      <div
        class="hidden p-4"
        id="gensgames"
        role="tabpanel"
        aria-labelledby="gensgames-tab"
      >
        <div class="flex py-3">
          <Multiselect
            v-model="selectedOptions.gen.pred"
            :options="options.predicates.time"
            :searchable="true"
            placeholder="Predicates"
            @change="genSelected({ genName: selectedOptions.gen.value, pred: $event as any as TimeRelated })"
            valueProp="name"
            trackBy="name"
            label="name"
          />
          <Multiselect
            v-model="selectedOptions.gen.value"
            :options="options.gens"
            :searchable="true"
            placeholder="Generations"
            @change="genSelected({ genName: $event as any as string, pred: selectedOptions.gen.pred })"
            valueProp="name"
            trackBy="name"
            label="name"
          />
        </div>
      </div>
      <div
        class="hidden p-4"
        id="evolutions"
        role="tabpanel"
        aria-labelledby="evolutions-tab"
      >
        <div class="flex py-3">
          <Multiselect
            v-model="selectedOptions.evolutions.trigger"
            :options="options.evolutions.triggers"
            :searchable="true"
            placeholder="Triggers"
            @change="evolutionTriggerSelected($event as any as string)"
            valueProp="name"
            trackBy="name"
            label="name"
          />
        </div>
      </div>
      <div class="hidden p-4" id="types" role="tabpanel" aria-labelledby="types-tab">
        <div class="flex py-3">
          <Multiselect
            v-model="selectedOptions.typesNumber"
            :options="options.typesNumber"
            :searchable="true"
            placeholder="Types Number"
            style="width: 400px"
            @change="typesNumberSelected"
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
      </div>
      <div class="hidden p-4" id="moves" role="tabpanel" aria-labelledby="moves-tab">
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
      </div>
      <div class="hidden p-4" id="stats" role="tabpanel" aria-labelledby="stats-tab">
        <div class="py-3 flex">
          <Multiselect
            v-model="selectedOptions.stat.name"
            :options="options.stats"
            :searchable="true"
            placeholder="Stats"
            @change="statSelected({ statName: $event as any as string, pred: selectedOptions.stat.pred, value: selectedOptions.stat.value})"
            valueProp="name"
            trackBy="name"
            label="name"
          />
          <Multiselect
            v-model="selectedOptions.stat.pred"
            :options="options.predicates.math"
            placeholder="Predicates"
            @change="statSelected({ statName: selectedOptions.stat.name, pred: $event as any as MathSymbols, value: selectedOptions.stat.value})"
            valueProp="name"
            trackBy="name"
            label="name"
          />
          <div class="relative flex items-center w-[300px] mx-auto">
            <input
              type="number"
              id="stat-input"
              v-model="selectedOptions.stat.value"
              min="0"
              :max="maxStatValue"
              @keyup="
                () => {
                  if (selectedOptions.stat.value < 0) {
                    selectedOptions.stat.value = 0;
                  } else if (selectedOptions.stat.value > maxStatValue) {
                    selectedOptions.stat.value = maxStatValue;
                  }
                }
              "
              @change="
                statSelected({
                  statName: selectedOptions.stat.name,
                  pred: selectedOptions.stat.pred,
                  value: selectedOptions.stat.value,
                })
              "
              aria-describedby="helper-text-explanation"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </div>
      </div>
      <div
        class="hidden p-4"
        id="others"
        role="tabpanel"
        aria-labelledby="others-tab"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Multiselect from "@vueform/multiselect";
import {
  MainClient,
  Pokemon,
  PokemonSpecies,
  EvolutionTrigger,
  Generation,
  Move,
  Type,
  Item,
  Stat,
} from "pokenode-ts";
import { getRandomInt } from "../utils/helpers";
import { Preview, Guess } from "../utils/types";
import {
  TKExpression,
  TObjectPokemon,
  TEqualPokemon,
  TObjectGeneration,
  TObjectEvolutionTrigger,
  TIsEvolutionTrigger,
  TFromGeneration,
  TFromOrBeforeGeneration,
  TFromOrAfterGeneration,
  TObjectSpecies,
  TObjectMove,
  TLearnMove,
  TObjectTypes,
  TEqualTypes,
  TObjectTypesAmounnt,
  TEqualTypesNumber,
  TObjectStat,
  TStatE,
  TStatGE,
  TStatLE,
  getDefaultExpression,
} from "../utils/expression";

import { Tabs } from "flowbite";
import type { TabsOptions, TabsInterface, TabItem } from "flowbite";

const api = new MainClient();

const POKE_LIMIT = 1010;
const MOVE_LIMIT = 918;

const ballNames: string[] = ["poke", "great", "ultra", "timer", "master"];
const ballChangeStep: number = 5;

const ballUrl = ref<string>();
const solutionPoke = ref<Pokemon>();
const isSolved = ref<boolean>(false);
const guesses = reactive<Guess[]>([]);

enum MathSymbols {
  Equal = "=",
  Greater = ">=",
  Lesser = "<=",
}

enum TimeRelated {
  Is = "Is from",
  Before = "Is from or before",
  After = "Is from or after",
}

const options = ref<{
  pokemon: Preview[];
  moves: Preview[];
  stats: Preview[];
  types: Preview[];
  typesNumber: number[];
  gens: Preview[];
  evolutions: {
    triggers: Preview[];
  };
  predicates: {
    time: TimeRelated[];
    math: MathSymbols[];
  };
}>({
  pokemon: [],
  moves: [],
  stats: [],
  types: [],
  typesNumber: [1, 2],
  gens: [],
  evolutions: {
    triggers: [],
  },
  predicates: {
    time: [TimeRelated.Is, TimeRelated.Before, TimeRelated.After],
    math: [MathSymbols.Equal, MathSymbols.Lesser, MathSymbols.Greater],
  },
});
const selectedOptions = ref<{
  pokemon: string;
  move: string;
  stat: {
    name: string;
    value: number;
    pred: MathSymbols;
  };
  types: string[];
  typesNumber: number;
  gen: { value: string; pred: TimeRelated };
  evolutions: {
    trigger: string;
  };
}>({
  pokemon: "",
  move: "",
  stat: {
    name: "",
    value: 0,
    pred: MathSymbols.Equal,
  },
  types: [],
  typesNumber: 0,
  gen: { value: "", pred: TimeRelated.Is },
  evolutions: {
    trigger: "",
  },
});

const maxStatValue = computed(() => {
  return selectedOptions.value.stat.name == "total" ? 1530 : 255;
});

const currentExpression = ref<TKExpression<any, any> | null>();

watch(guesses, async (new_value) => {
  if (new_value.length < ballChangeStep * ballNames.length) {
    if (new_value.length % ballChangeStep == 0) {
      const newBallName = ballNames[new_value.length / ballChangeStep];
      ballUrl.value = await getBallUrl(newBallName);
    }
  }
  return ballUrl.value;
});

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
      id: "evolutions",
      triggerEl: document.querySelector("#evolutions-tab")!,
      targetEl: document.querySelector("#evolutions")!,
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
      id: "stats",
      triggerEl: document.querySelector("#stats-tab")!,
      targetEl: document.querySelector("#stats")!,
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

const getEvolutionTriggerOptions = async (): Promise<Preview[]> => {
  const evolutionsTriggerOptions = await api.evolution.listEvolutionTriggers(0);
  options.value.evolutions.triggers.splice(0) &&
    options.value.evolutions.triggers.push(...evolutionsTriggerOptions.results);
  return evolutionsTriggerOptions.results;
};

const getStatOptions = async (): Promise<Preview[]> => {
  const statOptions = await api.pokemon.listStats(0, 6);
  options.value.stats.splice(0) &&
    options.value.stats.push({ name: "total", url: "" }) &&
    options.value.stats.push(...statOptions.results);

  return statOptions.results;
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

const genSelected = async (params: {
  genName: string;
  pred: TimeRelated;
}): Promise<TKExpression<Generation, PokemonSpecies>> => {
  if (!params.genName?.length || !params.pred?.length) {
    const exp: TKExpression<Generation, PokemonSpecies> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }
  const selectedGen = await api.game.getGenerationByName(params.genName);
  if (!selectedGen || !solutionPoke.value) {
    throw new Error("Selected Generation is Invalid");
  }
  const solSpecies: PokemonSpecies = await api.pokemon.getPokemonSpeciesByName(
    solutionPoke.value.name
  );

  const o1: TObjectGeneration = new TObjectGeneration(selectedGen);
  const o2: TObjectSpecies = new TObjectSpecies(solSpecies);
  let predicate = null;
  switch (params.pred) {
    case TimeRelated.After:
      predicate = new TFromOrAfterGeneration();
      break;
    case TimeRelated.Before:
      predicate = new TFromOrBeforeGeneration();
      break;
    default:
      predicate = new TFromGeneration();
      break;
  }
  const exp: TKExpression<Generation, PokemonSpecies> = new TKExpression<
    Generation,
    PokemonSpecies
  >(o1, predicate, o2);
  currentExpression.value = exp;
  return exp;
};

const evolutionTriggerSelected = async (
  trigger: string
): Promise<TKExpression<EvolutionTrigger, Pokemon>> => {
  if (!trigger || !trigger.length) {
    const exp: TKExpression<EvolutionTrigger, Pokemon> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }
  const selectedTrigger = await api.evolution.getEvolutionTriggerByName(trigger);
  if (!selectedTrigger || !solutionPoke.value) {
    throw new Error("Selected Evolution Trigger Invalid");
  }
  const o1: TObjectEvolutionTrigger = new TObjectEvolutionTrigger(selectedTrigger);
  const o2: TObjectPokemon = new TObjectPokemon(solutionPoke.value);
  const predicate: TIsEvolutionTrigger = new TIsEvolutionTrigger();
  const exp: TKExpression<EvolutionTrigger, Pokemon> = new TKExpression<
    EvolutionTrigger,
    Pokemon
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

const typesNumberSelected = async (
  typesNumber: number
): Promise<TKExpression<number, Pokemon>> => {
  if (typesNumber < 1 || typesNumber > 2) {
    const exp: TKExpression<number, Pokemon> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }

  if (!solutionPoke.value) {
    throw new Error("Selected Type Invalid");
  }
  const o1: TObjectTypesAmounnt = new TObjectTypesAmounnt(typesNumber);
  const o2: TObjectPokemon = new TObjectPokemon(solutionPoke.value);
  const predicate: TEqualTypesNumber = new TEqualTypesNumber();
  const exp: TKExpression<number, Pokemon> = new TKExpression<number, Pokemon>(
    o1,
    predicate,
    o2
  );
  currentExpression.value = exp;
  return exp;
};

const statSelected = async (params: {
  statName: string;
  pred: MathSymbols;
  value: number;
}): Promise<TKExpression<Stat | { name: string }, Pokemon>> => {
  if (!params.statName?.length || !params.pred?.length || params.value < 0) {
    const exp: TKExpression<Stat, Pokemon> = getDefaultExpression();
    currentExpression.value = exp;
    return exp;
  }

  if (!solutionPoke.value) {
    throw new Error("Solution poke does not exist");
  }

  let o1 = null;
  if (params.statName == "total") {
    o1 = new TObjectStat({ name: "total" });
  } else {
    const selectedStat = await api.pokemon.getStatByName(params.statName);
    if (!selectedStat) {
      throw new Error("Selected Stat is Invalid");
    }
    o1 = new TObjectStat(selectedStat);
  }

  const o2: TObjectPokemon = new TObjectPokemon(solutionPoke.value);

  let predicate = null;
  switch (params.pred) {
    case MathSymbols.Lesser:
      predicate = new TStatLE(params.value);
      break;
    case MathSymbols.Greater:
      predicate = new TStatGE(params.value);
      break;
    default:
      predicate = new TStatE(params.value);
      break;
  }
  const exp: TKExpression<Stat | { name: string }, Pokemon> = new TKExpression<
    Stat | { name: string },
    Pokemon
  >(o1, predicate, o2);
  currentExpression.value = exp;
  return exp;
};

//#endregion

const getBallUrl = async (name: string = "poke"): Promise<string> => {
  const pokeball: Item = await api.item.getItemByName(`${name}-ball`);
  ballUrl.value = pokeball.sprites.default;
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
  guesses.unshift({
    question: currentExpression.value.toString(),
    answer: currentExpression.value.getResult(),
  });
  nextTick(() => {
    var elem = document.getElementById("guesses");
    if (elem) {
      elem.scrollTop = 0;
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
  await getEvolutionTriggerOptions();
  await getStatOptions();
  await getBallUrl();
  await getRandomPokemon(options.value.pokemon);
  console.log(solutionPoke.value);
});
</script>
<style>
.col-3 {
  flex-grow: 1;
  width: 33%;
}

.multiselect {
  max-width: 300px;
}
</style>
