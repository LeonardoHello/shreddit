import { z } from "zod";

import { searchUsers } from "@/api/search";
import { baseProcedure, createTRPCRouter } from "../init";

export const userRouter = createTRPCRouter({
  searchUsers: baseProcedure.input(z.string()).query(({ input }) => {
    return searchUsers.execute({ search: `%${input}%` });
  }),
});
