<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  tool: {
    id: string
    title: string
    description: string
    badge?: string
    icon: string
  }
}>()

const navigateToTool = (toolId: string) => {
  router.push(`/tool/${toolId}`)
}
</script>

<template>
  <div 
    class="card tool-card group cursor-pointer hover:scale-[1.02] transition-all duration-200"
    @click="navigateToTool(tool.id)"
  >
    <div class="flex items-center gap-4 min-h-24">
      <div class="p-3 rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
        <v-icon :name="tool.icon" class="w-6 h-6 " />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
            {{ $t(tool.title) }}
          </h3>
          <span v-if="tool.badge" class="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary dark:bg-primary/20">
            {{ $t(tool.badge) }}
          </span>
        </div>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {{ $t(tool.description) }}
        </p>
      </div>
    </div>
  </div>
</template>