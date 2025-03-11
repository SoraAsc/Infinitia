<template>
  <div class="flex items-center space-x-2">
    <button
      v-for="locale in availableLocales"
      :key="locale"
      @click="changeLocale(locale)"
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium cursor-pointer',
        currentLocale === locale
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      ]"
    >
      {{ locale.toUpperCase() }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = computed(() => locale.value)
const availableLocales = ['en', 'pt']

const changeLocale = (newLocale) => {
  locale.value = newLocale
}
</script> 