import { describe, it, expect, beforeEach } from 'vitest'
import { useColorTokens } from './useColorTokens'

beforeEach(() => {
  localStorage.clear()
})

describe('useColorTokens', () => {
  describe('defaults', () => {
    it('starts with the Raw Linen pair', () => {
      const { bgColor, textColor } = useColorTokens()
      expect(bgColor.value).toBe('#D8D8DC')
      expect(textColor.value).toBe('#111113')
    })

    it('ships four read-only preset palettes', () => {
      const { savedPalettes } = useColorTokens()
      expect(savedPalettes.value.map(p => p.name)).toEqual([
        'Raw Linen',
        'Cast Iron',
        'Modern Olive',
        'Swiss Dark',
      ])
    })
  })

  describe('WCAG contrast', () => {
    it('returns 21:1 for black on white', () => {
      const { bgColor, textColor, contrastRatio } = useColorTokens()
      bgColor.value = '#FFFFFF'
      textColor.value = '#000000'
      expect(contrastRatio.value).toBe('21.00')
    })

    it('matches the default pair at 13.27:1', () => {
      const { contrastRatio } = useColorTokens()
      expect(contrastRatio.value).toBe('13.27')
    })

    it('gives the same ratio regardless of which colour is foreground', () => {
      const { bgColor, textColor, contrastRatio } = useColorTokens()
      bgColor.value = '#0D0D0D'
      textColor.value = '#E53E3E'
      const forward = contrastRatio.value
      bgColor.value = '#E53E3E'
      textColor.value = '#0D0D0D'
      expect(contrastRatio.value).toBe(forward)
    })

    it('reads 3-digit hex the same as 6-digit hex', () => {
      const { bgColor, textColor, contrastRatio } = useColorTokens()
      bgColor.value = '#FFF'
      textColor.value = '#000'
      expect(contrastRatio.value).toBe('21.00')
    })

    it('passes AA at 4.5:1 and fails AAA below 7:1', () => {
      const { bgColor, textColor, isWcagAa, isWcagAaa } = useColorTokens()
      // Swiss Dark preset: 4.71:1
      bgColor.value = '#0D0D0D'
      textColor.value = '#E53E3E'
      expect(isWcagAa.value).toBe(true)
      expect(isWcagAaa.value).toBe(false)
    })

    it('fails both levels for pale grey on pale grey', () => {
      const { bgColor, textColor, isWcagAa, isWcagAaa } = useColorTokens()
      bgColor.value = '#D8D8DC'
      textColor.value = '#C8C8CC'
      expect(isWcagAa.value).toBe(false)
      expect(isWcagAaa.value).toBe(false)
    })
  })

  describe('APCA contrast', () => {
    // Reference: APCA-W3 0.1.9 gives Lc 106.0 for black text on white.
    // This is the value the APCA reference calculator returns.
    it('returns the APCA reference value for black on white', () => {
      const { bgColor, textColor, apcaContrast } = useColorTokens()
      bgColor.value = '#FFFFFF'
      textColor.value = '#000000'
      expect(parseFloat(apcaContrast.value)).toBeCloseTo(106.0, 0)
    })

    it('rates the default pair as Good', () => {
      const { apcaRating } = useColorTokens()
      expect(apcaRating.value).toBe('Good')
    })

    it('rates a near-invisible pair as Fail', () => {
      const { bgColor, textColor, apcaRating } = useColorTokens()
      bgColor.value = '#D8D8DC'
      textColor.value = '#C8C8CC'
      expect(apcaRating.value).toBe('Fail')
    })
  })

  describe('setPreset / resetToDefault', () => {
    it('setPreset writes both colours', () => {
      const { bgColor, textColor, setPreset } = useColorTokens()
      setPreset('#1A1A1E', '#F4F4F6')
      expect(bgColor.value).toBe('#1A1A1E')
      expect(textColor.value).toBe('#F4F4F6')
    })

    it('resetToDefault restores Raw Linen', () => {
      const { bgColor, textColor, setPreset, resetToDefault } = useColorTokens()
      setPreset('#1A1A1E', '#F4F4F6')
      resetToDefault()
      expect(bgColor.value).toBe('#D8D8DC')
      expect(textColor.value).toBe('#111113')
    })
  })

  describe('saved palettes', () => {
    it('saves the current pair with the given name', () => {
      const { bgColor, textColor, savedPalettes, saveCurrentPalette } = useColorTokens()
      bgColor.value = '#123456'
      textColor.value = '#FEDCBA'
      saveCurrentPalette('Mine')
      const last = savedPalettes.value.at(-1)
      expect(last).toEqual({ name: 'Mine', bg: '#123456', text: '#FEDCBA' })
    })

    it('falls back to a numbered name when none is given', () => {
      const { bgColor, textColor, savedPalettes, saveCurrentPalette } = useColorTokens()
      bgColor.value = '#123456'
      textColor.value = '#FEDCBA'
      saveCurrentPalette()
      expect(savedPalettes.value.at(-1).name).toBe(`Palette ${savedPalettes.value.length}`)
    })

    it('does not save a duplicate pair', () => {
      const { savedPalettes, saveCurrentPalette } = useColorTokens()
      const before = savedPalettes.value.length
      saveCurrentPalette('Again')
      expect(savedPalettes.value.length).toBe(before)
    })

    it('deletePalette removes by index', () => {
      const { savedPalettes, deletePalette } = useColorTokens()
      deletePalette(0)
      expect(savedPalettes.value.map(p => p.name)).not.toContain('Raw Linen')
    })
  })

  describe('backgroundScale', () => {
    it('produces nine steps with the base at 500', () => {
      const { backgroundScale } = useColorTokens()
      const labels = backgroundScale.value.map(s => s.label)
      expect(labels).toEqual(['100', '200', '300', '400', '500 (Base)', '600', '700', '800', '900'])
    })

    it('keeps the base swatch equal to the surface colour', () => {
      const { bgColor, backgroundScale } = useColorTokens()
      const base = backgroundScale.value.find(s => s.label === '500 (Base)')
      expect(base.hex).toBe(bgColor.value)
    })

    it('moves lighter steps toward white and darker steps toward black', () => {
      const { backgroundScale } = useColorTokens()
      const lum = hex => parseInt(hex.slice(1, 3), 16)
      const steps = backgroundScale.value
      expect(lum(steps[0].hex)).toBeGreaterThan(lum(steps[4].hex))
      expect(lum(steps[8].hex)).toBeLessThan(lum(steps[4].hex))
    })
  })
})
