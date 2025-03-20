<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="text-center space-y-6">
      <div class="space-y-4">
        <h1 class="text-9xl font-bold text-primary">404</h1>
        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white">
            {{ title || $t('error.not-found') }}
          </h2>
          <p class="text-slate-600 dark:text-slate-300">
            {{ description || $t('error.not-found-description') }}
          </p>
        </div>
      </div>
      <div class="flex gap-8 justify-center">
        <button
          @click="goBack"
          class="btn btn-secondary cursor-pointer"
        >
          <v-icon name="bi-arrow-left" class="w-5 h-5" />
          <span>{{ $t('error.back') }}</span>
        </button>
        <button
          @click="goHome"
          class="btn btn-primary cursor-pointer"
        >
          <span>{{ $t('error.back-home') }}</span>
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
const goBack = () => router.back()

onMounted(() => toggleNavbar(props.showNavbar))
</script>