<template>
  <main class="container mx-auto px-4">
    <div class="text-center max-w-3xl mx-auto space-y-6">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:bg-primary/20">
        <span class="text-sm font-medium">{{ $t('app.platform') }}</span>
        <span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-white">{{ $t('app.beta') }}</span>
      </div>
      <h1 class="text-5xl font-bold text-slate-900 dark:text-white">
        {{ $t('home.title') }}
        <span class="text-primary">{{ $t('home.highlight') }}</span>
      </h1>
      <p class="text-xl text-slate-600 dark:text-slate-300">
        {{ $t('home.description') }}
      </p>
    </div>
    <section class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <tool-card
        v-for="tool in tools"
        :key="tool.id"
        :tool="tool"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import ToolCard from '../components/ToolCard.vue';
const tools = [
  {
    id: 'image-processing',
    title: 'tools.image-processing.title',
    description: 'tools.image-processing.description',
    icon: 'bi-card-image',
    badge: 'tools.image-processing.badge'
  },
  // {
  //   id: 'digit-recognition',
  //   title: 'tools.digit.title',
  //   description: 'tools.digit.description',
  //   icon: 'bi-pencil',
  //   badge: 'tools.digit.badge'
  // },
  // {
  //   id: 'image-classification',
  //   title: 'tools.image.title',
  //   description: 'tools.image.description',
  //   icon: 'bi-card-image',
  //   badge: 'tools.image.badge'
  // },
  // {
  //   id: 'custom-training',
  //   title: 'tools.training.title',
  //   description: 'tools.training.description',
  //   icon: 'fa-brain',
  //   badge: 'tools.training.badge'
  // }
]
</script> 