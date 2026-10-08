# Repository skills and tools

37 skills are installed locally: 36 under `.agents/skills/` and Graphify under `.codex/skills/graphify/`. These files travel with the repository. Read root `AGENTS.md` for the mandatory production readiness and DEVLOG rules. New skills are available to the agent on the next turn; restart the client if its catalog is cached.

## Sources

- Ponytail and five companion skills: https://github.com/DietrichGebert/ponytail
- 24 engineering lifecycle skills plus discovery: https://github.com/addyosmani/agent-skills
- Web design guidelines, React best practices, composition patterns, React view transitions, and writing guidelines: https://github.com/vercel-labs/agent-skills
- Graphify CLI and Codex skill: https://github.com/Graphify-Labs/graphify

Exact commits and installed file SHA-256 hashes are recorded in `skills-lock.json`. Shared engineering references and commands live in `references/` and `commands/`. Upstream licenses live in `upstream/`; Graphify licensing is also included there. Skills remain upstream copies. Repository instructions override skill guidance that conflicts with the user's requirements.

## Installed shared skills

- `api-and-interface-design`
- `browser-testing-with-devtools`
- `ci-cd-and-automation`
- `code-review-and-quality`
- `code-simplification`
- `composition-patterns`
- `constraint-driven-development`
- `context-engineering`
- `debugging-and-error-recovery`
- `deprecation-and-migration`
- `documentation-and-adrs`
- `doubt-driven-development`
- `frontend-ui-engineering`
- `git-workflow-and-versioning`
- `idea-refine`
- `incremental-implementation`
- `interview-me`
- `observability-and-instrumentation`
- `performance-optimization`
- `planning-and-task-breakdown`
- `ponytail`
- `ponytail-audit`
- `ponytail-debt`
- `ponytail-gain`
- `ponytail-help`
- `ponytail-review`
- `react-best-practices`
- `react-view-transitions`
- `security-and-hardening`
- `shipping-and-launch`
- `source-driven-development`
- `spec-driven-development`
- `test-driven-development`
- `using-agent-skills`
- `web-design-guidelines`
- `writing-guidelines`

## Graphify local CLI

The isolated runtime is ignored by Git. Recreate it on another machine from the repository root with Python 3.14 (the version used for the resolved dependency list):

```bash
python3.14 -m venv .tools/graphify
.tools/graphify/bin/python -m pip install -r .agents/graphify-requirements.txt
.tools/graphify/bin/graphify --version
```

The official CLI registered the project skill using `graphify install --project --platform codex`. Re-running that installer can rewrite its generated AGENTS section and hook command; review those changes against the repository policy. Run `.tools/graphify/bin/graphify` directly, or add its bin directory to PATH in your current shell. No graph has been generated as part of setup.

## Graphify hosted MCP

`.codex/config.toml` points to the supplied hosted endpoint. Its credential comes from `GRAPHIFY_MCP_TOKEN`, using the supported bearer environment setting described in [official OpenAI documentation](https://developers.openai.com/codex/mcp).

The provided credential is stored only on this machine in Git-ignored `.tools/graphify.env`, with owner-only permissions. It is not included in tracked configuration, skill hashes, or DEVLOG. From the repository root, start a new Codex CLI session with:

```bash
source .tools/graphify.env
codex
```

For an IDE client, supply `GRAPHIFY_MCP_TOKEN` in the environment that launches the client, then restart it. On another machine, provision that environment variable through your secret manager. Local repository configuration cannot add tools to an already-running hosted chat; hosted clients require their supported connector or plugin configuration.
