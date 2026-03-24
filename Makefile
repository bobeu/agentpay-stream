# Makefile for Movement Stream Project

.PHONY: dev build start clean install

# Standard development command
dev:
	npm run dev

# Install dependencies and enable Corepack for Yarn
install:
	corepack enable
	npm install

# Build the project for production
build:
	npm run build

# Clean Next.js cache and node_modules
clean:
	rm -rf .next
	rm -rf node_modules

# Run the production build locally
start:
	npm run start