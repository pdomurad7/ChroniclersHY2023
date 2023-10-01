#!/usr/bin/env sh

set -o errexit
set -o nounset

rootDir=$(realpath "$(dirname "$0")/..")

black "$rootDir/app/"
