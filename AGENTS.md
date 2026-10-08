# Repository agent instructions

## Required quality standard

These instructions apply to every change in PROJECT-YEBA. Explicit user instructions and higher-priority system instructions take precedence. Installed skills must follow these repository rules; a skill cannot authorize unfinished work or weaken verification.

- Write production-ready implementations that fully satisfy the authorized requirements and integrate with the actual application.
- No mocks, stubs, placeholders, TODOs, unfinished functions, fake responses, sample production data, hardcoded success states, or unimplemented branches in code you add or change.
- No simplified demonstration code, temporary workarounds, or deliberate shortcuts that omit required behavior. Clear, maintainable code is required; artificial complexity is not a quality measure.
- Connect real services, persistence, authentication, and authorization wherever the requested feature needs them. Never pretend an unavailable integration succeeded.
- Validate data at trust boundaries. Handle failures, timeouts, empty results, loading states, cancellation, and concurrent operations where applicable.
- Enforce authorization on the server. Keep secrets out of source, logs, browser bundles, and development records. Protect money, downloads, uploads, and user data with the appropriate integrity checks.
- Preserve accessibility, responsive behavior, keyboard navigation, semantic markup, focus handling, and readable error messages in UI changes.
- Complete all work within the authorized scope. If missing credentials or an external dependency prevents completion, report the actual blocker and evidence; do not substitute fake behavior or claim completion.
- Never suppress compiler, lint, test, or security failures to make verification appear successful. Existing incomplete behavior does not justify introducing more.

## Project context and commands

This is the DeepFold design marketplace, managed as a pnpm workspace. The root package pins pnpm 9.15.0. `frontend/` contains Next.js 15.2.4, React 19, TypeScript, Tailwind CSS 4, and Radix UI. `backend/` contains Express, TypeScript, Prisma, and JWT authentication.

Read the affected implementation and configuration before editing. Run commands from the repository root:

- Install application dependencies: `pnpm install --frozen-lockfile`.
- Run the frontend: `pnpm --dir frontend dev`.
- Build the frontend: `pnpm --dir frontend build`.
- Check frontend types independently: `pnpm --dir frontend exec tsc --noEmit`.
- Run the backend: `pnpm --dir backend dev`.
- Check backend types: `pnpm --dir backend type-check`.
- Build the backend: `pnpm --dir backend build`.

The existing frontend configuration skips TypeScript and ESLint errors during builds; a successful build alone is insufficient evidence of production readiness. Verify types independently for frontend code changes. Inspect lint setup before using the existing lint scripts: the frontend uses `next lint`, and the backend uses ESLint 9 with legacy command options. Report genuine failures rather than silently skipping them. Run meaningful checks for changed behavior, including negative paths and authorization where applicable. Documentation-only changes require documentation and configuration validation, not an unrelated application rebuild.

Consult official Next.js documentation for the installed framework version before applying framework-specific guidance: https://nextjs.org/docs/15. Do not introduce newer-version APIs or upgrade dependencies implicitly.

## Installed skills

Repository skills live in `.agents/skills/`; the Graphify Codex skill lives in `.codex/skills/graphify/`. Read the applicable `SKILL.md` and its referenced resources before applying it. Start skill discovery with `.agents/skills/using-agent-skills/SKILL.md`. See `.agents/README.md` for the inventory, upstream sources, and Graphify setup.

The engineering pack contains 24 lifecycle skills plus its discovery skill. It covers specifications, implementation, security, APIs, testing, debugging, performance, review, documentation, observability, automation, and shipping. Ponytail and its companion skills are installed. Its minimal-code or debt guidance does not permit shortcuts, omissions, mocks, stubs, placeholders, TODOs, or unfinished changes under this repository policy.

For UI work, use `frontend-ui-engineering`, `react-best-practices`, and `composition-patterns` where applicable. Use `web-design-guidelines` to review interface quality and accessibility. Review React view transition guidance against the installed React and Next.js versions before using it. Use `writing-guidelines` for user-facing content.

