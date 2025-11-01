# View API

For the View API, we need a "pick" for properties and a "pick" for metadata

```ts
const MyPage = contentType({
  properties: {
    a: { type: "string" },
    b: { type: "string" },
    c: { type: "richText" },
  },
});

const MyView = MyPage.createView(
  // Properties
  {
    a: true,

    // Can I do this?
    c: {
      json: true,
    },
  },
  // Metadata
  {
    displayName: true,

    // Here looks more obvious...
    url: {
      default: true,
      hierarchical: false,
    },
  }
);
```

For rendering a View

```ts
// Register a component for a view:
initComponentRegistry({
  MyPage: MyComponent1,
  MyView: MyComponent2,
});
```

When fetching, we need to tell "use this View instead of the normal content type"

```ts
const data = await client.fetchContent("/en/landing", {
  overrides: {
    // "instead of MyPage use MyView"
    MyPage: MyView,
  },
});

return <OptimizelyComponent opti={data[0]} />;
```

Implementation detail. When using a view _instead of_ a content type, we need to keep this information because `<OptimizelyComponent>` need to search the right component

Today we use `__typename`, we need to add `__viewname`
