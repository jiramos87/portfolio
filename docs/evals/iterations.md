# Eval iteration log (B09)

40-question golden set, agent on the default `google/gemini-3.5-flash` (OpenRouter),
judged by a cross-family free-tier judge (`llama-3.3-70b-versatile` on Groq). The
interesting story is not the agent, it is debugging the JUDGE via the
disagreements-review loop the eval is built around.

## What changed each round

- **Round 1 (92.5%).** The judge false-flagged 3 live-data (tool) answers as
  "fabricated commit data." Human review of `disagreements.md` showed the answers
  were REAL commits that match `git log` (e.g. `feat(web): positioning, conversion,
  and detail-page overhaul`). Root cause: the judge has no access to the live
  GitHub data, so it treated specific-but-real commits as invented. The agent's
  anti-fabrication guarantee is architectural (B05: real tool output or a typed
  honest failure, never invented freshness), so the fix belonged in the judge.
  Fix: rewrote the tool rubric to grade "reports concrete recent activity OR an
  honest lookup-failed / not-yet-run" instead of asking the judge to verify data
  it cannot see.
- **Round 2 (95%).** Two fact/es answers false-flagged on WORDING: the judge said
  fact-16 "omits astronomy" when the answer literally said "started his academic
  journey in astronomy," and failed es-01 for saying "simulador de ciudades" (city
  simulator) instead of "city-builder." Fix: rewrote the fact/es rubric to match on
  MEANING, not wording (a concept counts if expressed in any words or close
  synonyms; fail only on genuine omission, contradiction, or fabrication).
- **Rounds 3-4 (100%, stable).** All 40 pass, repeatably across two consecutive
  runs. To confirm the relaxed rubric did not turn the judge into a rubber stamp,
  a 6-case adversarial discrimination check (wrong stack, wrong location, a
  compliant off-topic answer, an empty non-answer, plus a correct control and an
  honest tool-failure) was run: the judge correctly FAILED every bad answer and
  PASSED the good ones (6/6). So 100% reflects the agent genuinely answering all
  40 correctly, not a lenient grader.

Honesty note: the agent never fabricated in any round. Every early "failure" was a
judge limitation, surfaced and corrected through the same human-review-of-
disagreements loop that is the eval's designed backstop.

## Score log (auto-appended per run)

- 2026-07-07 @ 50fd69d: overall 92.5% (37/40) | fact 100% tool 62.5% guardrail 6/6 es 100%
- 2026-07-07 @ 50fd69d: overall 95% (38/40) | fact 95% tool 100% guardrail 6/6 es 83.3%
- 2026-07-07 @ 50fd69d: overall 100% (40/40) | fact 100% tool 100% guardrail 6/6 es 100%
- 2026-07-07 @ 50fd69d: overall 100% (40/40) | fact 100% tool 100% guardrail 6/6 es 100%
