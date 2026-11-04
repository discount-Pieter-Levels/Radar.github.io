# Weekly sweep prompt (optional, LLM)

Run with Claude Code from the repo root, e.g. `claude -p "$(cat scripts/sweep-prompt.md)"`.

---

You maintain **Radar**, a directory of non-government grants and communities/fellowships
for young technical builders in India (global/remote OK).

1. Read `data/*.yaml` and `scripts/sections.ts` so you know what exists and which tags are allowed.
2. Search for **new** candidates from the last 14 days:
   - Grants: founder-run microgrants, community grants, no-strings angel grants, especially ones posted on X by Indian builders. Also new rounds of programs already listed.
   - Communities: builder residencies, hacker houses, cohorts, research fellowships, volunteer research orgs.
3. For every candidate, **open the official page** (or the post) and confirm it is live. Never invent names, amounts or deadlines — use `null` when unknown.
4. Hard exclusions: anything government-backed in any way (DST, BIRAC, MeitY, Startup India, state programs, PSU CSR, govt-university schemes, EU/NSF-funded), equity accelerators presented as grants, PhD scholarships, pay-to-apply competitions.
6. Add entries with `added` and `last_verified` = today. Run `npm run validate` until it passes.
7. Create a branch `sweep/<date>`, commit, and open a **pull request** with a one-line rationale and source link per entry. **Never push to main.**
