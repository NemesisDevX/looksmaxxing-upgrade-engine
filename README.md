# The Upgrade Engine

An independent prototype for **looksmaxxing.guide**—not an official site or affiliate product. It turns a few practical constraints into a ranked, source-linked starting plan rather than another appearance rating.

## Product hypothesis

People seeking self-improvement are better served by a small number of feasible actions than by a score that labels them without showing a useful next step. A lightweight assessment can make existing guides easier to act on by matching priorities to time, spending, and experience.

## Recommendation method

The browser runs a deterministic weighted ranking over a curated action set. Actions exceeding the selected time or budget or incompatible with the selected experience are excluded. Matching the focus contributes 10 points (a general foundation contributes 1), fitting the time window contributes 4, staying in budget contributes 3, compatible experience contributes 3, and an editorial priority modifier rewards practical starting steps. Ties resolve by shorter duration then name. To avoid turning the experience into a shopping funnel, the shortlist retains at least two free foundations and includes at most one optional paid suggestion when the budget allows. Prices are rough USD estimates, not current offers. The scores are ranking heuristics—not scientific impact estimates or AI scores.

The seven-day plan has distinct first and follow-up actions for each of the top three recommendations, plus a day-seven review. Completion is stored in localStorage under a key containing the exact assessment choices and recommended action IDs, preventing completed tasks from carrying over when the user changes plans. The reset button clears the current plan only. Re-running the assessment recalculates recommendations and tasks; copying exports the visible checklist.

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

Verification: initial developer checks included `node --check`, the GitHub Pages deployment workflow, and an anonymous HTTP 200 response. Independent post-launch review also parsed the updated inline JavaScript successfully and exercised ranking for five different focus/time/budget/experience combinations: looks/5/free, looks/5/$25, fitness/5/free, style/15/$100, mindset/30/$25. Browser end-to-end interaction testing has **not** been completed; do not represent it as completed. Known limitations: small hand-authored dataset, no personalization beyond four inputs, local-only progress, and source hosts may block automated access.

## Prompt used

The actual product-building instruction was the complete user message for this task: build and publicly ship **THE UPGRADE ENGINE** for `https://looksmaxxing.guide/`, a functional, polished one-page decision engine rather than a generic landing page, fake chatbot, or static checklist. It specified the following product and delivery requirements:

> **Product vision:** “Stop rating yourself. Start improving.” Personalize actionable recommendations based on existing research-based guides.
>
> **Interactive assessment:** let visitors choose Looks/Grooming, Fitness, Style, or Mindset; daily time of 5, 15, or 30 minutes; spending of Free, Under $25, or Under $100; and Beginner or Intermediate experience.
>
> **Prioritization:** curate actionable recommendations and implement a real, deterministic ranking using user selections, time, budget, relevance, and practicality. Show the top three, explain why each was selected, and display estimated time, cost category, and source link. Include “What to skip for now” with tradeoffs. Do not invent scientific evidence, impact percentages, or fake AI scores.
>
> **Seven-day plan:** generate realistic daily tasks from priorities; provide functional checkboxes, progress bar, localStorage save/recovery, and copy/share as text. Changing assessment inputs must recalculate recommendations.
>
> **Evidence:** use and verify these supplied guide links: `https://looksmaxxing.guide/en/looks/looksmaxxing-for-beginners/`, `https://looksmaxxing.guide/en/style/mens-grooming-style-guide/`, `https://looksmaxxing.guide/en/style/capsule-wardrobe-men/`, `https://looksmaxxing.guide/en/fitness/beginner-strength-program/`, and `https://looksmaxxing.guide/en/fitness/sleep-optimization-guide/`. Show useful reasoning and limitations, not unsupported medical claims.
>
> **Design:** premium editorial high-end interface, modern restrained dark aesthetic, strong typography, polished responsive assessment and recommendation cards, accessible keyboard controls, thoughtful interactions and microcopy, and label the independent prototype so it cannot be mistaken for the official site.
>
> **Technical constraints:** prefer standalone HTML/CSS/JavaScript (or Vite and vanilla TypeScript only if materially better); no backend, authentication, paid APIs, secrets, or required external AI inference. AI should genuinely contribute to design/build, without representing the deterministic runtime ranking engine as a live LLM.
>
> **Publication:** create public GitHub repository `NemesisDevX/looksmaxxing-upgrade-engine`, commit and push source, deploy publicly with GitHub Pages (or a faster equivalent), and verify anonymous app access and key interactions. Preserve the repository URL even if deployment takes longer. Report public repository and demo URLs, what works, and tests actually passed.
>
> **Assessment README:** explain the problem and hypothesis, prioritization versus attractiveness ratings, algorithm and tradeoffs, deterministic engine versus live LLM, actual AI prompts, tests and limitations, and live URL.
>
> **Execution priorities:** ship working code early; prioritize ranking, usable UI, public repo, and deployed link; then the checklist, persistence, sources, responsive layout, and interaction checks; defer extra animation. Do not overengineer or sacrifice the public repository waiting for deployment.

No separate runtime AI prompt or inference prompt was used: the application is deterministic and has no LLM integration. The quoted requirements above preserve the actual build brief in concise form.

## Live demo

https://NemesisDevX.github.io/looksmaxxing-upgrade-engine/

## Iteration after independent review

An independent code review identified two concrete bugs in the first public version: all actions had zero cost, so the budget control could not change the shortlist; and checklist state used one global key, so completion leaked between different plans. The second commit added optional, explicitly priced actions, hard budget/time gates, per-plan persistence keys, varied seven-day tasks, reduced-motion styles, and progress accessibility semantics. These are engineering tradeoffs under time pressure, not claims of clinical efficacy or model-powered inference.
