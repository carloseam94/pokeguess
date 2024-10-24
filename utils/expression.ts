import { Pokemon, Generation, Move, Type, PokemonSpecies, Stat, PokemonStat, EvolutionTrigger, NamedAPIResource, EvolutionChain, ChainLink } from "pokenode-ts";
import { SpeciesCategory } from "./types"
export class TKExpression<T, K> {
  constructor(
    private o1: TObject<T>,
    private predicate: TPredicate<T, K>,
    private o2: TObject<K>,
    private isPokemonGuess: boolean = false
  ) {
    this.o1 = o1;
    this.predicate = predicate;
    this.o2 = o2;
    this.result = false;
    this.isPokemonGuess = isPokemonGuess;
  }

  private result: boolean;

  evaluate(): boolean {
    const result = this.predicate.evaluate(this.o1, this.o2);
    this.result = result;
    return result;
  }

  public getResult(): boolean {
    return this.result;
  }

  public getIsPokemonGuess(): boolean {
    return this.isPokemonGuess;
  }

  public getO1(): TObject<T> {
    return this.o1;
  }

  public getO2(): TObject<K> {
    return this.o2;
  }

  public toString(): string {
    return this.predicate.toString(this.o1.value);
  }
}

//#region OBJECTS

export abstract class TObject<T> {
  constructor(public value: T) {
    this.value = value;
  }

  abstract toString(): string;
}

export class TObjectDefault extends TObject<any> {
  constructor() {
    super(null);
  }

  public toString(): string {
    return "Default";
  }
}

export class TObjectPokemon extends TObject<Pokemon> {
  constructor(pokemon: Pokemon) {
    super(pokemon);
  }

  public toString(): string {
    return this.value.name;
  }
}

export class TObjectSpeciesCategory extends TObject<SpeciesCategory> {
  constructor(category: SpeciesCategory) {
    super(category);
  }

  public toString(): string {
    return this.value;
  }
}

export class TObjectEvolutionChain extends TObject<EvolutionChain> {
  constructor(chain: EvolutionChain) {
    super(chain);
  }

  public toString(): string {
    return this.value.id.toString();
  }
};

export class TObjectEvolutionChainNumber extends TObject<number> {
  constructor(chain: number) {
    super(chain);
  }

  public toString(): string {
    return this.value.toString();
  }
}

export class TObjectEvolutionStage extends TObject<number> {
  constructor(stage: number) {
    super(stage);
  }

  public toString(): string {
    if (this.value == 0) {
      return "Unevolved";
    } else if (this.value == 1){
      return "First evolution";
    } else if (this.value == 2){
      return "Second evolution";
    } else {
      return "Other"
    }
  }
}

export class TObjectEvolutionTrigger extends TObject<EvolutionTrigger> {
  constructor(trigger: EvolutionTrigger) {
    super(trigger);
  }

  public toString(): string {
    return this.value.name;
  }
};

export class TObjectGeneration extends TObject<Generation> {
  constructor(generation: Generation) {
    super(generation);
  }

  public toString(): string {
    return this.value.name;
  }
}

export class TObjectSpecies extends TObject<PokemonSpecies> {
  constructor(species: PokemonSpecies) {
    super(species);
  }

  public toString(): string {
    return this.value.name;
  }
}

export class TObjectMove extends TObject<Move> {
  constructor(move: Move) {
    super(move);
  }

  public toString(): string {
    return this.value.name;
  }
}

export class TObjectTypes extends TObject<Type[]> {
  constructor(types: Type[]) {
    super(types);
  }

  public toString(): string {
    const nameType1 = this.value[0].name;
    return this.value.length == 1
      ? nameType1
      : nameType1 + " " + this.value[1].name;
  }
}

export class TObjectTypesNumber extends TObject<number> {
  constructor(typesNumber: number) {
    super(typesNumber);
  }

  public toString(): string {
    if (this.value == 1) {
      return "1 type";
    } else {
      return "2 types";
    }
  }
}

export class TObjectStat extends TObject<Stat | { name: string }> {
  constructor(stat: Stat | { name: string }) {
    super(stat);
  }

  public toString(): string {
    return this.value.name;
  }
}

//#endregion

//#region PREDICATES

export abstract class TPredicate<T, K> {
  constructor(protected args: any[] = []) {
    this.args = args;
  }

  abstract evaluate(subject: TObject<T>, object: TObject<K>, ...args: any[]): boolean;

  abstract toString(o1: T): string;
}

export class TEqualPokemon extends TPredicate<Pokemon, Pokemon> {
  evaluate(o1: TObject<Pokemon>, o2: TObject<Pokemon>): boolean {
    return o1.value.name === o2.value.name;
  }

