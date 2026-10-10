#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
sync_script="$script_dir/../scripts/sync.sh"
test_root="$(mktemp -d "${TMPDIR:-/tmp}/skill-sync-test.XXXXXX")"
real_cp="$(command -v cp)"
trap 'rm -rf -- "$test_root"' EXIT

output=""
status=0

run_capture() {
  set +e
  output="$({ "$@"; } 2>&1)"
  status=$?
  set -e
}

assert_status() {
  [[ "$status" -eq "$1" ]] || {
    printf 'Expected status %s, got %s:\n%s\n' "$1" "$status" "$output" >&2
    exit 1
  }
}

assert_contains() {
  case "$1" in
    *"$2"*) ;;
    *) printf 'Expected value to contain %s:\n%s\n' "$2" "$1" >&2; exit 1 ;;
  esac
}

assert_not_contains() {
  case "$1" in
    *"$2"*) printf 'Expected value not to contain %s:\n%s\n' "$2" "$1" >&2; exit 1 ;;
    *) ;;
  esac
}

workspace="$test_root/workspace"
mkdir -p "$workspace/skills/skill-sync/scripts" "$workspace/skills/z-source" "$workspace/skills/a-source" "$workspace/skills/api-alpha-source" "$workspace/skills/api-zeta-source" "$workspace/skills/web-source" "$workspace/apps/halisco-landing" "$workspace/apps/api" "$workspace/apps/no-markers" "$workspace/apps/web-app"
"$real_cp" "$sync_script" "$workspace/skills/skill-sync/scripts/sync.sh"

cat > "$workspace/AGENTS.md" <<'EOF'
# Root guide
Before root marker.
<!-- skill-sync:start -->
stale root table
<!-- skill-sync:end -->
After root marker.
EOF

cat > "$workspace/apps/halisco-landing/AGENTS.md" <<'EOF'
# Halisco guide
Before nested marker.
<!-- skill-sync:start -->
stale nested table
<!-- skill-sync:end -->
After nested marker.
EOF

cat > "$workspace/apps/api/AGENTS.md" <<'EOF'
# API guide
Before API marker.
<!-- skill-sync:start -->
stale API table
<!-- skill-sync:end -->
After API marker.
EOF

cat > "$workspace/apps/no-markers/AGENTS.md" <<'EOF'
# No markers guide
Nothing managed here.
EOF
"$real_cp" "$workspace/apps/no-markers/AGENTS.md" "$test_root/no-markers-original"

cat > "$workspace/apps/web-app/AGENTS.md" <<'EOF'
# Web app guide
Before web marker.
<!-- skill-sync:start -->
stale web table
<!-- skill-sync:end -->
After web marker.
EOF

cat > "$workspace/skills/web-source/SKILL.md" <<'EOF'
---
name: web-skill
description: "Trigger: web app work."
metadata:
  scope: [web-app]
---
EOF

cat > "$workspace/skills/z-source/SKILL.md" <<'EOF'
---
name: alpha-skill
description: >
  Trigger: alpha work.
  Folded description.
metadata:
  scope: [root, "halisco-landing"]
---
EOF

cat > "$workspace/skills/a-source/SKILL.md" <<'EOF'
---
name: zeta-skill
description: 'Trigger: zeta work. Quoted description.'
metadata:
  scope:
    - root
---
EOF

cat > "$workspace/skills/api-alpha-source/SKILL.md" <<'EOF'
---
name: api-alpha-skill
description: "Trigger: API alpha work."
metadata:
  scope: [api]
---
EOF

cat > "$workspace/skills/api-zeta-source/SKILL.md" <<'EOF'
---
name: api-zeta-skill
description: >
  Trigger: API zeta work.
  Folded description.
metadata:
  scope:
    - api
---
EOF

run_capture "$workspace/skills/skill-sync/scripts/sync.sh" --dry-run --scope unsupported
assert_status 2
assert_contains "$output" "unknown scope 'unsupported'"

run_capture "$workspace/skills/skill-sync/scripts/sync.sh" --dry-run --scope no-markers
assert_status 2
assert_contains "$output" "unknown scope 'no-markers'"

run_capture "$workspace/skills/skill-sync/scripts/sync.sh" --dry-run
assert_status 0
assert_contains "$output" 'Scopes: root api halisco-landing web-app'
assert_contains "$output" 'Would update: apps/web-app/AGENTS.md'
assert_contains "$output" '[SKILL.md](../../skills/web-skill/SKILL.md)'
assert_not_contains "$output" 'no-markers/AGENTS.md'
assert_contains "$output" 'Would update: AGENTS.md'
assert_contains "$output" 'Would update: apps/halisco-landing/AGENTS.md'
assert_contains "$output" 'Would update: apps/api/AGENTS.md'
assert_contains "$output" '[SKILL.md](skills/alpha-skill/SKILL.md)'
assert_contains "$output" '[SKILL.md](../../skills/alpha-skill/SKILL.md)'
assert_contains "$output" '[SKILL.md](../../skills/api-alpha-skill/SKILL.md)'
assert_not_contains "$output" '../../skills/zeta-skill/SKILL.md'

run_capture "$workspace/skills/skill-sync/scripts/sync.sh" --dry-run --scope api
assert_status 0
assert_contains "$output" 'Scopes: api'
assert_contains "$output" 'Would update: apps/api/AGENTS.md'
assert_not_contains "$output" 'Would update: AGENTS.md'
assert_not_contains "$output" 'Would update: apps/halisco-landing/AGENTS.md'