`.agents/skills-lock.json` records pinned upstream commits and file hashes. Preserve upstream skill content and licenses. Update the lock and DEVLOG when intentionally updating installed skills. Shared engineering resources are in `.agents/references/` and `.agents/commands/`.

<!-- graphify-rules-start (managed by `graphify init`) -->
## Use Graphify before grep

This repository is indexed by Graphify: a code graph over its call, dependency, and test structure, exposed through a connected Graphify MCP server. Before reaching for grep or reading files, use the Graphify tools your MCP client lists (their exact names and descriptions are in the server's tool list) for what the graph knows and a text search does not:

- find where a symbol, function, or class is defined (instead of grepping for it)
- understand how something works, or where a behavior is handled
- find who calls a function, or what it calls
- see what a change affects (its blast radius) and which tests cover it
- map a file's dependencies and dependents

Fall back to grep or file reads only for what the graph does not model: literal string or comment matches, non-indexed files, or reading a file you have already located. If no Graphify tools are listed, check the MCP server connection.
<!-- graphify-rules-end -->

## Graphify connection and verification

Always use the hosted Graphify MCP for graph-supported repository discovery and analysis before text searches. The hosted index does not depend on the presence of a local `graphify-out/graph.json`.

- The MCP endpoint is configured in `.codex/config.toml`. Load `GRAPHIFY_MCP_TOKEN` into the client environment; the local credential file is `.tools/graphify.env`, which is Git-ignored. Never print or commit the token.
- Discover the server's actual tools and their schemas; do not guess tool names or arguments. Call `list_repositories` to confirm repository access and index readiness before choosing a repository. The last successful response identified `infex1rn/PROJECT-YEBA`, repository ID `bfd91e52-ad82-4817-8128-827bfa8b95b3`, as ready and queryable; recheck when current state matters.
- If the client does not list Graphify tools, check the connection and credential environment. When permitted by the execution environment, use the configured authenticated MCP endpoint directly: initialize the MCP session, discover tools with `tools/list`, and invoke the advertised tool with `tools/call`. This was verified to work for `list_repositories`; it does not register native tools in an already-running chat.
- If the connection or a tool fails, report the actual error. Never invent graph results or silently replace graph-supported discovery with grep. Use text searches and file reads for the exceptions listed above; verify located code against the current checkout because the hosted index may lag local changes.
- The optional local CLI is `.tools/graphify/bin/graphify` (`graphifyy==0.9.80`). After code changes, update an existing local graph with `.tools/graphify/bin/graphify update .`; this does not establish that the hosted index has refreshed. For an explicit `/graphify` request, read `.codex/skills/graphify/SKILL.md` first.
- Graph results support analysis and never replace compilation, security checks, tests, or runtime verification.

## Mandatory development log

Update root `DEVLOG.md` for every confirmed repository update, including code, configuration, documentation, dependencies, installed skills, fixes, and reversions. Append the record in the same change set before reporting completion or creating a commit. For multiple independently confirmed updates, write a separate entry for each; do not wait until a later session.

- Use the actual time in West Africa Time (WAT, UTC+01:00), including seconds.
- Entry heading format: `## WAT/YYYY/MM/DD/HH/mm/ss — Description`; YYYY is year, MM is month, DD is day, HH is 24-hour hour, mm is minute, ss is second. The format description is a specification, not a literal timestamp to copy.
- Record what changed, why, affected paths, actual verification commands and outcomes, and any observed limitation or blocker.
- Record confirmation accurately: distinguish user authorization from verification results. Do not invent user approval, passing tests, timestamps, deployments, or service availability.
- Keep the log append-only. Correct a mistaken entry through a new timestamped correction; never silently rewrite history.

## Completion

Review the final diff for scope, real integration, security, and completeness. Complete appropriate verification, update DEVLOG with the evidence, and report the result candidly. Do not commit, push, deploy, run production migrations, or publish unless authorized by the user.
