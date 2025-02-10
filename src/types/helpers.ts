export type ArrElement<Arr> = Arr extends readonly (infer T)[] ? T : never;
