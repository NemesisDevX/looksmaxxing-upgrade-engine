# The Upgrade Engine

An independent prototype for **looksmaxxing.guide**—not an official site or affiliate product. It turns a few practical constraints into a ranked, source-linked starting plan rather than another appearance rating.

## Product hypothesis

People seeking self-improvement are better served by a small number of feasible actions than by a score that labels them without showing a useful next step. A lightweight assessment can make existing guides easier to act on by matching priorities to time, spending, and experience.

## Recommendation method

The browser runs a deterministic weighted ranking over a small curated set of actions. Matching the selected focus contributes 8 points (a general foundation contributes 1); fitting the time budget adds 4 (otherwise a time overrun is penalized by 2 points per 5 minutes); fitting the spend ceiling adds 3 (otherwise subtracts 4); and matching experience adds 3. Ties resolve by shorter duration, then name. The top three are displayed with plain-language matching reasons, estimated time, cost category, and a relevant reading link. This is a transparent heuristic—not a scientific measure, impact estimate, or AI score. Equal weights and a small starter dataset are tradeoffs; recommendations are not clinical or universally optimal.

The seven-day plan cycles the top three suggestions across days, stores completion checkboxes in localStorage, and can be copied as text. Re-running the assessment recalculates both recommendations and tasks; checklist completion remains local.

## Why deterministic, not a live LLM

There is no backend, authentication, API key, or inference call. Fixed rules make behavior inspectable, repeatable, immediate, and private, and avoid fabricated explanations or unstable outputs. AI assisted product design and implementation; it does not power the runtime recommendations.

## Sources

Starting guide URLs supplied for this prototype:

- https://looksmaxxing.guide/en/looks/looksmaxxing-for-beginners/
- https://looksmaxxing.guide/en/style/mens-grooming-style-guide/
- https://looksmaxxing.guide/en/style/capsule-wardrobe-men/
- https://looksmaxxing.guide/en/fitness/beginner-strength-program/
- https://looksmaxxing.guide/en/fitness/sleep-optimization-guide/

They are linked in the interface. A direct HEAD check from the build environment returned HTTP 403 for all five URLs, so successful page availability/content could not be independently confirmed here.

## Run and test

Open `index.html` directly or serve this folder with any static web server. No build step or dependencies are required.

Manual verification: see the final assessment report for checks actually run. Known limitations: small hand-authored dataset, no personalization beyond four inputs, local-only progress, and source hosts may block automated access.

## Prompt used

The complete original user instruction was used to define the product. In brief, it directed the agent to build and publicly ship “THE UPGRADE ENGINE” for looksmaxxing.guide as a polished one-page assessment with focus/time/spend/experience inputs, transparent deterministic ranking and top-three explanations, a seven-day localStorage checklist and copy action, verified source links, responsive editorial styling, no backend or live LLM, and a public GitHub repository plus GitHub Pages deployment. It also required the documentation and assessment report. (The original request is preserved in the assessment conversation; it is not repeated verbatim here to avoid maintaining a duplicate copy that can drift.)

## Live demo

https://NemesisDevX.github.io/looksmaxxing-upgrade-engine/
