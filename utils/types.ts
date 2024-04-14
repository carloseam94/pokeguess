export type Preview = {
  name: string;
  url: string;
};

export type Guess = {
  question: string;
  answer: boolean;
};

export enum MathSymbols {
  Equal = "=",
  Greater = ">=",
  Lesser = "<=",
}

export enum TimeRelated {
  Is = "Is from",
  Before = "Is from or before",
  After = "Is from or after",
}

export enum EvoStage {
  Unevolved = "Unevolved",
  First = "First evolution",
  Second = "Second evolution",
}

export enum SpeciesCategory {
  Baby = "Baby",
  Legendary = "Legendary",
  Mythical = "Mythical",
  None = "None"
}
