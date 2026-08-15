<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-[#D8D8DC] text-[#111113] flex flex-col">
    <!-- Pinned Top Header Component -->
    <Header />

    <!-- Main Workstation Area -->
    <main class="flex-1 p-6 md:p-12 flex flex-col items-center justify-center">
      <div class="w-full max-w-6xl rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#EFEFF2] border border-[#C4C4C9] shadow-lg items-start">
        
        <!-- Left Column: Controls & Presets -->
        <section class="space-y-6 flex flex-col">
          
          <!-- Preset Palettes & Swatch Library -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-[12px] font-bold font-mono uppercase text-[#55555D] block">Color Palettes</span>
              <div class="flex items-center gap-3">
                <button @click="resetToDefault" class="text-[10px] font-mono uppercase text-[#55555D] hover:text-[#111113] transition-colors">
                  Reset Default
                </button>
                <button @click="saveCurrentPalette()" class="text-[10px] font-mono uppercase text-[#111113] font-bold hover:underline">
                  + Save Current Pairing
                </button>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
              <div v-for="(palette, index) in savedPalettes" :key="index"
                  class="group relative flex items-center rounded-lg border border-[#C4C4C9] overflow-hidden shadow-sm"
                  :class="bgColor === palette.bg && textColor === palette.text ? 'bg-[#111113] text-white border-[#111113]' : 'bg-white text-[#111113]'">
                <button @click="setPreset(palette.bg, palette.text)"
                        class="px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
                        :class="bgColor === palette.bg && textColor === palette.text ? 'bg-[#111113] text-white' : 'hover:bg-[#111113] hover:text-white'">
                  <span class="w-3 h-3 rounded-full border border-[#C4C4C9]" :style="{ backgroundColor: palette.bg }"></span>
                  {{ palette.name }}
                </button>
                <button v-if="index >= 4" @click="deletePalette(index)" 
                        class="px-2 text-[10px] font-mono text-red-600 hover:bg-red-50 h-full flex items-center justify-center border-l border-[#C4C4C9]" 
                        aria-label="Delete Palette">
                  ×
                </button>
              </div>
            </div>
          </div>
          
          <!-- Color Blindness Preview -->
          <div class="space-y-2">
            <span class="text-[12px] font-bold font-mono uppercase text-[#55555D] block">Color Blindness Preview</span>
            <div class="flex flex-wrap gap-2">
              <button v-for="mode in simModes" :key="mode.id"
                      @click="currentSim = mode.id"
                      class="px-3 py-1.5 rounded-lg border text-[10px] font-mono font-semibold uppercase tracking-wider transition-colors"
                      :class="currentSim === mode.id ? 'bg-[#111113] text-white border-[#111113]' : 'bg-white text-[#111113] border-[#C4C4C9] hover:bg-[#D8D8DC]'">
                {{ mode.name }}
              </button>
            </div>
          </div>

          <!-- Surface & On-Surface Pickers -->
          <div class="grid grid-cols-2 gap-4">
            
            <!-- Background Color Picker (Surface) -->
            <div class="flex items-center gap-3">
              <div class="relative">
                <label for="bg-color-picker" class="sr-only">Background Color</label>
                <input id="bg-color-picker" type="color" v-model="bgColor" 
                      class="w-14 h-14 shrink-0 cursor-pointer bg-transparent overflow-hidden shadow-inner [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:rounded-2xl" />
              </div>
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-[9px] font-mono uppercase text-[#55555D] mb-0.5 tracking-tight">Surface (Background Color)</span>
                <div class="flex items-center justify-between gap-1">
                  <input type="text" v-model="bgColor" aria-label="Background Hex Code" class="font-mono text-base bg-transparent focus:outline-none uppercase tracking-wide text-[#111113] w-24" />
                  <button @click="pickColorFor('bg')" title="Sample color from screen" class="p-1.5 hover:text-black text-[#55555D] transition-colors cursor-pointer flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Text Color Picker (On-Surface) -->
            <div class="flex items-center gap-3">
              <div class="relative">
                <label for="text-color-picker" class="sr-only">Text Color</label>
                <input id="text-color-picker" type="color" v-model="textColor" 
                      class="w-14 h-14 shrink-0 cursor-pointer bg-transparent overflow-hidden shadow-inner [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:rounded-2xl" />
              </div>
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-[9px] font-mono uppercase text-[#55555D] mb-0.5 tracking-tight">On-Surface (Text Color)</span>
                <div class="flex items-center justify-between gap-1">
                  <input type="text" v-model="textColor" aria-label="Text Hex Code" class="font-mono text-base bg-transparent focus:outline-none uppercase tracking-wide text-[#111113] w-24" />
                  <button @click="pickColorFor('text')" title="Sample color from screen" class="p-1.5 hover:text-black text-[#55555D] transition-colors cursor-pointer flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- Shade & Tint Generator Strip -->
          <div class="space-y-2 pt-2 border-t border-[#C4C4C9]">
            <span class="text-[12px] font-bold font-mono uppercase text-[#55555D] block">Generated Scale (Shades & Tints)</span>
            <div class="grid grid-cols-9 gap-1 h-10 rounded-xl overflow-hidden border border-[#C4C4C9] bg-white p-1">
              <div v-for="shade in backgroundScale" :key="shade.label"
                  class="h-full rounded cursor-pointer transition-transform hover:scale-105 relative group"
                  :style="{ backgroundColor: shade.hex }"
                  @click="bgColor = shade.hex"
                  :title="`${shade.label}: ${shade.hex}`">
                <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#111113] text-white text-[8px] font-mono px-1 py-0.5 rounded whitespace-nowrap z-10">
                  {{ shade.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contrast Ratio & WCAG Badges -->
          <div class="grid grid-cols-3 gap-4 pt-4 border-t border-[#C4C4C9]">
            <div class="col-span-2 bg-white p-5 rounded-2xl border border-[#C4C4C9]">
              <span class="block text-[12px] font-bold font-mono text-[#55555D] uppercase mb-1">Contrast Ratio</span>
              <span class="font-mono text-5xl font-extrabold tracking-tight text-[#111113] tabular-nums">
                {{ contrastRatio }}<span class="text-3xl opacity-50">:1</span>
              </span>
            </div>

            <div class="flex flex-col gap-2">
              <div class="p-3 rounded-xl text-center flex flex-col justify-center border border-[#C4C4C9]"
                    :class="isWcagAa ? 'bg-[#111113] text-white' : 'bg-white text-[#111113]'">
                <span class="block text-[8px] font-mono uppercase tracking-wider opacity-70">WCAG AA</span>
                <span class="font-mono text-sm font-bold">{{ isWcagAa ? 'PASS' : 'FAIL' }}</span>
              </div>
              <div class="p-3 rounded-xl text-center flex flex-col justify-center border border-[#C4C4C9]"
                    :class="isWcagAaa ? 'bg-[#111113] text-white' : 'bg-white text-[#111113]'">
                <span class="block text-[8px] font-mono uppercase tracking-wider opacity-70">WCAG AAA</span>
                <span class="font-mono text-sm font-bold">{{ isWcagAaa ? 'PASS' : 'FAIL' }}</span>
              </div>
            </div>
          </div>

        </section>

        <!-- Right Column: Live Preview & Export -->
        <section class="flex flex-col justify-between space-y-6">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <span class="text-[12px] font-bold font-mono uppercase text-[#55555D]">Live Preview</span>

                <!-- Typography / Font Style Selector with Custom Theme Popup Options -->
                <select v-model="activeFont" aria-label="Select typography style" class="text-[10px] font-bold font-mono rounded-lg px-3 py-1.5 focus:outline-none border border-[#C4C4C9] cursor-pointer [&>option]:bg-[#1E1E1E] [&>option]:text-white">
                  <option value="font-sans">Sans-Serif (Modern Clean)</option>
                  <option value="font-serif">Serif (Editorial Classic)</option>
                  <option value="font-mono">Monospace (Code Engineer)</option>
                </select> 
              </div>
              
              <!-- Mode Badge with Clean Transparent Edit Button Matching Height -->
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase text-[#55555D] bg-white px-3 py-1.5 rounded-lg border border-[#C4C4C9]">
                  <span>Mode: {{ currentSim }}</span>
                </div>
                <button @click="toggleEdit" 
                        class="p-1.5 transition-colors cursor-pointer flex items-center justify-center rounded-lg border"
                        :class="isEditing ? 'bg-blue-500 text-white border-blue-500' : 'hover:text-black text-[#55555D] border-transparent'" 
                        title="Toggle text editing mode">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- SVG Color Blindness Filters -->
            <svg class="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
              <defs>
                <filter id="protanopia">
                  <feColorMatrix type="matrix" values="0.56667, 0.43333, 0,     0, 0  0.55833, 0.44167, 0,     0, 0  0,         0.24167, 0.75833, 0, 0  0,         0,       0,       1, 0" />
                </filter>
                <filter id="deuteranopia">
                  <feColorMatrix type="matrix" values="0.625, 0.375, 0,   0, 0  0.7,   0.3,   0,   0, 0  0,     0,     0.3,   0.7, 0, 0  0,     0,     0,   1, 0" />
                </filter>
                <filter id="tritanopia">
                  <feColorMatrix type="matrix" values="0.95, 0.05,  0,    0, 0  0,     0.433, 0.567, 0, 0  0,     0.475, 0.525, 0, 0  0,     0,     0,     1, 0" />
                </filter>
              </defs>
            </svg>

            <!-- Applied Preview Box with VS Code Style Dark Background & Close Button when Editing -->
            <div class="relative p-8 md:p-10 rounded-2xl border-2 space-y-6 shadow-inner transition-all duration-150 min-h-95 flex flex-col justify-between"
                  :style="isEditing ? { backgroundColor: '#1E1E1E', color: '#FFFFFF', filter: 'none' } : { backgroundColor: bgColor, color: textColor, filter: activeFilterStyle }"
                  :class="[activeFont, isEditing ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-[#C4C4C9]']">
                  
              <!-- VS Code Style Close (X) Button in Top Right Corner when Editing -->
              <button v-if="isEditing" @click="toggleEdit" 
                      class="absolute top-4 right-4 p-1.5 rounded-lg bg-[#2D2D2D] hover:bg-[#3C3C3C] text-gray-300 hover:text-white transition-colors cursor-pointer border border-[#444]"
                      title="Finish editing">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Added text-left and dir="ltr" to fix right-to-left typing bug -->
              <div class="space-y-6 text-left" dir="ltr">
                <h2 ref="titleRef" :contenteditable="isEditing" @input="e => previewTitle = e.target.innerText" class="font-bold text-3xl tracking-tight leading-tight outline-none rounded px-1 -mx-1 wrap-break-word overflow-hidden text-left" dir="ltr"></h2>
                <p ref="bodyRef" :contenteditable="isEditing" @input="e => previewText = e.target.innerText" class="text-base opacity-95 leading-relaxed outline-none rounded px-1 -mx-1 wrap-break-word overflow-hidden text-left" dir="ltr"></p>
              </div>

            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="openExportModal" 
                    class="bg-[#111113] text-white hover:bg-[#333338] px-6 py-3 rounded-xl flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider shadow-sm">
              <span>Export Token Schema</span>
            </button>
          </div>
        </section>

      </div>
    </main>

    <Footer />

    <!-- Export Modal Component -->
    <ExportModal 
      :is-open="isModalOpen" 
      :bg-color="bgColor" 
      :text-color="textColor" 
      :contrast-ratio="contrastRatio" 
      @close="isModalOpen = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import ExportModal from './components/ExportModal.vue'
import { useColorTokens } from './composables/useColorTokens'
import { useClipboard } from '@vueuse/core'

const { 
  bgColor, 
  textColor, 
  activeFont,
  savedPalettes, 
  setPreset, 
  resetToDefault,
  saveCurrentPalette, 
  deletePalette, 
  pickColorFor,
  contrastRatio, 
  isWcagAa, 
  isWcagAaa,
  backgroundScale 
} = useColorTokens()

const { copy, copied } = useClipboard()

const isModalOpen = ref(false)
const currentSim = ref('normal')
const isEditing = ref(false)
const previewTitle = ref('Component Preview')
const previewText = ref('Live testing for custom color pairings and legibility. Click here to edit and test your own words!')
const titleRef = ref(null)
const bodyRef = ref(null)

const simModes = [
  { id: 'normal', name: 'Normal' },
  { id: 'protanopia', name: 'Protan' },
  { id: 'deuteranopia', name: 'Deuter' },
  { id: 'tritanopia', name: 'Tritan' }
]

const activeFilterStyle = computed(() => {
  if (currentSim.value === 'protanopia') return 'url(#protanopia)'
  if (currentSim.value === 'deuteranopia') return 'url(#deuteranopia)'
  if (currentSim.value === 'tritanopia') return 'url(#tritanopia)'
  return 'none'
})

onMounted(() => {
  if (titleRef.value) titleRef.value.innerText = previewTitle.value
  if (bodyRef.value) bodyRef.value.innerText = previewText.value
})

function toggleEdit() {
  isEditing.value = !isEditing.value
  if (isEditing.value && titleRef.value) {
    setTimeout(() => {
      titleRef.value.focus()
    }, 50)
  }
}

function openExportModal() {
  isModalOpen.value = true
}

</script>