<template>
  <div class="flex items-center space-x-2">
    <button
      v-for="possibleLocale in availableLocales"
      :key="possibleLocale"
      @click="changeLanguage(possibleLocale)"
      :class="[
        'px-3 py-1 rounded-md text-sm font-medium cursor-pointer',
        locale === possibleLocale
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      ]"
    >
      {{ possibleLocale.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage';

const { locale, changeLanguage } = useLanguage()
const availableLocales = ['en', 'pt']
</script> 