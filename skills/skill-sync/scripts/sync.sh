#!/usr/bin/env bash
# Upstream source: https://github.com/prowler-cloud/prowler/tree/master/skills/skill-sync
# Upstream author: prowler-cloud
# License: Apache-2.0

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: sync.sh [--dry-run] [--scope root|halisco-landing|api]

Discover workspace skills, validate metadata.scope, and update only the managed
Skills tables in the selected AGENTS.md files.
EOF
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 2
}

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
workspace_root="$(cd -- "$script_dir/../../.." && pwd -P)"
skills_dir="$workspace_root/skills"
dry_run=false
selected_scope=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      dry_run=true
      ;;
    --scope)
      [[ $# -ge 2 ]] || fail "--scope requires a value"
      [[ -z "$selected_scope" ]] || fail "--scope may be provided only once"
      selected_scope="$2"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "unknown option: $1"
      ;;
  esac
  shift
done

case "$selected_scope" in
  ""|root|halisco-landing|api) ;;
  *) fail "unknown scope '$selected_scope'; expected root, halisco-landing, or api" ;;
esac

agents_path() {
  case "$1" in
    root) printf '%s/AGENTS.md\n' "$workspace_root" ;;
    halisco-landing) printf '%s/apps/halisco-landing/AGENTS.md\n' "$workspace_root" ;;
    api) printf '%s/apps/api/AGENTS.md\n' "$workspace_root" ;;
    *) return 1 ;;
  esac
}

catalog_path() {
  local scope="$1"
  local skill_name="$2"
  case "$scope" in
    root) printf 'skills/%s/SKILL.md\n' "$skill_name" ;;
    halisco-landing) printf '../../skills/%s/SKILL.md\n' "$skill_name" ;;
    api) printf '../../skills/%s/SKILL.md\n' "$skill_name" ;;
    *) return 1 ;;
  esac
}

extract_field() {
  local file="$1"
  local field="$2"
  awk -v field="$field" '
    BEGIN { in_frontmatter = 0 }
    NR == 1 && $0 == "---" { in_frontmatter = 1; next }
    in_frontmatter && $0 == "---" { exit }
    in_frontmatter && $0 ~ ("^" field ":[[:space:]]*") {
      value = $0
      sub("^" field ":[[:space:]]*", "", value)
      if (value == ">" || value == "|") {
        output = ""
        while (getline line) {
          if (line !~ /^[[:space:]]+/) break
          sub(/^[[:space:]]+/, "", line)
          output = output (output == "" ? "" : " ") line
        }
        print output
      } else {
        print value
      }
      exit
    }
  ' "$file" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//" -e 's/[[:space:]][[:space:]]*/ /g' -e 's/[[:space:]]*$//'
}

extract_scopes() {
  local file="$1"
  awk '
    BEGIN { in_frontmatter = 0; in_metadata = 0 }
    NR == 1 && $0 == "---" { in_frontmatter = 1; next }
    in_frontmatter && $0 == "---" { exit }
    in_frontmatter && /^metadata:[[:space:]]*$/ { in_metadata = 1; next }
    in_metadata && /^[^[:space:]]/ { in_metadata = 0 }
    in_metadata && /^[[:space:]]+scope:[[:space:]]*/ {
      value = $0
      sub(/^[[:space:]]+scope:[[:space:]]*/, "", value)
      if (value != "") {
        print value
        exit
      }
      output = ""
      while (getline line) {
        if (line ~ /^---$/ || line ~ /^[^[:space:]]/) break
        if (line ~ /^[[:space:]]*-[[:space:]]*/) {
          sub(/^[[:space:]]*-[[:space:]]*/, "", line)
          output = output (output == "" ? "" : " ") line
        } else if (line ~ /^[[:space:]]+[A-Za-z0-9_-]+:[[:space:]]*/) {
          break
        }
      }
      print output
      exit
    }
  ' "$file"
}

escape_cell() {
  printf '%s' "$1" | sed 's/|/\\|/g'
}

