import { z } from "zod";

const MyObject = z.object({
  a: z.number(),
  b: z.string(),
  c: z.string(),
  d: z.object({
    d1: z.number(),
    d2: z.string(),
  }),
});

const MyViewSchema = MyObject.pick({ a: true });
const MySecondViewSchema = MyObject.pick({ a: true, b: true });
const MyThirdSchema = MyObject.pick({ a: true }).extend({
  d: MyObject.shape.d.pick({ d1: true }),
});

type MyView = z.infer<typeof MyViewSchema>;
type MySecondView = z.infer<typeof MySecondViewSchema>;
type MyThird = z.infer<typeof MyThirdSchema>;