  public toString(pokemon: Pokemon): string {
    return `Is it ${pokemon.name}?`;
  }
}

export class TIsSpeciesCategory extends TPredicate<SpeciesCategory, PokemonSpecies> {
  evaluate(o1: TObject<SpeciesCategory>, o2: TObject<PokemonSpecies>): boolean {
    let result = false;
    switch(o1.value) {
      case SpeciesCategory.Baby:
        result = o2.value.is_baby;
        break;
      case SpeciesCategory.Legendary:
        result = o2.value.is_legendary;
        break;
      case SpeciesCategory.Mythical:
        result = o2.value.is_mythical;
        break;
      default:
        result =  !o2.value.is_baby && !o2.value.is_legendary && !o2.value.is_mythical;
    }
    return result;
  }

  public toString(category: SpeciesCategory): string {
    if(category != SpeciesCategory.None) {
      return `Is it a ${category}?`;
    } else {
      return `Does it have no special category?`;
    }
  }
}

export class TFromGeneration extends TPredicate<Generation, PokemonSpecies> {
  evaluate(o1: TObject<Generation>, o2: TObject<PokemonSpecies>): boolean {
    return o1.value.name === o2.value.generation.name;
  }
  public toString(gen: Generation): string {
    return `Is it from ${gen.name}?`;
  }
}

export class TFromOrBeforeGeneration extends TPredicate<Generation, PokemonSpecies> {
  evaluate(o1: TObject<Generation>, o2: TObject<PokemonSpecies>): boolean {
    return o2.value.generation.name <= o1.value.name;
  }
  public toString(gen: Generation): string {
    return `Is it from ${gen.name} or before?`;
  }
}

export class TFromOrAfterGeneration extends TPredicate<Generation, PokemonSpecies> {
  evaluate(o1: TObject<Generation>, o2: TObject<PokemonSpecies>): boolean {
    return o2.value.generation.name >= o1.value.name;
  }
  public toString(gen: Generation): string {
    return `Is it from ${gen.name} or after?`;
  }
}

//#region EVOLUTION
function getStage(chain: ChainLink, pokemon: Pokemon): number {
  let stage = -1;
  if(chain.species.name == pokemon.name) {
    return 0;
  } 

  chain.evolves_to.forEach((child: ChainLink) => {
    stage = 1 + Math.max(getStage(child, pokemon)); 
  }) 

  return stage;
}

function countChainPokemon(chain: ChainLink): number {
  let stage = 1;

  chain.evolves_to.forEach((child: ChainLink) => {
    stage += countChainPokemon(child); 
  }) 

  return stage;
}

export class TEvolutionChainNumberE extends TPredicate<number, EvolutionChain> {

  evaluate(o1: TObject<number>, o2: TObject<EvolutionChain>): boolean {
    const chainCount = countChainPokemon(o2.value.chain);
    return o1.value == chainCount;
  }

  public toString(chain: number): string {
    if (chain == 1) {
      return `Is it the only pokemon in its evo-chain?`
    } else {
      return `Does its evo-chain have ${chain} pokemon?`
    }
  }
}
export class TEvolutionChainNumberLE extends TPredicate<number, EvolutionChain> {

  evaluate(o1: TObject<number>, o2: TObject<EvolutionChain>): boolean {
    const chainCount = countChainPokemon(o2.value.chain);
    return chainCount <= o1.value;
  }

  public toString(chain: number): string {
    return `Does its evo-chain have ${chain} pokemon or less?`;
  }
}

export class TEvolutionChainNumberGE extends TPredicate<number, EvolutionChain> {

  evaluate(o1: TObject<number>, o2: TObject<EvolutionChain>): boolean {
    const chainCount = countChainPokemon(o2.value.chain);
    return chainCount >= o1.value;
  }

  public toString(chain: number): string {
    return `Does its evo-chain have ${chain} pokemon or more?`;
  }
}
export class TIsEvolutionStage extends TPredicate<EvolutionChain, Pokemon> {
  constructor(...args: number[]) {
    super(args);
  }

  evaluate(o1: TObject<EvolutionChain>, o2: TObject<Pokemon>): boolean {
    const stage = getStage(o1.value.chain, o2.value);
    const param_stage = parseInt(this.args[0]);
    return stage == param_stage;
  }

  public toString(chain: EvolutionChain): string {
    const stage = parseInt(this.args[0]);
    if(stage == 0) {
      return `Is it unevolved?`
    } else if (stage == 1) {
      return `Is it a first evolution?`
    } else if (stage == 2 ) {
      return `Is it a second evolution?`
    } else {
      return `Is it a third evolution or greater?`
    }
  }
}