temporary_dir="$(mktemp -d "${TMPDIR:-/tmp}/skill-sync.XXXXXX")"
trap 'rm -rf -- "$temporary_dir"' EXIT
skill_list="$temporary_dir/skill-list"
metadata="$temporary_dir/metadata"
: > "$skill_list"
: > "$metadata"

shopt -s nullglob
for skill_file in "$skills_dir"/*/SKILL.md; do
  printf '%s\n' "$skill_file" >> "$skill_list"
done
LC_ALL=C sort -o "$skill_list" "$skill_list"
[[ -s "$skill_list" ]] || fail "no skills found under $skills_dir"

seen_names="$temporary_dir/seen-names"
: > "$seen_names"
while IFS= read -r skill_file; do
  name="$(extract_field "$skill_file" name)"
  description="$(extract_field "$skill_file" description)"
  raw_scopes="$(extract_scopes "$skill_file")"

  [[ -n "$name" ]] || fail "missing name: $skill_file"
  [[ "$name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || fail "invalid skill name '$name': $skill_file"
  [[ -n "$description" ]] || fail "missing description: $skill_file"
  [[ -n "$raw_scopes" ]] || fail "missing metadata.scope: $skill_file"
  if grep -Fqx -- "$name" "$seen_names"; then
    fail "duplicate skill name '$name'"
  fi
  printf '%s\n' "$name" >> "$seen_names"

  normalized_scopes=""
  scope_tokens="$(printf '%s' "$raw_scopes" | tr '[],' '   ')"
  for parsed_scope in $scope_tokens; do
    parsed_scope="${parsed_scope#\"}"
    parsed_scope="${parsed_scope%\"}"
    parsed_scope="${parsed_scope#\'}"
    parsed_scope="${parsed_scope%\'}"
    case "$parsed_scope" in
      root|halisco-landing|api) ;;
      *) fail "unknown scope '$parsed_scope' in $skill_file" ;;
    esac
    case "|$normalized_scopes|" in
      *"|$parsed_scope|"*) fail "duplicate scope '$parsed_scope' in $skill_file" ;;
    esac
    normalized_scopes="${normalized_scopes:+$normalized_scopes|}$parsed_scope"
  done
  [[ -n "$normalized_scopes" ]] || fail "metadata.scope has no values: $skill_file"
  printf '%s\t%s\t%s\t%s\n' "$name" "$description" "$normalized_scopes" "$skill_file" >> "$metadata"
done < "$skill_list"
LC_ALL=C sort -t $'\t' -k1,1 -o "$metadata" "$metadata"

build_table() {
  local scope="$1"
  local output="$2"
  local rows="$temporary_dir/rows-$scope"
  local name description skill_scopes skill_file path
  : > "$rows"

  while IFS=$'\t' read -r name description skill_scopes skill_file; do
    case "|$skill_scopes|" in
      *"|$scope|"*)
        path="$(catalog_path "$scope" "$name")"
        printf '%s\t%s\t%s\n' "$name" "$description" "$path" >> "$rows"
        ;;
    esac
  done < "$metadata"

  {
    printf '| **Skill** | **Triggers** | **Path** |\n'
    printf '| --- | --- | --- |\n'
    while IFS=$'\t' read -r name description path; do
      printf '| `%s` | %s | [SKILL.md](%s) |\n' "$name" "$(escape_cell "$description")" "$path"
    done < "$rows"
  } > "$output"
}

replace_managed_table() {
  local source="$1"
  local table="$2"
  local output="$3"
  local marker_counts
  marker_counts="$(awk '
    /<!--[[:space:]]*skill-sync:start[[:space:]]*-->/ { start++ }
    /<!--[[:space:]]*skill-sync:end[[:space:]]*-->/ { end++ }
    END { print start + 0, end + 0 }
  ' "$source")"
  [[ "$marker_counts" == "1 1" ]] || fail "expected one managed Skills table marker pair: $source"

  awk -v table="$table" '
    /<!--[[:space:]]*skill-sync:start[[:space:]]*-->/ {
      print
      while ((getline line < table) > 0) print line
      close(table)
      managed = 1
      next
    }
    /<!--[[:space:]]*skill-sync:end[[:space:]]*-->/ {
      managed = 0
      print
      next
    }
    !managed { print }
  ' "$source" > "$output"
}

validate_rendered_catalog() {
  local rendered="$1"
  local table="$2"
  local verification="$3"

  replace_managed_table "$rendered" "$table" "$verification"
  cmp -s "$rendered" "$verification" || fail "rendered catalog is not idempotent: $rendered"
}

rollback_applied() {
  local target backup
  local rollback_failed=0

  while IFS=$'\t' read -r target backup; do
    [[ -n "$target" ]] || continue
    if cp -- "$backup" "$target"; then
      printf 'Rolled back: %s\n' "${target#"$workspace_root/"}"
    else
      printf 'Rollback failed: %s\n' "$target" >&2
      rollback_failed=1
    fi
  done < "$applied_records"
  return "$rollback_failed"
}

abort_apply() {
  local message="$1"
  printf 'Error: %s\n' "$message" >&2
  if ! rollback_applied; then
    printf 'Error: rollback was incomplete\n' >&2
  fi
  exit 1
}

scopes="root halisco-landing api"
[[ -z "$selected_scope" ]] || scopes="$selected_scope"
changed=0
render_plan="$temporary_dir/render-plan"
: > "$render_plan"

for scope in $scopes; do
  target="$(agents_path "$scope")"
  [[ -f "$target" ]] || fail "missing AGENTS.md for scope '$scope': $target"
  table="$temporary_dir/table-$scope"
  updated="$temporary_dir/updated-$scope"
  verified="$temporary_dir/verified-$scope"
  build_table "$scope" "$table"
  replace_managed_table "$target" "$table" "$updated"
  validate_rendered_catalog "$updated" "$table" "$verified"

  printf '%s\t%s\t%s\n' "$scope" "$target" "$updated" >> "$render_plan"
  cmp -s "$target" "$updated" || changed=$((changed + 1))
done

if "$dry_run"; then
  while IFS=$'\t' read -r scope target updated; do
    relative_target="${target#"$workspace_root/"}"
    if cmp -s "$target" "$updated"; then
      printf 'Unchanged: %s\n' "$relative_target"
    else
      printf 'Would update: %s\n' "$relative_target"
      diff -u "$target" "$updated" || true
    fi
  done < "$render_plan"
else
  backup_records="$temporary_dir/backup-records"
  applied_records="$temporary_dir/applied-records"
  : > "$backup_records"
  : > "$applied_records"

  while IFS=$'\t' read -r scope target updated; do
    cmp -s "$target" "$updated" && continue
    backup="$temporary_dir/backup-$scope"
    cp -- "$target" "$backup" || fail "cannot back up $target"
    cmp -s "$target" "$backup" || fail "backup verification failed: $target"
    printf '%s\t%s\t%s\n' "$target" "$backup" "$updated" >> "$backup_records"
  done < "$render_plan"

  while IFS=$'\t' read -r target backup updated; do
    printf '%s\t%s\n' "$target" "$backup" >> "$applied_records"
    cp -- "$updated" "$target" || abort_apply "apply failed: $target"
  done < "$backup_records"

  while IFS=$'\t' read -r target backup updated; do
    cmp -s "$target" "$updated" || abort_apply "post-apply verification failed: $target"
  done < "$backup_records"

  while IFS=$'\t' read -r scope target updated; do
    relative_target="${target#"$workspace_root/"}"
    if cmp -s "$target" "$updated"; then
      if awk -F '\t' -v target="$target" '$1 == target { found = 1 } END { exit !found }' "$backup_records"; then
        printf 'Updated: %s\n' "$relative_target"
      else
        printf 'Unchanged: %s\n' "$relative_target"
      fi
    fi
  done < "$render_plan"
fi

mode="apply"
"$dry_run" && mode="dry-run"
printf 'Mode: %s\nScopes: %s\nChanged files: %d\nValidated skills: %s\n' "$mode" "$scopes" "$changed" "$(wc -l < "$metadata" | tr -d ' ')"
