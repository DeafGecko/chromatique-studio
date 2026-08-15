// src/composables/useColorTokens.js
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'

export function useColorTokens() {
  const bgColor = useStorage('chromatique-bg', '#D8D8DC')
  const textColor = useStorage('chromatique-text', '#111113')
  const activeFont = useStorage('chromatique-font', 'font-sans')
  
  const savedPalettes = useStorage('chromatique-saved-palettes', [
    { name: 'Raw Linen', bg: '#D8D8DC', text: '#111113' },
    { name: 'Cast Iron', bg: '#1A1A1E', text: '#F4F4F6' },
    { name: 'Modern Olive', bg: '#E4E6DF', text: '#2A3025' },
    { name: 'Swiss Dark', bg: '#0D0D0D', text: '#E53E3E' }
  ])

  function setPreset(bg, text) {
    bgColor.value = bg
    textColor.value = text
  }

  function resetToDefault() {
    bgColor.value = '#D8D8DC'
    textColor.value = '#111113'
  }

  function saveCurrentPalette(customName) {
    const name = customName || `Palette ${savedPalettes.value.length + 1}`
    const exists = savedPalettes.value.some(p => p.bg === bgColor.value && p.text === textColor.value)
    if (!exists) {
      savedPalettes.value.push({ name, bg: bgColor.value, text: textColor.value })
    }
  }

  function deletePalette(index) {
    savedPalettes.value.splice(index, 1)
  }

  async function pickColorFor(targetToken) {
    if (!window.EyeDropper) {
      alert('Your browser does not support the Eyedropper API.')
      return
    }
    try {
      const dropper = new window.EyeDropper()
      const result = await dropper.open()
      if (result?.sRGBHex) {
        if (targetToken === 'bg') {
          bgColor.value = result.sRGBHex
        } else {
          textColor.value = result.sRGBHex
        }
      }
    } catch (e) {
      // User canceled eyedropper
    }
  }

  function getLuminance(hex) {
    try {
      let cleanHex = hex.replace('#', '')
      if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('')
      }
      let rgb = parseInt(cleanHex, 16)
      let r = (rgb >> 16) & 0xff
      let g = (rgb >> 8) & 0xff
      let b = (rgb >> 0) & 0xff
      
      const a = [r, g, b].map(v => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      })
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
    } catch {
      return 0.5
    }
  }

  const contrastRatio = computed(() => {
    const lum1 = getLuminance(bgColor.value)
    const lum2 = getLuminance(textColor.value)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    const ratio = (brightest + 0.05) / (darkest + 0.05)
    return ratio.toFixed(2)
  })

  const isWcagAa = computed(() => parseFloat(contrastRatio.value) >= 4.5)
  const isWcagAaa = computed(() => parseFloat(contrastRatio.value) >= 7.0)

  function hexToRgb(hex) {
    let cleanHex = hex.replace('#', '')
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('')
    }
    const num = parseInt(cleanHex, 16)
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('').toUpperCase()
  }

  const backgroundScale = computed(() => {
    try {
      const { r, g, b } = hexToRgb(bgColor.value)
      return [
        { label: '100', hex: rgbToHex(r + (255 - r) * 0.8, g + (255 - g) * 0.8, b + (255 - b) * 0.8) },
        { label: '200', hex: rgbToHex(r + (255 - r) * 0.6, g + (255 - g) * 0.6, b + (255 - b) * 0.6) },
        { label: '300', hex: rgbToHex(r + (255 - r) * 0.4, g + (255 - g) * 0.4, b + (255 - b) * 0.4) },
        { label: '400', hex: rgbToHex(r + (255 - r) * 0.2, g + (255 - g) * 0.2, b + (255 - b) * 0.2) },
        { label: '500 (Base)', hex: bgColor.value },
        { label: '600', hex: rgbToHex(r * 0.8, g * 0.8, b * 0.8) },
        { label: '700', hex: rgbToHex(r * 0.6, g * 0.6, b * 0.6) },
        { label: '800', hex: rgbToHex(r * 0.4, g * 0.4, b * 0.4) },
        { label: '900', hex: rgbToHex(r * 0.2, g * 0.2, b * 0.2) }
      ]
    } catch {
      return []
    }
  })

  return {
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
  }
}