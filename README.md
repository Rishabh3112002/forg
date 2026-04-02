# forg

A Python project setup tool built on top of [uv](https://github.com/astral-sh/uv).

## Why

`uv` is great. But it scaffolds a [flat layout](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/), which isn't how I want my projects structured. I wanted a [src layout](https://packaging.python.org/en/latest/discussions/src-layout-vs-flat-layout/).

That was the whole reason. One thing led to another.

## What it does

- Wraps `uv init` with an opinionated `src/` layout
- Scaffolds a PostgreSQL or MySQL database for your project
- Passes all other commands through to `uv` directly

## Installation

```bash
npm install -g forg-cli
```

> Requires [Node.js](https://nodejs.org) and [uv](https://docs.astral.sh/uv/getting-started/installation/) to be installed.

Or via curl:

```bash
curl -fsSL https://raw.githubusercontent.com/Rishabh3112002/forg/main/setup.sh | bash
```

## Usage

### Initialize a new project

```bash
forg init <project-name>
```

### Initialize with a database

```bash
forg init <project-name> --engine psql --db-name mydb --db-user postgres
```

Supported engines: `psql`, `mysql`

### All other uv commands

All commands not handled by forg are passed through to `uv` directly:

```bash
forg add requests
forg run main.py
forg sync
```

## Project structure

Running `forg init myproject` generates:

```
myproject/
├── src/
│   └── myproject/
│       ├── __init__.py
│       └── main.py
├── pyproject.toml
├── README.md
├── .python-version
├── .git
└── .gitignore
```

## Roadmap

- [ ] Writes database credentials to a `.env` file automatically
- [ ] Connect to your database server directly via `forg`.
- [ ] Node.js project support

## Credits

forg is built on top of [uv](https://github.com/astral-sh/uv) as a wrapper, the incredibly fast Python package and project manager created by [Astral](https://astral.sh). All Python environment and dependency management is handled by uv under the hood.
