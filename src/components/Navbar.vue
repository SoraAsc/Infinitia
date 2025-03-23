<script setup lang="ts">
import { ref, watch } from 'vue'
import { useToggle } from '@vueuse/core'
import LanguageSelector from './LanguageSelector.vue'

const isDark = ref(false)
const isMenuOpen = ref(false)
const toggleDark = useToggle(isDark)
const toggleMenu = useToggle(isMenuOpen)

watch(isDark, (value) => {
  if (value) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <router-link to="/" class="text-2xl font-bold text-primary mr-8">
            {{ $t('app.title') }}
          </router-link>
          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center gap-2">
            <router-link to="/" class="nav-link">{{$t('nav.home')}}</router-link>
            <router-link to="/documentation" class="nav-link">{{$t('nav.documentation')}}</router-link>
            <router-link to="/examples" class="nav-link">{{$t('nav.examples')}}</router-link>
          </div>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden lg:flex items-center gap-4">
          <LanguageSelector />
          <a
            href="https://github.com"
            target="_blank"
            class="btn btn-secondary"
          >
            <v-icon name="ri-github-line" class="w-5 h-5"/>
            <span class="hidden sm:inline">GitHub</span>
          </a>
          
          <button
            @click="toggleDark()"
            class="p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
            :title="isDark ? $t('app.theme.light') : $t('app.theme.dark')"
          >
            <v-icon v-if="isDark" name="co-sun" class="w-5 h-5" :hover="true" animation="pulse"/>
            <v-icon v-else name="io-moon-outline" class="w-5 h-5" :hover="true" animation="pulse"/>
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="lg:hidden flex items-center">
          <button
            @click="toggleMenu()"
            class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <v-icon
              :name="isMenuOpen ? 'md-close' : 'fc-menu'"
              class="w-6 h-6 cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-show="isMenuOpen"
      class="lg:hidden border-t border-slate-200 dark:border-slate-700"
    >
      <div class="container mx-auto px-4 py-4 space-y-4">
        <router-link to="/" class="nav-link block" @click="isMenuOpen = false">{{$t('nav.home')}}</router-link>
        <router-link to="/documentation" class="nav-link block" @click="isMenuOpen = false">{{$t('nav.documentation')}}</router-link>
        <router-link to="/examples" class="nav-link block" @click="isMenuOpen = false">{{$t('nav.examples')}}</router-link>
        <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <LanguageSelector />
          <div class="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              class="btn btn-secondary"
            >
              <v-icon name="ri-github-line" class="w-5 h-5"/>
              <span>GitHub</span>
            </a>
            <button
              @click="toggleDark()"
              class="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
              :title="isDark ? $t('app.theme.light') : $t('app.theme.dark')"
            >
              <v-icon v-if="isDark" name="co-sun" class="w-5 h-5"/>
              <v-icon v-else name="io-moon-outline" class="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>