export class TIsEvolutionTrigger extends TPredicate<EvolutionTrigger, Pokemon> {
  evaluate(o1: TObject<EvolutionTrigger>, o2: TObject<Pokemon>): boolean {
    return o1.value.pokemon_species.some((poke: NamedAPIResource) => poke.name == o2.value.name);
  }

  public toString(trigger: EvolutionTrigger): string {
    return `Did it evolve by ${trigger.name}?`;
  }
}

//#endregion

export class TLearnMove extends TPredicate<Move, Pokemon> {
  evaluate(o1: TObject<Move>, o2: TObject<Pokemon>): boolean {
    return (
      o2.value.moves.find((m) => m.move.name === o1.value.name) !== undefined
    );
  }
  public toString(move: Move): string {
    return `Does it learn ${move.name}?`;
  }
}

export class TEqualTypes extends TPredicate<Type[], Pokemon> {
  evaluate(o1: TObject<Type[]>, o2: TObject<Pokemon>): boolean {
    // less rigid
    const o1Type1 = o1.value[0].name;
    const o2Type1 = o2.value.types[0].type.name;
    const o2Type2 = o2.value.types[1]?.type?.name;

    if (o1.value.length == 1) {
      return o1Type1 == o2Type1 || o1Type1 == o2Type2;
    } else {
      const o1Type2 = o1.value[1].name;
      return (
        (o1Type1 == o2Type1 && o1Type2 == o2Type2) ||
        (o1Type1 == o2Type2 && o1Type2 == o2Type1)
      );
    }

    //#region more rigid
    // if (o1.value.length != o2.value.types.length) {
    //   return false;
    // }
    // const isEqualT1 = o1.value[0].name === o2.value.types[0].type.name;
    // return o1.value.length == 1
    //   ? isEqualT1
    //   : isEqualT1 && o1.value[1].name === o2.value.types[1].type.name;
    //#endregion
  }
  public toString(types: Type[]): string {
    return `Is it a ${types.map((type: Type) => type.name).join('-')} type?`;
  }
}

export class TEqualTypesNumber extends TPredicate<number, Pokemon> {
  evaluate(o1: TObject<number>, o2: TObject<Pokemon>): boolean {
    return o1.value == o2.value.types.length;
  }

  public toString(numberOfTypes: number): string {
    if(numberOfTypes > 1) {
      return `Does it have ${numberOfTypes} types?`;
    } else {
      return `Does it have only 1 type?`;
    }
  }
}


function getBaseStat(o1: TObject<Stat | {name: string}>, o2: TObject<Pokemon>) {
  let base_stat = 0;
    if (o1.value.name == "total") {
      base_stat = o2.value.stats.reduce((partialSum: number, stat: PokemonStat) => partialSum + stat.base_stat, 0);
    } else {
      base_stat = o2.value.stats.find(stat => stat.stat.name == o1.value.name)?.base_stat!;
    }
    return base_stat;
}
export class TStatE extends TPredicate<Stat | {name: string}, Pokemon> {

  constructor(...args: number[]) {
    super(args);
  }

  evaluate(o1: TObject<Stat | {name: string}>, o2: TObject<Pokemon>): boolean {
    const baseStat = getBaseStat(o1, o2);
    const value = parseInt(this.args[0]);
    return value == baseStat;
  }

  public toString(stat: Stat | {name: string}): string {
    if(stat.name == 'total') {
      return `Are its total base stats ${this.args[0]}?`;
    } else {
      return `Is its base ${stat.name} ${this.args[0]}?`;
    }
  }
}

export class TStatLE extends TPredicate<Stat | {name: string}, Pokemon> {

  constructor(...args: number[]) {
    super(args);
  }

  evaluate(o1: TObject<Stat | {name: string}>, o2: TObject<Pokemon>): boolean { 
    const baseStat = getBaseStat(o1, o2);
    const value = parseInt(this.args[0]);
    return baseStat <= value;
  }

  public toString(stat: Stat | {name: string}): string {
    if(stat.name == 'total') {
      return `Are its total base stats lesser than or equal to ${this.args[0]}?`;
    } else {
      return `Is its base ${stat.name} lesser than or equal to ${this.args[0]}?`;
    }
  }
}

export class TStatGE extends TPredicate<Stat | {name: string}, Pokemon> {

  constructor(...args: number[]) {
    super(args);
  }

  evaluate(o1: TObject<Stat | {name: string}>, o2: TObject<Pokemon>): boolean {
    const baseStat = getBaseStat(o1, o2);
    const value = parseInt(this.args[0]);
    return baseStat >= value;
  }

  public toString(stat: Stat | {name: string}): string {
    if(stat.name == 'total') {
      return `Are its total base stats greater than or equal to ${this.args[0]}?`;
    } else {
      return `Is its base ${stat.name} greater than or equal to ${this.args[0]}?`;
    }
  }
}

//#endregion

