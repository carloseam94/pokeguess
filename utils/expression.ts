import { Pokemon, Generation, Move, Type, PokemonSpecies } from "pokenode-ts";

export enum Signs {
  Equal = 1,
  Greater,
  Lesser,
}

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
    return `${this.predicate.toString()} ${this.o1.toString()}?`;
  }
}

//#region OBJECTS

export abstract class TObject<T> {
  constructor(public value: T) {
    this.value = value;
  }
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

export class TObjectTypesAmounnt extends TObject<number> {
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

//#endregion

//#region PREDICATES

export abstract class TPredicate<T, K> {
  constructor() {}

  abstract evaluate(subject: TObject<T>, object: TObject<K>): boolean;
}

export class TPredicateDefault extends TPredicate<any, any> {
  evaluate(o1: TObject<any>, o2: TObject<any>): boolean {
    return false;
  }
  public toString(): string {
    return "Default";
  }
}

export class TEqualPokemon extends TPredicate<Pokemon, Pokemon> {
  evaluate(o1: TObject<Pokemon>, o2: TObject<Pokemon>): boolean {
    return o1.value.name === o2.value.name;
  }
  public toString(): string {
    return "Is it";
  }
}

export class TFromGenerationE extends TPredicate<Generation, Generation> {
  evaluate(o1: TObject<Generation>, o2: TObject<Generation>): boolean {
    return o1.value.id === o2.value.id;
  }
  public toString(): string {
    return "Is it from";
  }
}

export class TFromGenerationGE extends TPredicate<Generation, Generation> {
  evaluate(o1: TObject<Generation>, o2: TObject<Generation>): boolean {
    return o1.value.id >= o2.value.id;
  }
  public toString(): string {
    return "Is it from or before";
  }
}

export class TFromGenerationLE extends TPredicate<Generation, Generation> {
  evaluate(o1: TObject<Generation>, o2: TObject<Generation>): boolean {
    return o1.value.id <= o2.value.id;
  }
  public toString(): string {
    return "Is it from or after";
  }
}

export class TLearnMove extends TPredicate<Move, Pokemon> {
  evaluate(o1: TObject<Move>, o2: TObject<Pokemon>): boolean {
    return (
      o2.value.moves.find((m) => m.move.name === o1.value.name) !== undefined
    );
  }
  public toString(): string {
    return "Does it learn";
  }
}

export class TEqualTypes extends TPredicate<Type[], Pokemon> {
  evaluate(o1: TObject<Type[]>, o2: TObject<Pokemon>): boolean {
    if (o1.value.length != o2.value.types.length) {
      return false;
    }
    const isEqualT1 = o1.value[0].name === o2.value.types[0].type.name;
    return o1.value.length == 1
      ? isEqualT1
      : isEqualT1 && o1.value[1].name === o2.value.types[1].type.name;
  }
  public toString(): string {
    return "Is it of type";
  }
}

export class TEqualTypesNumber extends TPredicate<number, Pokemon> {
  evaluate(o1: TObject<number>, o2: TObject<Pokemon>): boolean {
    return o1.value == o2.value.types.length;
  }
  public toString(): string {
    return "Does it have";
  }
}

//#endregion

//#region FUNCTIONS
export function getDefaultExpression<T, K>(): TKExpression<T, K> {
  const exp: TKExpression<T, K> = new TKExpression<T, K>(
    new TObjectDefault(),
    new TPredicateDefault(),
    new TObjectDefault()
  );
  return exp;
}
//#endregion