run_capture "$workspace/skills/skill-sync/scripts/sync.sh"
assert_status 0
root_catalog="$(<"$workspace/AGENTS.md")"
nested_catalog="$(<"$workspace/apps/halisco-landing/AGENTS.md")"
api_catalog="$(<"$workspace/apps/api/AGENTS.md")"
assert_contains "$root_catalog" 'Before root marker.'
assert_contains "$root_catalog" 'After root marker.'
assert_contains "$nested_catalog" 'Before nested marker.'
assert_contains "$nested_catalog" 'After nested marker.'
assert_contains "$root_catalog" 'Trigger: alpha work. Folded description.'
assert_contains "$root_catalog" '[SKILL.md](skills/zeta-skill/SKILL.md)'
assert_contains "$nested_catalog" '[SKILL.md](../../skills/alpha-skill/SKILL.md)'
assert_not_contains "$nested_catalog" 'zeta-skill'
assert_contains "$api_catalog" 'Before API marker.'
assert_contains "$api_catalog" 'After API marker.'
assert_contains "$api_catalog" '[SKILL.md](../../skills/api-alpha-skill/SKILL.md)'
assert_contains "$api_catalog" 'Trigger: API zeta work. Folded description.'
web_catalog="$(<"$workspace/apps/web-app/AGENTS.md")"
assert_contains "$web_catalog" 'Before web marker.'
assert_contains "$web_catalog" '[SKILL.md](../../skills/web-skill/SKILL.md)'
assert_not_contains "$web_catalog" 'alpha-skill'
assert_not_contains "$root_catalog" 'web-skill'
cmp -s "$workspace/apps/no-markers/AGENTS.md" "$test_root/no-markers-original"
assert_not_contains "$root_catalog" 'api-alpha-skill'
assert_not_contains "$root_catalog" 'api-zeta-skill'
assert_not_contains "$nested_catalog" 'api-alpha-skill'
assert_not_contains "$nested_catalog" 'api-zeta-skill'
case "$root_catalog" in
  *'`alpha-skill`'*'`zeta-skill`'*) ;;
  *) printf 'Skills are not sorted by name:\n%s\n' "$root_catalog" >&2; exit 1 ;;
esac
case "$api_catalog" in
  *'`api-alpha-skill`'*'`api-zeta-skill`'*) ;;
  *) printf 'API skills are not sorted by name:\n%s\n' "$api_catalog" >&2; exit 1 ;;
esac

"$real_cp" "$workspace/AGENTS.md" "$test_root/root-after-first-apply"
"$real_cp" "$workspace/apps/halisco-landing/AGENTS.md" "$test_root/nested-after-first-apply"
"$real_cp" "$workspace/apps/api/AGENTS.md" "$test_root/api-after-first-apply"
run_capture "$workspace/skills/skill-sync/scripts/sync.sh" --dry-run
assert_status 0
assert_contains "$output" 'Changed files: 0'
cmp -s "$workspace/AGENTS.md" "$test_root/root-after-first-apply"
cmp -s "$workspace/apps/halisco-landing/AGENTS.md" "$test_root/nested-after-first-apply"
cmp -s "$workspace/apps/api/AGENTS.md" "$test_root/api-after-first-apply"

mkdir -p "$workspace/skills/invalid-scope"
cat > "$workspace/skills/invalid-scope/SKILL.md" <<'EOF'
---
name: invalid-scope
description: "Trigger: invalid metadata."
metadata:
  scope: [root, unsupported]
---
EOF
run_capture "$workspace/skills/skill-sync/scripts/sync.sh"
assert_status 2
assert_contains "$output" "unknown scope 'unsupported'"
cmp -s "$workspace/AGENTS.md" "$test_root/root-after-first-apply"
cmp -s "$workspace/apps/halisco-landing/AGENTS.md" "$test_root/nested-after-first-apply"
cmp -s "$workspace/apps/api/AGENTS.md" "$test_root/api-after-first-apply"
rm -rf -- "$workspace/skills/invalid-scope"

mkdir -p "$workspace/skills/markerless-scope"
cat > "$workspace/skills/markerless-scope/SKILL.md" <<'EOF'
---
name: markerless-scope
description: "Trigger: scope without markers."
metadata:
  scope: [no-markers]
---
EOF
run_capture "$workspace/skills/skill-sync/scripts/sync.sh"
assert_status 2
assert_contains "$output" "unknown scope 'no-markers'"
rm -rf -- "$workspace/skills/markerless-scope"

cat > "$workspace/skills/z-source/SKILL.md" <<'EOF'
---
name: alpha-skill
description: "Trigger: alpha work. Changed for rollback."
metadata:
  scope: [root, halisco-landing]
---
EOF
fake_bin="$test_root/fake-bin"
mkdir -p "$fake_bin"
cat > "$fake_bin/cp" <<'EOF'
#!/usr/bin/env bash
if [[ "${2:-}" == */updated-halisco-landing && "${3:-}" == */apps/halisco-landing/AGENTS.md ]]; then
  exit 73
fi
exec "$REAL_CP" "$@"
EOF
chmod +x "$fake_bin/cp"

run_capture env PATH="$fake_bin:$PATH" REAL_CP="$real_cp" "$workspace/skills/skill-sync/scripts/sync.sh"
[[ "$status" -ne 0 ]] || { printf 'Expected injected apply failure\n' >&2; exit 1; }
assert_contains "$output" 'apply failed:'
assert_contains "$output" 'Rolled back: AGENTS.md'
cmp -s "$workspace/AGENTS.md" "$test_root/root-after-first-apply"
cmp -s "$workspace/apps/halisco-landing/AGENTS.md" "$test_root/nested-after-first-apply"
cmp -s "$workspace/apps/api/AGENTS.md" "$test_root/api-after-first-apply"

printf 'skill-sync tests: PASS\n'
