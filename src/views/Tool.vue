<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNavbar } from '../composables/useNavbar'
// import ImageClassification from '../components/ImageClassification.vue'
// import CustomTraining from '../components/CustomTraining.vue'
// import DigitRecognition from '../views/Tools/DigitRecognition.vue'
import GenericNotFound from '../components/NotFound/GenericNotFound.vue'
import ImageProcessing from './Tools/ImageProcessing.vue'

const route = useRoute()
const { toggleNavbar } = useNavbar()
const toolId = computed(() => route.params.id)

const toolComponents = {
  'image-processing': ImageProcessing,
  // 'digit-recognition': DigitRecognition,
  // 'image-classification': ImageClassification,
  // 'custom-training': CustomTraining
}

const currentComponent = computed(() => toolComponents[toolId.value as keyof typeof toolComponents])

onMounted(() => toggleNavbar(true))
</script>

<template>
  <div class="space-y-8">
    <div class="card" v-if="currentComponent">
      <component :is="currentComponent" />
    </div>
    
    <generic-not-found 
      v-else 
      :title="$t('tools.not-found')"
      :description="$t('tools.not-found-description')"
      :show-navbar="true"
    />
  </div>
</template> 