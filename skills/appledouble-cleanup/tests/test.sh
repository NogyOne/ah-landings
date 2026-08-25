#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cleanup_script="$script_dir/../scripts/cleanup-appledouble.sh"
test_root="$(mktemp -d "${TMPDIR:-/tmp}/appledouble-cleanup-test.XXXXXX")"
real_rm="$(command -v rm)"
trap '"$real_rm" -rf -- "$test_root"' EXIT

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
  case "$output" in
    *"$1"*) ;;
    *) printf 'Expected output to contain %s:\n%s\n' "$1" "$output" >&2; exit 1 ;;
  esac
}

fixture="$test_root/fixture"
mkdir -p "$fixture/node_modules/package" "$fixture/._directory"
printf 'sidecar\n' > "$fixture/._outside"
printf 'dependency sidecar\n' > "$fixture/node_modules/package/._inside"
printf 'ordinary\n' > "$fixture/not-a-sidecar"

run_capture "$cleanup_script" "$fixture"
assert_status 0
assert_contains 'Mode: dry-run'
assert_contains 'Dependencies: excluded'
assert_contains 'Candidates: 1'
[[ -f "$fixture/._outside" && -f "$fixture/node_modules/package/._inside" ]]

run_capture "$cleanup_script" --include-dependencies "$fixture"
assert_status 0
assert_contains 'Dependencies: included'
assert_contains 'Candidates: 2'

run_capture "$cleanup_script" /
assert_status 2
assert_contains 'refusing to scan filesystem root /'

run_capture "$cleanup_script" --apply "$fixture"
assert_status 0
assert_contains 'Candidates: 1'
assert_contains 'Deleted: 1'
assert_contains 'Remaining: 0'
[[ ! -e "$fixture/._outside" && -f "$fixture/node_modules/package/._inside" ]]

run_capture "$cleanup_script" --apply --include-dependencies "$fixture"
assert_status 0
assert_contains 'Candidates: 1'
assert_contains 'Deleted: 1'
assert_contains 'Remaining: 0'
[[ ! -e "$fixture/node_modules/package/._inside" ]]

failure_fixture="$test_root/failure-fixture"
fake_bin="$test_root/fake-bin"
mkdir -p "$failure_fixture" "$fake_bin"
printf 'sidecar\n' > "$failure_fixture/._undeletable"
cat > "$fake_bin/rm" <<'EOF'
#!/usr/bin/env bash
for argument in "$@"; do
  if [[ "$argument" == */._undeletable ]]; then
    exit 1
  fi
done
exec "$REAL_RM" "$@"
EOF
chmod +x "$fake_bin/rm"

run_capture env PATH="$fake_bin:$PATH" REAL_RM="$real_rm" "$cleanup_script" --apply "$failure_fixture"
assert_status 1
assert_contains 'Candidates: 1'
assert_contains 'Deleted: 0'
assert_contains 'Remaining: 1'
assert_contains 'Cleanup incomplete: 1 deletion failure(s), 1 matching file(s) remain.'
[[ -f "$failure_fixture/._undeletable" ]]

printf 'appledouble-cleanup tests: PASS\n'
