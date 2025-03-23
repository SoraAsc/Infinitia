<template>
  <div class="aspect-video">
    <label for="dropzone-file" class="relative w-full h-full cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary dark:hover:border-primary flex flex-col items-center justify-center group">
      <div class="p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-colors duration-200" v-if="!previewUrl">
        <v-icon name="bi-upload" class="w-12 h-12 text-gray-500 dark:text-gray-400" />
      </div>
      <img v-if="previewUrl" :src="currentFileUrl || previewUrl" alt="Preview of Your Image" class="absolute w-full h-full object-contain rounded-xl">
      <input 
        id="dropzone-file" 
        type="file" 
        class="hidden" 
        @change="handleFileChange"
        :accept="fileTypeAccept"
      />
      <span v-if="!previewUrl" class="mt-4 text-slate-600 dark:text-slate-400 group-hover:text-primary font-medium"> {{ $t('file.upload-file') }} </span>
      <span v-if="!previewUrl" class="text-sm text-slate-400 dark:text-slate-500"> {{ $t('file.supported-formats') }} </span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{fileTypeAccept: 'image/png, image/jpeg', currentFileUrl: string | null}>()

const emit = defineEmits<{(e: 'fileSelected', file: File): void}>()

const previewUrl = ref<string>('')

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    emit('fileSelected', file)
    
    const reader = new FileReader()
    reader.onload = (e) => previewUrl.value = e.target?.result as string
    reader.readAsDataURL(file)
  }
}
</script>