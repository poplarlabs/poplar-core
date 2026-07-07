# poplarlabs.xyz

The public site for Poplar — groves: a hometown you choose. Next.js 14 (app router) + Tailwind, deployed on Vercel via the GitHub integration (push to master).

## Routes

- `/` — landing: the grove story, the path, and the CTAs
- `/vision` — the reader-facing manifesto (an adaptation of `requirements/whitepaper.md`; internal strategy stays out — see the register note in `requirements/README.md`)
- `/start` — intake for founding communities ("Plant the first grove")
- `/x-kit` — hidden and noindexed: X profile assets and copy
- `/litepaper` → permanent redirect to `/vision`

## Development

```bash
yarn install
yarn dev        # http://localhost:3000
yarn build      # production build (also what the pre-commit lint gate expects)
```

No global yarn on your machine? `npx yarn@1.22.22 <command>` works.

## Notes

- Forms (`StartForm.tsx`, `FollowForm.tsx`) POST to FormSubmit and arrive by email; to change providers, swap the `ENDPOINT` constant.
- Public copy register: member's-eye view, plain speech, no protocol/token vocabulary. When in doubt, read `/vision` and match it.
- Brand: `PoplarMark.tsx` (nav/footer/favicons), `RootSystem.tsx` (the root-system drawing), Young Serif + Inter + IBM Plex Mono, soil/cream palette in `tailwind.config.js`.
