# AGENTS.md

This file gives Aider (and any other AI coding agent) context about how
this project should be worked on. It's read automatically if
`.aider.conf.yml` in this folder has `read: AGENTS.md`.

## Who's building this

I'm a hobbyist, not a professional developer. I have no formal software
engineering background. I'm learning by directing an AI to build
increasingly complex apps, one concept at a time, as part of a
self-designed syllabus. I want to *understand* what's being built, not
just receive working code.

## How to work with me

- Explain what you're about to do, in plain English, before making
  changes — especially the *why*, not just the *what*. Keep this
  concise (2-6 sentences) unless I ask for a deeper explanation.
- When you're introducing a concept or technique for the first time in
  this project, briefly explain why it's needed and how it fits in.
  Assume curiosity, not prior knowledge.
- If there are multiple reasonable ways to implement something and
  they differ in architecture, dependencies, UX, or long-term
  maintainability, stop and ask rather than guessing at what I'd want.
- When you're making an assumption rather than acting on something I
  said directly, label it clearly as an assumption, not a fact.
- If you're not sure how a library, API, or framework actually
  behaves, say so plainly. Don't invent functions, parameters, or
  config values.
- After a change, tell me: what to run or click, what result to
  expect, and one edge case worth checking.
- If something I'm asking for seems like it needs a concept we
  haven't covered yet, say so plainly rather than quietly implementing
  something complex.

## Decision-Making

When multiple valid solutions exist:

- Prefer the simplest solution that satisfies the current
  requirements.
- Avoid designing for hypothetical future features I haven't asked
  for.
- If a decision would be difficult to reverse later, ask me first.
- If a decision is easy to change later, choose a sensible default and
  briefly explain your reasoning.

## Project conventions

Universal rules that apply no matter what I'm building. Anything
specific to *this* project (tech stack, file structure, data model,
what's in scope for this build) belongs in that project's PLAN.md, not
here — check for a PLAN.md first and follow it.

- Don't introduce a new library, framework, or architectural pattern
  without checking with me first, even if it's the "normal" choice for
  the situation. If PLAN.md doesn't call for it, ask before adding it.
- Favor clear, readable code and plain variable/function names over
  clever or condensed code.
- Light comments are welcome, especially explaining *why*, not just
  restating *what* the code does.
- Don't refactor, "clean up," or change things I didn't ask about in
  the same change as an unrelated feature.
- Commit after each working change, with a clear commit message.
- When working from a Build Order / milestone list (see PLAN.md),
  implement one step at a time. After finishing a step, stop, tell me
  what changed and how to verify it, and wait for my confirmation
  before starting the next one. Don't treat "start," "let's begin," or
  similar as permission to continue through the rest of the list on
  your own — I'll say explicitly if I want more than one step done in
  a single pass.
- Check for a PROGRESS.md at the start of a session. If it exists,
  read it (along with PLAN.md) before making changes, so you know
  what's already built and how, without me having to re-explain it.
- After finishing a Build Order step, or any change worth remembering,
  add an entry to PROGRESS.md summarizing what was implemented and
  how. If there was a genuine choice between approaches — especially
  if you tried something that didn't work before landing on what did —
  note what else was considered and why it was rejected; skip that
  part for mechanical steps with no real decision involved. Then
  update the "Current state" line at the top of that file. If
  PROGRESS.md doesn't exist yet, create it from the template.

## My setup

- Windows 11, RTX 5090 laptop GPU (24GB VRAM)
- Local model served via llama.cpp (`llama-server.exe`) on
  `http://127.0.0.1:8080/v1`
- Aider is configured via `.aider.conf.yml` to use this local server —
  no internet-based model calls
- Planning conversations (before building) happen separately in Open
  WebUI, not in Aider
- No package installs that require internet access beyond what's
  already set up locally

## What "done" looks like

- The app does what was asked, and I've personally verified it works
  by using it, not just by it "looking right" in the diff
- I can explain back, in my own words, what the new code does
- Nothing was added that wasn't asked for
