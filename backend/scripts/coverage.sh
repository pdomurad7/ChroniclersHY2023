#!/usr/bin/env sh

set -o errexit
set -o nounset

rootDir=$(realpath "$(dirname "$0")/..")

coverage run -m unittest discover -s "$rootDir/app/"
coverage report --fail-under=100 --show-missing
