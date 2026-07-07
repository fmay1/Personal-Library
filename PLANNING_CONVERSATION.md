# PLAN.md

**What I'm building:** [A personal library/inventory tracker — add, view, and delete items in a collection, with data stored in a real database accessed through a backend server]

**What this project is meant to teach me:** [Splitting an app into a frontend and backend that talk over HTTP, and storing data in a real database instead of browser storage]

**Explicit constraints:** [Single user, no accounts or login; no external APIs (e.g. fetching book covers); no image uploads; keep the stack to Node.js, Express, and SQLite — nothing else without checking in first]

---

## Instructions for the AI (read this first)

We're planning a project before any code gets written. Your job in
this conversation is to help me fill in every section below with
concrete, specific decisions — not vague placeholders.

- Ask me one clarifying question at a time when something is
  ambiguous. Aim to fully resolve each section before moving on, but
  if a later section is genuinely needed to answer an earlier one
  (e.g. you can't name a storage key until the data model is settled),
  note that dependency and circle back before producing the final
  PLAN.md — don't force a premature answer just to move on.
- Before proposing a solution, ask yourself: "Is this introducing a
  concept beyond what's described in 'What this project is meant to
  teach me'?" If yes, simplify it, or explicitly flag it and ask for
  my approval before proceeding.
- Push back if I (or you) suggest something more complex than what's
  described above. Simpler is correct unless there's a real reason not
  to be.
- If something I ask for clearly goes beyond what's described there
  (e.g. I start asking for user accounts in a project scoped as
  browser-only), say so plainly rather than quietly building it
  anyway — I may be scope-creeping without noticing.
- At the end of this conversation, output the ENTIRE completed plan,
  every section filled in, in a single markdown code block — starting
  from "## 1. Overview" onward. Do not include this "Instructions for
  the AI" section in that output; it's guidance for this conversation,
  not part of the plan itself. I'll save that code block directly as
  PLAN.md, so it needs to be complete and self-contained on its own.

---

## 1. Overview

- App name:
- One-sentence description:
- Concept(s) this reinforces:

## 2. Learning Boundary

This project should primarily teach:

-

Things the AI should avoid introducing unless I explicitly approve
them (e.g. dependency injection, an ORM, authentication, async
patterns, websockets, background workers — whatever's beyond this
project's stated scope):

-

## 3. Core Features (MVP)

List only what this version needs to do. Be specific — "users can
edit an existing entry" not "basic editing."

-

## 4. Data Model

For each type of "thing" this app stores:

- Entity name:
  - Purpose (one sentence):
  - Fields (name + type):
  - Relationships to other entities (or "none"):
  - Validation rules (or "none"):

## 5. Assumptions

Things we're assuming to be true unless we discover otherwise (e.g.
single user, desktop only, always online, English only):

-

## 6. Storage & Persistence

- Where does data live? (browser storage / server database / file /
  nowhere — in-memory only)
- What's the exact mechanism? (e.g., the specific localStorage key
  name, or database table names and columns)

## 7. Architecture

- Files/modules expected, and the responsibility of each:
- How data flows between them (if there's more than one piece):

## 8. Tech Stack

List every language, library, and tool this project will use, and a
one-line reason for each. Nothing outside this list gets added without
checking in first (see AGENTS.md).

-

## 9. Key User Flows

Walk through, step by step, what a person does and what they see, for
each core feature listed in Section 3.

-

## 10. Edge Cases & Error Handling

What could go wrong or happen unexpectedly, and what should the app do
instead? Think about things like: empty or missing input, duplicate
entries, unusually long text, special characters, storage running
full, an action interrupted partway through. Not every app needs all
of these considered — just the ones that are actually plausible here.

-

## 11. Simplicity Rules

Unless there's a specific, stated reason otherwise:

- Use the fewest moving parts that solve the problem.
- Avoid introducing new libraries.
- Avoid abstractions before they're needed.
- Prefer explicit code over clever code.
- Prefer one straightforward implementation over a generic or
  reusable one.

## 12. Out of Scope (For This Build)

Things explicitly NOT being built in this version, even if related or
tempting to add, and why. Good candidates for later solo challenges.

-

## 13. Future Ideas

Interesting ideas that came up while planning but aren't decisions —
just a parking lot so brainstorming doesn't quietly turn into scope.

-

## 14. Build Order

Milestone-sized steps, layered from simplest to most complex (e.g.
project structure → data model → storage → display → editing →
validation → polish).

Each step must:
- Say exactly what will exist and work by the end of it — reference
  the specific fields, functions, or behaviors already decided
  elsewhere in this document rather than restating them vaguely.
- Be small enough to be one logical commit.
- Be an independent stopping point: somewhere I can pause, verify the
  step actually works, and decide whether to continue, before the
  agent moves on (see AGENTS.md — steps get implemented one at a time
  unless I say otherwise).

1.

## 15. Open Questions

Questions intentionally left unresolved because they don't block the
first implementation — not the same as Future Ideas; these are
decisions we're deliberately deferring, not extra features.

-

## 16. Decisions Log

Notes on any judgment calls made during this planning conversation, and
the reasoning behind them — useful to look back on later.

-

## 17. Success Criteria

How will I know this is actually done and working, beyond "it looks
right"?

-

## 18. Acceptance Tests

A concrete checklist to run through by hand once it's built. Include
the happy-path flows from Section 9 and the edge cases from Section 10
that matter most.

- [ ]
- [ ]
- [ ]

## 19. What I Should Be Able to Explain Afterward

By the end of this project, I should be able to explain, in my own
words:

-
