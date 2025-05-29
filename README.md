<p align="center">
  <a href="https://koridor.cc" target="_blank" rel="noopener noreferrer">
    <img src="static/koridor.svg" width="128" alt="Koridor logo">
  </a>
</p>

# Koridor

A [SvelteKit](https://kit.svelte.dev) implementation of my favorite board game.

This is a development version. v1.0.0 should contain many more features.

Feature todos:

- [x] Desktop core
- [x] Mobile support using drag and drop actions
- [ ] History of moves played and possibility of going back
- [ ] Online with chat
- [ ] Versus Bots

Tech todos:

- [x] SvelteKit with JSDoc Typechecking migration
- [x] End-to-end tests

### End-to-End Testing

This project uses [Playwright](https://playwright.dev/) for End-to-End (E2E) testing. These tests simulate user interactions in a real browser environment to verify application flows.

**Setup:**

1.  **Install Dependencies:** If you haven't already, install the project dependencies:

    ```bash
    npm install
    ```

2.  **Install Playwright Browsers:** Playwright requires browser binaries to run tests. While these might have been installed during the initial setup, if you've cloned the repository fresh or if browsers are missing, run:
    ```bash
    npx playwright install --with-deps
    ```
    The `--with-deps` flag will also install necessary operating system dependencies for the browsers.

**Running Tests:**

To execute the E2E test suite, run the following command:

```bash
npm run test:e2e
```

This command will launch the Playwright test runner, which will execute all tests defined in the `tests/e2e` directory. Test results and reports (usually an HTML report) will be available after the run.
