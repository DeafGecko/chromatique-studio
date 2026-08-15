<template>
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div class="w-full max-w-lg bg-[#EFEFF2] border border-[#C4C4C9] rounded-3xl p-8 shadow-2xl space-y-6">
      
<!-- Modal Header -->
            <div class="flex justify-between items-center border-b border-[#C4C4C9] pb-4">
                  <h3 class="font-mono text-xs font-bold uppercase tracking-wider text-[#55555D]">Export Token Schema</h3>
                  <button @click="$emit('close')" class="p-1 text-[#111113] hover:text-[#55555D] transition-colors flex items-center justify-center" aria-label="Close Modal">
                        <svg class="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                  </button>
</div>

<!-- Format Selector Tabs -->
                  <div class="flex gap-2">
                        <button v-for="tab in ['css', 'tailwind', 'json']" :key="tab"
                              @click="activeTab = tab"
                              class="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-[#C4C4C9] transition-colors"
                              :class="activeTab === tab ? 'bg-[#111113] text-white border-[#111113]' : 'bg-white text-[#111113] hover:bg-[#D8D8DC]'">
                        {{ tab }}
                        </button>
                  </div>

<!-- Code Output Preview -->
                  <div class="relative bg-white rounded-2xl border border-[#C4C4C9] p-5 font-mono text-xs text-[#111113] overflow-x-auto max-h-48">
                        <pre>{{ formattedOutput }}</pre>
                  </div>

<!-- Modal Footer Actions -->
                  <div class="flex justify-end gap-3 pt-2">                   
                        <button @click="copyCode" class="px-6 py-3 rounded-xl bg-[#111113] text-white hover:bg-[#333338] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap">
                              <svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>{{ copied ? 'Copied to Clipboard' : 'Copy Code' }}</span>
                        </button>
                  </div>

            </div>
      </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useClipboard } from '@vueuse/core'

const props = defineProps({
      isOpen: Boolean,
      bgColor: String,
      textColor: String,
      contrastRatio: String
})

defineEmits(['close'])

const activeTab = ref('css')
const { copy, copied } = useClipboard()

const formattedOutput = computed(() => {
      if (activeTab.value === 'css') {
            return `:root {\n  --color-surface: ${props.bgColor};\n  --color-on-surface: ${props.textColor};\n  --contrast-ratio: ${props.contrastRatio};\n}`
            } else if (activeTab.value === 'tailwind') {
            return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        surface: '${props.bgColor}',\n        'on-surface': '${props.textColor}',\n      }\n    }\n  }\n}`
            } else {
            return JSON.stringify({
            version: "1.0",
            tokens: {
            surface: { value: props.bgColor, type: "color" },
            onSurface: { value: props.textColor, type: "color" },
            contrastRatio: { value: props.contrastRatio, type: "number" }
            }
            }, null, 2)
      }
})

function copyCode() {
      copy(formattedOutput.value)
}
</script>
