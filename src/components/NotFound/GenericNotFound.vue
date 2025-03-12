<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="text-center space-y-6">
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white">
          {{ title || $t('error.not-found') }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400">
          {{ description || $t('error.not-found-description') }}
        </p>
      </div>
      <div>
        <button @click="goHome" class="btn btn-primary">
          {{ $t('error.back-home') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNavbar } from '../../composables/useNavbar'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  showNavbar: boolean
}>(), {
  showNavbar: false
})

const router = useRouter()
const { toggleNavbar } = useNavbar()

const goHome = () => {
  toggleNavbar(true)
  router.push('/')
}

onMounted(() => toggleNavbar(props.showNavbar))
</script>