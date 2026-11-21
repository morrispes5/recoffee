# RE:coffee

Sistem pemesanan kopi berbasis meja (open bill) — proyek UAS Manajemen Proyek Perangkat Lunak.

- PRD (sumber kebenaran): [`docs/REcoffeePrd.md`](docs/REcoffeePrd.md)
- Progres per milestone: [`docs/PROGRESS.md`](docs/PROGRESS.md)
- Design system: [`docs/design-system.md`](docs/design-system.md)

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173  (katalog komponen: /dev/ui)
npm run build
npm run lint
npm run test
```

Stack: Vite, React, TypeScript (strict), React Router, TanStack Query, Tailwind CSS v4, Phosphor Icons, Zod, Supabase (mulai M4), Vitest.
