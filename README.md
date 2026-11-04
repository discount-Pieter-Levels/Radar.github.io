# Radar

A static directory of **non-government** grants, communities and fellowships. India-first, global welcome.

Data lives in `data/grants.yaml` and `data/communities.yaml`.

## Add an entry

```sh
npm run add -- <url> [grants|communities]
```

Or edit the YAML and run `npm run validate`. Use `null` for unknown fields; never guess.

## Run locally

```sh
npm install
npm run dev     # http://localhost:4321
npm run build   # validate + build to dist/
```

## Automation

- **Deploy**: builds on push and daily, publishes to GitHub Pages.
- **Link check**: weekly; closes past-deadline entries and opens an issue for stale ones.

## Rules

- No government money.
- Every entry needs a `source_url` and `last_verified` date.
