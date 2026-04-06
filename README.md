---
title: "README"
date: 2026-03-29
draft: false
---

# Hugo Website

This is a static website built with **Hugo**, a fast and flexible static site generator with **TypeScript** support 
via **Bun**. This project contains the core structure and tooling for modular development towards project based apps 
derived from this core as Hugo themes and modules.

## 📋 Requirements

- [Go](https://go.dev/doc/install) - The Go programming language
- [Hugo Extended](https://gohugo.io/getting-started/installing/) - The Hugo static site generator
- [Bun](https://bun.sh/) - Fast JavaScript runtime and package manager

### Optional but recommended tools

**Note:** The commands used to describe the getting started process will use the makefile commands, 
but you can also use the tool specific commands as well if you know them.

- [Docker](https://www.docker.com/get-started) For development and deployment
- [GNU Make](https://www.gnu.org/software/make/) For task automation


## 🚀 Getting Started

Each section below describes a step-by-step guide to help you get started with the project. You may skip any sections 
that you know how to complete or are not applicable in specific way in accordance to your preferences. Expand them, 
read them and follow the instructions to get started.

<details>
<summary style="font-size: 1.125rem; font-weight:700; color: lightcyan; cursor:pointer;">
🧰 Check tools required for project init
</summary>

Follow the steps below to check the tools required for the project init.

```shell
# Check Go version and installation
go version
which go

# Check Hugo version and installation
hugo version
which hugo

# Check Bun version and revision
bun --version
bun --revision
which bun

# Check Docker (incl. docker compose, 
#   optional but recommended):
docker --version
which docker
docker ps
```



---

</details>



<details>
<summary style="font-size: 1.125rem; font-weight:700; color: lightcyan; cursor:pointer;">
📦 Install TypeScript / JavaScript dependencies using Bun
</summary>

The following steps will install the required dependencies for the project. You will 
choose between starting the project in development mode or production mode.
It is recommended to run this using docker due to the consistency of the environment, 
but you can also run it locally if you have the required tools installed.

#### Install production dependencies

Only install the depencencies declared in the `package.json` file under the `dependencies` key.

```shell
# Install production dependencies using make
make install
```

#### Install development dependencies

Install development depencencies declared in the `package.json` file under both the `dependencies` key 
and the `devDependencies` key.

```shell
# Install development dependencies using make
make install-dev
```

### 2. Set Up Environment Variables

Copy the example environment file and configure for your environment:

```shell
# The .env files are already created, just review and update them
nano .env.dev
```

See [Environment Variables Guide](content/project/environment-variables.md) for detailed information.

---

</details>


<details>
<summary style="font-size: 1.125rem; font-weight:700; color: lightcyan; cursor:pointer;">
🌍 Environment Management
</summary>

## 🌍 Environment Management

This project supports multiple environments with separate `.env` files:

- **`.env.dev`** - Development environment
- **`.env.stage`** - Staging environment
- **`.env.prod`** - Production environment

### Running Different Environments

```shell
# Development (default)
make dev-all

# Staging
make dev-all ENV=stage

# Production
make dev-all ENV=prod
```

📖 **Full documentation**: [docs/ENVIRONMENT_VARIABLES.md](content/project/environment-variables.md)

## 🏗️ Building the Site

### Development Build

```shell
bun run build:dev
# or
make build-hugo ENV=dev
```

### Production Build

```shell
bun run build:prod
# or
make build-hugo ENV=prod
```

Generate the static website in the `public/` directory.

---

</details>


<details>
<summary style="font-size: 1.125rem; font-weight:700; color: lightcyan; cursor:pointer;">
▶️ Start Development Server
</summary>



```shell
# Recommended: TypeScript watch + Hugo server
make dev-all

# Or using npm/bun scripts
bun run dev:env

# Or directly
./scripts/dev.sh dev
```

The site will be available at: http://localhost:1313

---

</details>


<details>
<summary style="font-size: 1.125rem; font-weight:700; color: lightcyan; cursor:pointer;">
🐳 Running with Docker Compose
</summary>


## 🐳 Running with Docker Compose

### Development

```shell
docker compose up --build hugo-dev
# or
make server-docker-dev
```

### Staging

```shell
docker compose --profile staging up --build hugo-staging
# or
make server-docker-stage
```

### Production Build

```shell
docker compose --profile production run --rm hugo-prod
# or
make build-docker-prod
```

---

</details>



<details>
<summary style="font-size: 1.125rem; font-weight:700; color: lightcyan; cursor:pointer;">
🧪 Testing and Coverage
</summary>

## 🧪 Testing and Coverage

```shell
bun run test:coverage
# or
make test-coverage
```

Coverage artifacts are generated in `docs/coverage/`.
Open `docs/coverage/index.html` to view the HTML report.

</details>

## 📚 Documentation

- [Environment Variables Guide](content/project/environment-variables.md) - Complete guide for managing environment-specific configurations
- [SCSS Structure](content/project/scss-best-practices.md) - CSS/SCSS architecture documentation
- [Setup Guides](content/setup/quickstart.md) - Additional setup documentation
- [Guidelines](content/project/_index.md) - Development guidelines

## 📄 License

Insert your license or preferred text here...
