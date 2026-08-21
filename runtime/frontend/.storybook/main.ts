import type { StorybookConfig } from '@storybook/preact-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/preact-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {}
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      '@builtin-ui': new URL('../../plugins/builtin-ui/src/main/frontend', import.meta.url).pathname,
      '@cutcrft/runtime-client': new URL('../src/plugin/runtimeClient.ts', import.meta.url).pathname
    }
    viteConfig.resolve.dedupe = ['preact', 'preact/hooks', '@preact/signals']
    return viteConfig
  }
}

export default config
