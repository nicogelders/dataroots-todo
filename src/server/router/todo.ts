import { createRouter } from "./context";
import { z } from "zod";

export const todoRouter = createRouter()
  .query("get-all", {
    async resolve({ ctx }) {
      const todos = await ctx.prisma.todoItem.findMany({});

      return todos;
    },
  })
  .query("get-all-done", {
    async resolve({ ctx }) {
      const todos = await ctx.prisma.todoItem.findMany({
        where: {
          done: false,
        },
      });

      return todos;
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.todoItem.create({
        data: {
          name: input.name,
        },
      });
    },
  })
  .mutation("toggle-done", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      // const todo = await ctx.prisma.todoItem.findUnique({
      //   where: {
      //     id: input.id,
      //   },
      // });

      await ctx.prisma.todoItem.update({
        where: {
          id: input.id,
        },
        data: {
          done: true,
        },
      });
    },
  });
