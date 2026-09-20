---
name: skill-creator
description: "Trigger: new skill, agent instructions, reusable AI workflow. Create scoped project skills under the repository contract."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [root]
  auto_invoke:
    - "Creating or updating a reusable project skill"
    - "Documenting project-specific runtime instructions for agents"
---

## When to Create a Skill

Create a skill when:

- A pattern is used repeatedly and AI needs guidance.
- Project-specific conventions differ from generic best practices.
- Complex workflows need step-by-step instructions.
- Decision trees help AI choose the right approach.

**Do not create a skill when:**

- Documentation already exists; create a reference instead.
- The pattern is trivial or self-explanatory.
- It is a one-off task.

---

## Skill Structure

```text
skills/{skill-name}
├── SKILL.md          # Required: main skill file — metadata and instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: links to local documentation
│   └── docs.md
├── assets/           # Optional: templates and resources
└── ...               # Any additional files or directories
```

---

## SKILL.md Template

````markdown
---
name: {skill-name}
description: "Trigger: {when the AI should load this skill}. {One-line description of what this skill does}."
license: Apache-2.0
metadata:
  author: "nerdy-cloud"
  version: "1.0"
  scope: [root]
  auto_invoke:
    - "{Concrete task condition}"
---

## When to Use

{Bullet points describing when to use this skill}

## Critical Patterns

{The most important rules the AI must know}

## Code Examples

{Minimal, focused examples}

## Commands

```bash
{Common commands}
```

## Resources

- **Templates**: See [assets/](assets/) for {description}
- **Documentation**: See [references/](references/) for local documentation
- **Scripts**: See [scripts/](scripts/) for executable code
````

---

## Naming Conventions

| Type | Pattern | Examples |
| --- | --- | --- |
| Generic skill | `{technology}` | `pytest`, `playwright`, `typescript` |
| AH Ecosystem-specific | `ah-{component}` | `ah-api`, `ah-ui`, `ah-workflow` |
| Workflow skill | `{action}-{target}` | `skill-creator`, `skill-sync` |

---

## Decision: assets/ vs references/

```text
Need code templates?        → assets/
Need JSON schemas?          → assets/
Need example configs?       → assets/
Link to existing docs?      → references/
Link to external guides?    → references/ with a local path
```

## Key Rule

`references/` should point to local files, not web URLs. Every repository and workspace has its own documentation; ensure references resolve correctly.

## Decision: AH Ecosystem-Specific vs Generic

```text
Patterns apply to any project?       → Generic workspace skill, such as skill-sync or typescript
Patterns apply to one repository?    → Workspace-root skill scoped through metadata.scope
Patterns are AH Ecosystem-specific?  → ah-{name} skill
Generic skill needs AH information?  → Add references/ pointing to local AH documentation
```

---

## Frontmatter Fields

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Skill identifier in lowercase kebab-case |
| `description` | Yes | What the skill does and the trigger for loading it |
| `license` | Yes | `Apache-2.0` for AH Ecosystem skills |
| `metadata.author` | Yes | Repository-recognized skill author |
| `metadata.version` | Yes | Semantic version as a string |
| `metadata.scope` | Yes | Every catalog that should route to the skill |
| `metadata.auto_invoke` | Yes | Concrete conditions that activate the skill |

---

## Content Guidelines

### Do

- Start with the most critical patterns.
- Use tables for decision trees.
- Keep code examples minimal and focused.
- Include a Commands section with copy-paste commands when the workflow has commands.
- Keep reusable instructions in `SKILL.md` and move supporting material to the appropriate local directory.

### Do Not

- Add a Keywords section; agents search frontmatter, not the body.
- Duplicate content from existing documentation; reference it instead.
- Include lengthy explanations when a local reference is more appropriate.
- Add broad troubleshooting sections that obscure the core workflow.
- Use web URLs as the only references; point to local documentation.

---

## Registering the Skill

After creating or updating a workspace-root skill, preview skill synchronization so the correct `AGENTS.md` catalogs route to it:

```bash
./skills/skill-sync/scripts/sync.sh --dry-run
```

Inspect every proposed catalog change. Apply synchronization only when the requested catalogs and rendered rows are correct.

---

## Checklist Before Creating

- [ ] The skill does not already exist under `skills/`.
- [ ] The pattern is reusable rather than one-off.
- [ ] The name follows the naming conventions.
- [ ] Frontmatter is complete and the description includes trigger terms.
- [ ] Every intended catalog is declared in `metadata.scope`.
- [ ] Critical patterns are clear.
- [ ] Code examples are minimal.
- [ ] A Commands section exists when commands are part of the workflow.
- [ ] Local references resolve.
- [ ] Skill synchronization reports the expected catalog state.

## Resources

- **Canonical template**: Use the embedded `SKILL.md` template in this contract.
- **Optional starting asset**: See [assets/SKILL-TEMPLATE.md](assets/SKILL-TEMPLATE.md) and keep it aligned with this contract when used.
