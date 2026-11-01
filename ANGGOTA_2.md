# Anggota 2 — Challenge & Roguelike Battle

Implemented only the Challenge domain. Home, Profile, authentication, badge evaluation, leaderboard, audio and the original combined seed script are unchanged. The only shared server change mounts `/api/battle` in `server/src/index.ts`.

## Features

- Scrollable 10-stage map, module selection, Knight/Mage/Archer selection, animated sprites, battle arena, answer feedback, skill controls, card draft and victory/permadeath results.
- Server-authoritative HP, damage, deadlines, skills, random Dodge/Critical/Counter, and all K01–K12 effects. Base HP 3, attack 10, enemy HP 10/20/30. Timeout counts as wrong; K08 only retries a selected wrong answer once per run.
- Knight restores one Shield per stage. Mage restores one charge after two completed stages. Archer Dodge follows the 30–70% curve. K05 raises capacity without instantly filling it. K06 fast answers add 15 EXP. K07 can end a boss encounter early.
- Firestore transactions serialize answers, skills and drafts. Question nonces prevent duplicate damage; refreshing preserves the server deadline. Answer keys remain server-side. Reopening an expired question resolves the timeout instead of restarting its timer.
- Seed contains 3 Classes, 12 cards and 13 questions per existing module (26 questions across the two currently supplied modules). It does not create or change Home modules.

## Run and checks

Use the existing `start-api.ps1` and `start-android.ps1` launchers.

From `server/`:

```powershell
npx tsx src/scripts/seedBattle.ts
npm run build
npx tsx --test src/game/engine.test.ts
# Set BATTLE_TEST_EMAIL and BATTLE_TEST_PASSWORD locally, then:
npx tsx src/scripts/smokeBattle.ts
```

The live smoke test temporarily exercises battle records using that account, restores the prior run/completion/card documents in `finally`, and removes its gameplay events. Run it against a development project without simultaneous gameplay on that account. No credentials are saved in source.

From `mobile/`: `npx expo lint`, `npx tsc --noEmit`, `npx expo-doctor`.

Verified: 18 engine tests; complete 13-answer/10-stage API victories for all 3 Classes; draft validation; concurrent duplicate answers; Mage skill consumption; K08; authoritative timeout; authentication; lesson gating. Emulator visuals checked for map, Class selection, arena and card draft. Expo Doctor: 21/21.

## Integration contracts

- Anggota 1 supplies `tb_modul` and lesson completion records in `tb_progres_siswa` containing `id_user`, `id_modul`, `materi_selesai: true`. A prerequisite requires another record with `modul_tamat: true`.
- The supplied user currently has no completed lesson record. Challenge deliberately remains locked until the Home domain supplies that state. No fake completion was left behind.
- One active run per user lives at `tb_progres_siswa/battle_<uid>`, under the `battle` field, separate from lesson fields. The document also exposes the requested `hp_sekarang`, `charge_shield`, `charge_mage`, `kartu_terpilih`, `streak_benar`, and `waktu_mulai_soal` fields atomically. On victory, the battle API merges `modul_tamat: true` at `<uid>_<moduleId>` for Home integration.
- Selected cards are recorded in `tb_kartu_buff_siswa/<uid>_<cardId>`. Anggota 3 can consume `battle_events` (unique per run + question nonce) for EXP aggregation and badge/profile updates. Events include result, elapsed time, stage, Class, HP, streak, Shield/Dodge counters, and cumulative run totals. This implementation does not evaluate badges or alter `tb_user` statistics.
- API routes: authenticated `GET /state`, `POST /start`, `GET /question?runId=...`, `POST /answer`, `POST /use-skill`, `POST /draft-card`, all under `/api/battle`.
- `start`: `{moduleId, heroClass, restart?}`. Mutations use `runId`; answers/skills also require the current `nonce`. Answers are `A`–`D`, or `null` for timeout. Skills are `mage`, `arcane`, `aim`. Draft body includes `cardId`.
- Figma reference: https://www.figma.com/design/OdabCNwTi8AcbYlXRtg3qi/Wireframe-Mopro?node-id=27-485 . Downloaded Knight/Slime, avatar and timer assets live in `mobile/assets/challenge/`. Mage and Archer use explicit local vector placeholders; boss identity is shown by stage/name/HP.
- Delivery branch: `fitur-challenge` in `https://github.com/Rynr615/edungeon`. Only Challenge-domain changes and the battle-route hook are included; local setup changes, environment files, credentials and generated files are excluded.
