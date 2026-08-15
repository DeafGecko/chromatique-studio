<template>
  <footer class="w-full py-6 px-8 border-t border-[#C4C4C9] flex flex-col md:flex-row items-center justify-between text-xs font-mono text-[#55555D]">
    <span>© {{ currentYear }} 09 Labs • Built with Vue & Vite</span>
    <div class="flex gap-4 mt-2 md:mt-0">
      <a href="https://github.com/DeafGecko" target="_blank" rel="noopener" class="hover:text-[#111113] transition-colors">GitHub</a>
      <button @click="showPrivacy = true" class="hover:text-[#111113] transition-colors cursor-pointer">Privacy</button>
      <button @click="showTerms = true" class="hover:text-[#111113] transition-colors cursor-pointer">Terms</button>
    </div>
  </footer>

  <PrivacyPolicy :isOpen="showPrivacy" @close="showPrivacy = false" />
  <TermsOfService :isOpen="showTerms" @close="showTerms = false" />
</template>

<script setup>
import { ref } from 'vue'
import PrivacyPolicy from './PrivacyPolicy.vue'
import TermsOfService from './TermsOfService.vue'

const currentYear = new Date().getFullYear()
const showPrivacy = ref(false)
const showTerms = ref(false)
</script>