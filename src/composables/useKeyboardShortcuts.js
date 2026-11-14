import { ref, onMounted, onBeforeUnmount } from 'vue'

const TEXT_TAGS = ['INPUT', 'TEXTAREA', 'SELECT']

// bindings: { [key]: { label, handler, allowInText? } }
export function useKeyboardShortcuts(bindings) {
  const keyboardUsed = ref(false)

  function isTyping(target) {
    return TEXT_TAGS.includes(target?.tagName) || Boolean(target?.closest?.('[contenteditable="true"]'))
  }

  function onKeydown(event) {
    keyboardUsed.value = true
    if (event.ctrlKey || event.metaKey || event.altKey) return

    const binding = bindings[event.key.toLowerCase()]
    if (!binding) return

    if (isTyping(event.target) && !binding.allowInText) return

    event.preventDefault()
    binding.handler()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

  const legend = Object.entries(bindings).map(([key, { label }]) => ({ key, label }))

  return { keyboardUsed, legend }
}
