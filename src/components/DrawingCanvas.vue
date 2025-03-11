<template>
  <div class="card">
    <div class="canvas-container w-full aspect-[4/3] relative">
      <canvas
        ref="canvas"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        class="absolute inset-0 w-full h-full"
      ></canvas>
    </div>
    <div class="flex flex-wrap justify-center gap-4 mt-6">
      <button
        @click="clearCanvas"
        class="btn btn-secondary"
      >
        {{ $t('canvas.clear') }}
      </button>
      <button
        @click="predict"
        class="btn btn-primary"
      >
        {{ $t('canvas.predict') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// import * as tf from '@tensorflow/tfjs'

const canvas = ref(null)
const isDrawing = ref(false)
const ctx = ref(null)

const resizeCanvas = () => {
  const container = canvas.value.parentElement
  canvas.value.width = container.clientWidth
  canvas.value.height = container.clientHeight
  
  // Restaurar configurações do contexto após redimensionamento
  if (ctx.value) {
    ctx.value.strokeStyle = '#000'
    ctx.value.lineWidth = 2
    ctx.value.lineCap = 'round'
  }
}

onMounted(() => {
  ctx.value = canvas.value.getContext('2d')
  ctx.value.strokeStyle = '#000'
  ctx.value.lineWidth = 2
  ctx.value.lineCap = 'round'
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
})

const startDrawing = (e) => {
  isDrawing.value = true
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
}

const draw = (e) => {
  if (!isDrawing.value) return
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  ctx.value.lineTo(x, y)
  ctx.value.stroke()
}

const stopDrawing = () => {
  isDrawing.value = false
  ctx.value.closePath()
}

const clearCanvas = () => {
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
}

const predict = async () => {
  // TODO: Implement TensorFlow.js prediction logic here
  console.log('Prediction functionality to be implemented')
}
</script>

<style scoped>
.drawing-canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

canvas {
  border: 1px solid #ccc;
  background-color: white;
}

.controls {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style> 