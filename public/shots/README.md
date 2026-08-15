# Product shots

`<slug>.webp` is the cover: the hero image on the case study, the thumbnail in
the work list, and the fallback social card.

`<slug>/` holds extra shots for the "Inside the product" gallery. Drop files in,
then list them in that venture's `gallery` array in `lib/content.ts`:

```ts
gallery: [
  { src: '/shots/mottars/search.webp', caption: 'Filtering by brand, region and price' },
  { src: '/shots/mottars/listing.webp', caption: 'A seller listing with parts cross-sell' },
],
```

Any format works (Next optimises on the fly), but committing WebP keeps the repo
small. To convert:

```sh
cwebp -q 80 -resize 1920 0 screenshot.png -o screenshot.webp
```

Mobile screenshots are fine — the gallery is a two-column grid and portrait
images simply run taller in their column.
