import type { RouterInput, RouterOutput } from "@/trpc/procedures";

export type ArrElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type InfinteQueryPostsProcedure = {
  [K in keyof RouterOutput]: "nextCursor" extends keyof RouterOutput[K]
    ? K
    : never;
}[keyof RouterOutput];

export type InfinteQueryInfo<T extends InfinteQueryPostsProcedure> = {
  procedure: T;
  input: RouterInput[T];
};

export type InfinteQueryPost = ArrElement<
  RouterOutput[InfinteQueryPostsProcedure]["posts"]
>;
