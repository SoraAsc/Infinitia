<template>
  <header class="mb-8">
    <button
      @click="goHome"
      class="btn btn-secondary cursor-pointer"
    >
      <v-icon name="bi-arrow-left" class="w-5 h-5" />
      <span>{{ $t('error.back-home') }}</span>
    </button>
  </header>

  <article class="space-y-2">
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ $t('tools.image-processing.title') }}</h1>
    <p class="text-slate-600 dark:text-slate-300 mb-8"> {{ $t('tools.image-processing.description') }} </p>

    <div class="flex flex-col items-center gap-4">
      <file-uploader :file-type-accept="'image/png, image/jpeg'" :current-file-url="currentImageUrl" @file-selected="onFileUploaded" class="md:w-[70%] w-[100%]"/>
      <div class="flex gap-4 items-center justify-center flex-wrap" v-if="currentFile">
        <button
          @click="undo"
          class="btn btn-secondary cursor-pointer"
          :disabled="!canUndo"
        >
          <v-icon name="bi-arrow-counterclockwise" class="w-5 h-5" />
          <span>{{ $t('file.undo') }}</span>
        </button>
        <button
          @click="redo"
          class="btn btn-secondary cursor-pointer"
          :disabled="!canRedo"
        >
          <v-icon name="bi-arrow-repeat" class="w-5 h-5" />
          <span>{{ $t('file.redo') }}</span>
        </button>
        <button
          @click="download"
          class="btn btn-secondary cursor-pointer"
        >
          <v-icon name="bi-download" class="w-5 h-5" />
          <span>{{ $t('file.download') }}</span>
        </button>
      </div>
      <div class="card md:w-[70%] w-[100%]" v-if="currentFile">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <v-icon name="io-color-wand" class="w-5 h-5" />
          <span>{{ $t('tools.image-processing.filter') }}</span>
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <button v-for="filter in filters" :key="filter.name" @click="applyFilter(filter.filter as FilterType)" class="flex flex-col items-center p-5 cursor-pointer rounded-lg transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700">
            <v-icon :name="filter.icon" class="w-5 h-5" />
            <span>{{ $t(filter.name) }}</span>
          </button>
        </div>
      </div>
    </div>

  </article>
</template>

<script setup lang="ts">
import FileUploader from '../../components/Utils/FileUploader.vue'
import { useRouter } from 'vue-router'
import { useImageEditor } from '../../composables/useImageEditor'
import { FilterType } from '../../composables/imageFilters'

const router = useRouter()

const 
{ 
  loadImage, currentFile, canRedo, canUndo, applyFilter, undo, redo, 
  currentImageUrl, download 
} = useImageEditor()

const filters = [
  {
    name: 'tools.image-processing.filters.normal',
    icon: 'bi-card-image',
    filter: 'normal',
  },
  {
    name: 'tools.image-processing.filters.gray',
    icon: 'io-contrast',
    filter: 'gray',
  },
  {
    name: 'tools.image-processing.filters.b-w',
    icon: 'bi-yin-yang',
    filter: 'black-and-white',
  },
  {
    name: 'tools.image-processing.filters.otsu',
    icon: 'bi-sliders',
    filter: 'otsu',
  },
  {
    name: 'tools.image-processing.filters.fourier',
    icon: 'md-waves',
    filter: 'fourier',
  },
  {
    name: 'tools.image-processing.filters.returnColor',
    icon: 'bi-palette',
    filter: 'returnColor',
  },
]

// const adjustments = [
//   { id: 'brightness', label: 'Brilho', icon: Sun, min: -100, max: 100 },
//   { id: 'contrast', label: 'Contraste', icon: Contrast, min: -100, max: 100 }
// ]

const goHome = () => router.push('/')

const onFileUploaded = (file: File) => loadImage(file)

</script>