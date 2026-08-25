#!/usr/bin/env bash

set -u
set -o pipefail

usage() {
  cat <<'EOF'
Usage: cleanup-appledouble.sh [--apply] [--include-dependencies] [ROOT]

Find regular macOS AppleDouble sidecar files whose basename matches ._*.
The default mode is a dry-run and prunes node_modules directories.

Options:
  --apply                 Delete reported files and verify the remaining count
  --include-dependencies  Include node_modules directories in the scan
  -h, --help              Show this help

ROOT defaults to the workspace containing this skill. ROOT must be an existing
directory and must not resolve to /.
EOF
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 2
}

apply=false
include_dependencies=false
root_argument=""
root_supplied=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply)
      apply=true
      ;;
    --include-dependencies)
      include_dependencies=true
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      [[ $# -le 1 ]] || fail "expected at most one ROOT argument"
      if [[ $# -eq 1 ]]; then
        root_argument="$1"
        root_supplied=true
      fi
      break
      ;;
    -*)
      fail "unknown option: $1"
      ;;
    *)
      ! "$root_supplied" || fail "expected at most one ROOT argument"
      root_argument="$1"
      root_supplied=true
      ;;
  esac
  shift
done

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)" || fail "cannot resolve script directory"
default_root="$(cd -- "$script_dir/../../.." && pwd -P)" || fail "cannot resolve default workspace root"
if "$root_supplied"; then
  [[ -n "$root_argument" ]] || fail "ROOT must not be empty"
  requested_root="$root_argument"
else
  requested_root="$default_root"
fi

[[ -d "$requested_root" ]] || fail "ROOT is not an existing directory: $requested_root"
root="$(cd -- "$requested_root" && pwd -P)" || fail "cannot resolve ROOT: $requested_root"
[[ "$root" != "/" ]] || fail "refusing to scan filesystem root /"

candidate_file="$(mktemp "${TMPDIR:-/tmp}/appledouble-cleanup.XXXXXX")" || fail "cannot create temporary file"
remaining_file="$(mktemp "${TMPDIR:-/tmp}/appledouble-cleanup.XXXXXX")" || {
  rm -f -- "$candidate_file"
  fail "cannot create temporary file"
}
trap 'rm -f -- "$candidate_file" "$remaining_file"' EXIT

scan() {
  local output_file="$1"

  if "$include_dependencies"; then
    find "$root" -type f -name '._*' -print0 > "$output_file"
  else
    find "$root" -type d -name node_modules -prune -o -type f -name '._*' -print0 > "$output_file"
  fi
}

scan "$candidate_file" || fail "scan failed: $root"

mode="dry-run"
"$apply" && mode="apply"
dependencies="excluded"
"$include_dependencies" && dependencies="included"
printf 'Root: %s\nMode: %s\nDependencies: %s\n' "$root" "$mode" "$dependencies"

candidate_count=0
while IFS= read -r -d '' file; do
  candidate_count=$((candidate_count + 1))
  printf 'Candidate: %s\n' "$file"
done < "$candidate_file"
printf 'Candidates: %d\n' "$candidate_count"

if ! "$apply"; then
  printf 'Dry-run only. Re-run with --apply to delete these files.\n'
  exit 0
fi

deleted_count=0
failed_count=0
while IFS= read -r -d '' file; do
  if rm -f -- "$file"; then
    deleted_count=$((deleted_count + 1))
    printf 'Deleted: %s\n' "$file"
  else
    failed_count=$((failed_count + 1))
    printf 'Failed: %s\n' "$file" >&2
  fi
done < "$candidate_file"

scan "$remaining_file" || fail "verification scan failed: $root"

remaining_count=0
while IFS= read -r -d '' file; do
  remaining_count=$((remaining_count + 1))
  printf 'Remaining: %s\n' "$file" >&2
done < "$remaining_file"

printf 'Deleted: %d\nRemaining: %d\n' "$deleted_count" "$remaining_count"
if [[ "$failed_count" -ne 0 || "$remaining_count" -ne 0 ]]; then
  printf 'Cleanup incomplete: %d deletion failure(s), %d matching file(s) remain.\n' "$failed_count" "$remaining_count" >&2
  exit 1
fi
