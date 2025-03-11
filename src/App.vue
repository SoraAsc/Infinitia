<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen min-w-[320px] bg-slate-50 dark:bg-slate-900">
    <Navbar />
    <main class="container mx-auto px-4 py-8 md:py-12">
      <router-view />
      <!-- <div class="max-w-[900px] mx-auto">
        <router-view />
      </div> -->
    </main>
  </div>
</template>

<style>

</style>
