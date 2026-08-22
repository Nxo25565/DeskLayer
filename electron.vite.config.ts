import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

console.log(resolve(__dirname, 'src/renderer/src/'))

export default defineConfig({
  main: {
    build: {
      sourcemap: true
    }
  },
  preload: {
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          settings_preload: resolve(__dirname, 'src/preload/Settings/index.ts'),
          lb_preload: resolve(__dirname, 'src/preload/LinkBro/index.ts')
        }
      }
    }
  },
  renderer: {
    // resolve: {
    //   alias: {
    //     '@renderer': resolve(__dirname,'src/renderer/src/')
    //   }
    // },
    plugins: [vue()],
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          about: resolve(__dirname, 'src/renderer/AboutPage.html'),
          settings: resolve(__dirname, 'src/renderer/SettingsPage.html'),
          linkbro: resolve(__dirname, 'src/renderer/LinkBroPage.html')
        }
      }
    }
  }
})
