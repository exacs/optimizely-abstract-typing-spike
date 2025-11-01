# Contracts API (abstract typing)

To simplify:

- Use View to have equal _or less_ properties/metadata
- Use Contracts to have equal _or more_ properties

## Option 1. "extend" a content type to create another content type

```ts
// We define our base types somewhere
const Page = contentType(...)

// Users define their own content types:
const MyPage = Page.extend({...});

// They can extend their defined content types:
const MyP2 = MyPage.extend({...})
```

- You can only extend _one_ content type at a time

## Option 2. Type-less contracts

```ts
// 1. Define some contracts
const MyContract1 = contract({
  // No base type here
  properties: {
    a: { type: "string" },
  },
});
const MyContract2 = contract({
  properties: {
    b: { type: "string" },
  },
});

// 2. You add the contracts into your content type
const MyPage = contentType({
  baseType: "_page",
})
  .expand(MyContract1)
  .expand(MyContract2);

// MyPage will have the properties "a" and "b"
```

# ?? How to fetch?
