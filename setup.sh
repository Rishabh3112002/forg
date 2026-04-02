#!/bin/bash

set -e

echo "Installing forg..."

# Check for node
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed. https://nodejs.org"
    exit 1
fi

# Check for uv
if ! command -v uv &> /dev/null; then
    echo "Error: uv is required but not installed. https://docs.astral.sh/uv"
    exit 1
fi

# Install via npm
npm install -g forg

echo ""
echo "forg installed successfully. Run 'forg --help' to get started."
