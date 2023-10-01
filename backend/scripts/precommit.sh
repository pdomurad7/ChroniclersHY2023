#!/usr/bin/env sh

set -o errexit
set -o nounset

rootDir=$(realpath "$(dirname "$0")/..")

"$rootDir/scripts/black-fix.sh"
"$rootDir/scripts/coverage.sh"
