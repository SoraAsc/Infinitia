<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { useNavbar } from './composables/useNavbar'

const { showNavbar } = useNavbar()
</script>

<template>
  <div class="min-h-screen min-w-[320px] bg-slate-50 dark:bg-slate-900">
    <Navbar v-if="showNavbar" />
    <main class="container mx-auto px-4 py-8 md:py-12">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>

<style>

</style>
