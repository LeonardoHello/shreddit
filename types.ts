import type { RouterInput, RouterOutput } from "@/trpc/procedures";

export type ArrElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type InfinteQueryPostsProcedure = {
  [K in keyof RouterOutput["posts"]]: "nextCursor" extends keyof RouterOutput["posts"][K]
    ? K
    : never;
}[keyof RouterOutput["posts"]];

export type InfinteQueryInfo<T extends InfinteQueryPostsProcedure> = {
  procedure: T;
  input: RouterInput["posts"][T];
};

export type InfinteQueryPost = ArrElement<
  RouterOutput["posts"][InfinteQueryPostsProcedure]["posts"]
>;
