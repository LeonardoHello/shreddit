import { z } from "zod";

import { getUserImage } from "@/api/getUser";
import { searchUsers } from "@/api/search";
import { UserSchema } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";

export const userRouter = createTRPCRouter({
  getUserImage: protectedProcedure
    .input(UserSchema.shape.name)
    .query(({ input }) => {
      return getUserImage.execute({ name: input });
    }),
  searchUsers: baseProcedure.input(z.string()).query(({ input }) => {
    return searchUsers.execute({ search: `%${input}%` });
  }),
});
