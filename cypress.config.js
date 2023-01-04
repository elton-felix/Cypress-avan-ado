const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
   // baseUrl: 'https://wlsf82-hacker-stories.web.app',
    baseUrl: 'https://hackernews-seven.vercel.app/',
    setupNodeEvents (on, config) {
      // implement node event listeners here
    }
  }
})
