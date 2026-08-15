<template>
      <div v-if="isOpen" class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="$emit('close')">
            <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl text-[#111113] border border-[#C4C4C9]">
                  <button @click="$emit('close')" class="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                        <h1 class="text-2xl font-bold mb-6 font-mono uppercase">Terms of Service</h1>
                        <div class="space-y-4 text-sm text-[#55555D]">
                        <p>Welcome to 09 Labs. By using our services, you agree to these terms.</p>
                        <h2 class="font-bold text-[#111113]">1. Use of Service</h2>
                        <p>You agree to use our application for lawful purposes and in accordance with these terms.</p>
                        <h2 class="font-bold text-[#111113]">2. Intellectual Property</h2>
                        <p>All content, features, and functionality are the exclusive property of 09 Labs.</p>
                  </div>
            </div>
      </div>
</template>

<script setup>
defineProps({
      isOpen: {
            type: Boolean,
      required: true
      }
})
defineEmits(['close'])
</script>