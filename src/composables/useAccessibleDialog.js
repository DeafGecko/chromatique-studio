import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useAccessibleDialog(isOpen, close) {
  const dialogRef = ref(null)
  let previouslyFocusedElement = null

  function restoreFocus() {
    previouslyFocusedElement?.focus?.()
    previouslyFocusedElement = null
  }

  watch(isOpen, async (open) => {
    if (!open) {
      restoreFocus()
      return
    }

    previouslyFocusedElement = document.activeElement
    await nextTick()
    dialogRef.value?.focus()
  })

  function onDialogKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab' || !dialogRef.value) return

    const focusableElements = [...dialogRef.value.querySelectorAll(focusableSelector)]
    if (focusableElements.length === 0) {
      event.preventDefault()
      dialogRef.value.focus()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements.at(-1)
    const activeElement = document.activeElement

    if (activeElement === dialogRef.value) {
      event.preventDefault()
      ;(event.shiftKey ? lastElement : firstElement).focus()
    } else if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  onBeforeUnmount(restoreFocus)

  return { dialogRef, onDialogKeydown }
}