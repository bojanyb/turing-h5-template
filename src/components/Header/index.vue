<template>
  <header class="antialiased bg-white Male text-slate-500 dark:text-slate-400 dark:bg-slate-900">
    <div
      class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent"
    >
      <div class="mx-auto max-w-8xl">
        <div class="px-4 py-4 border-b border-slate-900/10 lg:px-8 lg:border-0 dark:border-slate-300/10">
          <div class="relative flex items-center text-2xl sm:text-2xl font-blimone">
            <router-link to="/" class="mr-3 flex-none w-[2.0625rem] md:w-auto leading-6 dark:text-slate-200">Voice-Web</router-link>
            <div class="relative items-center hidden ml-auto lg:flex">
              <nav class="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                <ul class="flex space-x-8 tag">
                  <li>
                    <router-link to="/contain" class="hover:text-sky-500 dark:hover:text-sky-400">echartsNav</router-link>
                  </li>
                  <li>
                    <router-link to="/Component-demo" class="hover:text-sky-500 dark:hover:text-sky-400">ComponentDemo</router-link>
                  </li>
                  <li>
                    <router-link to="/demo" class="hover:text-sky-500 dark:hover:text-sky-400">GithubDemo</router-link>
                  </li>
                  <li>
                    <router-link to="/login" class="hover:text-sky-500 dark:hover:text-sky-400">Login</router-link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  // import { ref } from 'vue'
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore } from '/@/store';

  // const title = ref('I want to study typescript')
  // 检测浏览器系统主题
  // const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
  const appStore = useAppStore();
  // const useStore = useUserStore()
  const theme = computed(() => {
    return appStore.theme;
  });
  console.log(theme);
  const isDark = useDark({
    selector: 'body',
    onChanged(dark: boolean) {
      appStore.toggleTheme(dark);
    },
  });
  const toggleTheme = useToggle(isDark);
  console.log(toggleTheme);
</script>

<style lang="scss" scoped>
  .tag {
    margin-bottom: 0;
  }

  html.dark {
    a {
      color: white !important;
    }
  }

  html {
    a {
      color: black !important;
    }
  }
</style>
