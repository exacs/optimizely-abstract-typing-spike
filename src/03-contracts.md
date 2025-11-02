# Contracts API (abstract typing). Use case

```ts
// We have a content type with 3 fields
const MyPage = contentType({
  properties: {
    title: { type: "string" },
    image: { type: "contentReference" },
    body: { type: "richText" },
  },
});

const MyEvent = contentType({
  properties: {
    title: { type: "string" },
    image: { type: "contentReference" },
    startDate: { type: "string" },
    location: { type: "string" },
  },
});

const MyNews = contentType({
  properties: {
    title: { type: "string" },
    image: { type: "contentReference" },
    body: { type: "richText" },
    summary: { type: "string" },
  },
});

const Landing = contentType({
  properties: {
    news: {
      type: "array",
      items: {
        type: "content",
        allowedTypes: [MyPage, MyEvent, MyNews],
      },
    },
  },
});
```

## Option 1. A hacky solution

I create a view and its component

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


type PagePreviewProps = {
  opti: infer<typeof PagePreview>
}

// Component for the View
function PagePreviewComponent({opti}: PagePreviewProps) {
  return (
    <div>
      <h2>{opti.title}</h2>
      <img src={opti.image.default} />
    </div>
  )
}
```

When querying, I use the same view for everything

```ts
const data = await client.fetchContent("/en/landing", {
  overrides: {
    MyPage: MyView,

    // I SHOULD NOT do this because they are technically unrelated:
    MyEvent: MyView,
    MyNews: MyView,
  },
});
```

## Option 2. Type-less contracts

```ts
const MyContract1 = contract({
  // No base type here
  properties: {
    title: { type: "string" },
    image: { type: "contentReference" },
  },
});

// And then...
const MyPage = contentType({
  properties: {
    title: { type: "string" },
    image: { type: "contentReference" },
    body: { type: "richText" },
  },
});

const MyEvent = contentType({
  extends: MyPage,
  baseType: "page",
  properties: {
    startDate: { type: "string" },
    location: { type: "string" },
  },
});

const MyNews = contentType({
  extends: MyPage,
  baseType: "page",
  properties: {
    body: { type: "richText" },
    summary: { type: "string" },
  },
});

const Landing = contentType({
  properties: {
    news: {
      type: "array",
      items: {
        type: "content",
        allowedTypes: [MyContract1],
      },
    },
  },
});
```

Note: with this implementation, content types can extend multiple contracts

## Option 3. Inheritance

```ts
const MyContract1 = contract({
  baseType: "page",
  properties: {
    title: { type: "string" },
    image: { type: "contentReference" },
  },
});

// And then...
const MyPage = contentType({
  properties: {
    title: { type: "string" },
    image: { type: "contentReference" },
    body: { type: "richText" },
  },
});

const MyEvent = contentType({
  extends: MyPage,
  properties: {
    startDate: { type: "string" },
    location: { type: "string" },
  },
});

const MyNews = contentType({
  extends: MyPage,
  properties: {
    body: { type: "richText" },
    summary: { type: "string" },
  },
});

const Landing = contentType({
  properties: {
    news: {
      type: "array",
      items: {
        type: "content",
        allowedTypes: [MyContract1],
      },
    },
  },
});
```

## Option 3b. A complete inheritance chain

```ts
// INTERNAL. Definition of "Page"
const Page = contract({
  properties: {}
})

// Users define their own contracts:
const MyContract1 = Page.extend({...});

// They can extend their defined content types:
const MyPage = MyContract1.extend({...})
const MyEvent = MyContract1.extend({...})
const MyNews = MyContract1.extend({...})
```
