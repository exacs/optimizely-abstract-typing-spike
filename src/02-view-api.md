# View API. Use case

```ts
// We have a content type with 3 fields
const MyPage = contentType({
  properties: {
    title: { type: "string" },
    image: { type: "contentReference" },
    body: { type: "richText" },
  },
});

const Landing = contentType({
  properties: {
    news: {
      // Content item area with "MyPage" as allowed type
      type: "array",
      items: { type: "content", allowedTypes: [MyPage] },
    },
  },
});
```

When rendering the Landing, I don't want to fetch the body:

```tsx
const MyView = MyPage.createView(
  {
    title: true,
    image: true,
  },
  {
    url: true,
  }
);

type MyViewProps = {
  opti: infer<typeof MyView>
}

// Component for the View
function MyViewComponent({opti}: MyViewProps) {
  return (
    <div>
      <h2>{opti.title}</h2>
      <img src={opti.image.default} />
    </div>
  )
}
```

## Query

```ts
const data = await client.fetchContent("/en/landing", {
  overrides: {
    // "instead of MyPage use MyView"
    MyPage: MyView,
  },
});

return <OptimizelyComponent opti={data[0]} />;
```

## Rendering

### Option 1. Override in registry

```ts
initComponentRegistry({
  MyView: MyViewComponent,
});
```

In this implementation, the `fetchContent` has to **decorate** the object with `__viewname`:

```json
{
  "__typename": "MyPage",
  // Added by the SDK (otherwise, OptimizelyComponent doesn't know what to render)
  "__viewname": "MyView",
  "title": "Hello world",
  "image": {
    "default": "something.jpg"
  }
  // ...
}
```

### Option 2. Override in `OptimizelyComponent`

```tsx
<OptimizelyComponent
  opti={data[0]}
  overrides={{
    MyPage: MyViewComponent,
  }}
/>
```
