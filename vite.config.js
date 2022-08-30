import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import { createVuePlugin } from 'vite-plugin-vue2'
import { svgBuilder } from './src/plugins/svgBuilder'
import WindiCSS from 'vite-plugin-windicss'
// console.log(loadEnv(import.meta.env))
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname)
  return {
    plugins: [
      createVuePlugin({
        vueTemplateOptions: {
          compilerOptions: {
            // 去掉 回车 引起的 margin
            whitespace: 'condense',
          },
        },
      }),
      svgBuilder('./src/icons/svg/'),
      WindiCSS(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['@/assets/fonts'],
    },
    base: '/',

    server: {
      port: 5277,
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_BASE_API,
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        },
        '/auth': {
          target: env.VITE_APP_BASE_API,
          secure: false, // 如果是https接口，需要配置这个参数
          changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      rollupOptions: {
        output: {
          manualChunks: {
            'element-ui': ['element-ui'],
            // lodash: ["lodash"],
          },
        },
      },
    },
  }
})
