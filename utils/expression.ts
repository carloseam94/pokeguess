import { Pokemon, Move } from "pokenode-ts";

export class TKExpression<T, K> {
  constructor(
    private o1: TObject<T>,
    private predicate: TPredicate<T, K>,
    private o2: TObject<K>
  ) {
    this.o1 = o1;
    this.predicate = predicate;
    this.o2 = o2;
  }

  evaluate(): boolean {
    return this.predicate.evaluate(this.o1, this.o2);
  }

  print(): string {
    return JSON.stringify({
      o1: this.o1.print(),
      predicate: this.predicate.print(),
      o2: this.o2.print(),
    });
  }
}

//#region OBJECTS

export abstract class TObject<T> {
  constructor(public value: T) {
    this.value = value;
  }

  abstract print(): string;
}

export class TObjectDefault extends TObject<any> {
  constructor() {
    super(null);
  }

  print(): string {
    return `Object-Default-${this.value}`;
  }
}

export class TObjectPokemon extends TObject<Pokemon> {
  constructor(pokemon: Pokemon) {
    super(pokemon);
  }

  print(): string {
    return `Object-Pokemon-${this.value.id}`;
  }
}

export class TObjectMove extends TObject<Move> {
  constructor(move: Move) {
    super(move);
  }

  print(): string {
    return `Object-Move-${this.value.id}`;
  }
}

//#endregion

//#region PREDICATES

export abstract class TPredicate<T, K> {
  constructor() {}

  abstract evaluate(subject: TObject<T>, object: TObject<K>): boolean;

  abstract print(): string;
}

export class TPredicateDefault extends TPredicate<any, any> {
  evaluate(o1: TObject<any>, o2: TObject<any>): boolean {
    return false;
  }
  print(): string {
    return `Predicate-Default`;
  }
}

export class TEqualPokemon extends TPredicate<Pokemon, Pokemon> {
  evaluate(o1: TObject<Pokemon>, o2: TObject<Pokemon>): boolean {
    return o1.value.id === o2.value.id;
  }
  print(): string {
    return `Predicate-Equal-Pokemon-Pokemon`;
  }
}

export class TLearnMove extends TPredicate<Move, Pokemon> {
  evaluate(o1: TObject<Move>, o2: TObject<Pokemon>): boolean {
    return (
      o2.value.moves.find((m) => m.move.name === o1.value.name) !== undefined
    );
  }
  print(): string {
    return `Predicate-Learn-Move-Pokemon`;
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
