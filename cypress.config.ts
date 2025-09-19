import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000', // Добавлен базовый URL
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
