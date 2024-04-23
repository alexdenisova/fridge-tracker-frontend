const { defineConfig } = require('vite')

// export default {
//   server: {
//     port: 5173,
//     strictPort: true,
//     hmr: {
//       port: 5173,
//     },
//   },
// }

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        recipe: './recipe.html',
        pantry: './pantry.html',
        pantry_item: './pantry_item.html',
        login: './login.html',
      }
    }
  }
})
