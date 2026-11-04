# Radar

A static directory of **non-government** grants, communities and fellowships. India-first, global welcome.

Data lives in `data/grants.yaml` and `data/communities.yaml`.

## Add an entry

Edit `data/grants.yaml` or `data/communities.yaml` and open a pull request. Use `null` for unknown fields; never guess.

## Automation

- **Deploy**: builds on push and daily, publishes to GitHub Pages.
- **Link check**: weekly; closes past-deadline entries and opens an issue for stale ones.

## Rules

- No government money.
- Every entry needs a `source_url` and `last_verified` date.
