import z from "zod";

export const pagingSchema = z.object({
  cursors: z.object({
    before: z.string(),
    after: z.string(),
  }),
});

export type Paging = z.infer<typeof pagingSchema>;
