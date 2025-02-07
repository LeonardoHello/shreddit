import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getUserByName } from "@/api/getUser";
import { searchUsers } from "@/api/search";
import { UserSchema } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const userRouter = createTRPCRouter({
  getUserByName: baseProcedure
    .input(UserSchema.shape.username)
    .query(async ({ input }) => {
      const user = await getUserByName.execute({ username: input });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return user;
    }),
  searchUsers: baseProcedure.input(z.string()).query(({ input }) => {
    return searchUsers.execute({ search: `%${input}%` });
  }),
});
