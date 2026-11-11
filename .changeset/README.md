# Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to keep a changelog of what changes on the site.

When a pull request changes the site, run `pnpm changeset` and commit the generated markdown file. Merging changesets to `main` makes the `Release` workflow open or update a "Version Packages" pull request that bumps the version and updates `CHANGELOG.md`. The site is private, so nothing is published to npm.
