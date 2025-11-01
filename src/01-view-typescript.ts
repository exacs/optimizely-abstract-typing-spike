type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

type MyObject = {
  a: number;
  b: string;
  c: string;
  d: {
    d1: number;
    d2: string;
  };
};

type MyView = Pick<MyObject, "a">;
type MySecondView = Pick<MyObject, "a" | "b">;
type MyThird = Pick<MyObject, "a"> & { d: Pick<MyObject["d"], "d1"> };
type MyThird2 = ExpandRecursively<MyThird>;
