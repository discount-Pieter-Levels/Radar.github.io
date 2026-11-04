# Radar

A fast, static directory of **non-government** grants and communities & fellowships.
India-first, global welcome. No startups/hiring section.

The data lives in two files — `data/grants.yaml` and `data/communities.yaml`. Global microgrants
already on the [1517 list](https://www.1517fund.com/grants) are linked, not duplicated.
No database. CI rejects invalid entries and anything that looks government-backed.

## Add an entry (< 1 minute)

```sh
npm run add -- https://x.com/someone/status/123      # X posts are read automatically
npm run add -- https://example.org/grant grants
```

Answer the prompts (most are pre-filled), and the script validates and appends. Then commit.
Or edit the YAML directly and run `npm run validate`.

Fields: `id, name, org, url, source_url, summary (≤200), region (India|Global|Remote), tags,
status (open|rolling|between cycles|closed|unknown), deadline, amount, added, last_verified`.
Communities add `format` (`Remote` / `Hybrid` / `In-person (City)`), `cost` and `topics`.
Equity-linked programs get the `equity-linked` tag; they are not presented as grants.
Unknown? Use `null`. Never guess.

## Run locally

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # validate + build to dist/
```

## What runs on its own

| | |
|---|---|
| **Deploy** (`.github/workflows/deploy.yml`) | Builds on push and daily, deploys to GitHub Pages. Entries unverified for 60+ days show an Unverified badge. |
| **Link check** (`check-links.yml`) | Mondays. Pings every URL, marks past-deadline entries `closed`, lists stale entries, opens an issue. No LLM. |
| **Suggestions** | "Suggest an opportunity" opens a GitHub Issue form. Nothing auto-publishes. |

Enable Pages: *Settings → Pages → Source: GitHub Actions*.

## Weekly sweep (optional)

```sh
git checkout main && git pull
claude -p "$(cat scripts/sweep-prompt.md)"
```

The agent researches new candidates, verifies each live, and opens a **pull request** on a
`sweep/<date>` branch. It never pushes to main. Review, then merge.

## Rules

- No government money, of any kind.
- Every entry has a `source_url` and a `last_verified` date.
- `last_verified` means the official page was reachable and the details were cross-checked against the source on that date.
