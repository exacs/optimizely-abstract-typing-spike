```ts
type _IContent = {
  _link: object;
  _deleted: boolean;
  _fulltext: string[];
  _modified: string;
  _score: number;
  _id: string;
  _track: string;
  _metadata;
};

type _Page = _IContent & {
  _link;
  _deleted;
};
```
