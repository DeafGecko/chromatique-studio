import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useKeyboardShortcuts } from './useKeyboardShortcuts'

let wrapper

function setup(bindings) {
  let result
  const Host = defineComponent({
    setup() {
      result = useKeyboardShortcuts(bindings)
      return () => h('div')
    },
  })
  wrapper = mount(Host, { attachTo: document.body })
  return result
}

function press(key, init = {}, target = window) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(event)
  return event
}

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  document.body.innerHTML = ''
})

describe('useKeyboardShortcuts', () => {
  it('runs the handler for a bound key', () => {
    const handler = vi.fn()
    setup({ s: { label: 'Save', handler } })
    press('s')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('matches keys case-insensitively', () => {
    const handler = vi.fn()
    setup({ s: { label: 'Save', handler } })
    press('S', { shiftKey: true })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('ignores unbound keys', () => {
    const handler = vi.fn()
    setup({ s: { label: 'Save', handler } })
    press('x')
    expect(handler).not.toHaveBeenCalled()
  })

  it('ignores shortcuts while Ctrl, Cmd or Alt is held', () => {
    const handler = vi.fn()
    setup({ s: { label: 'Save', handler } })
    press('s', { ctrlKey: true })
    press('s', { metaKey: true })
    press('s', { altKey: true })
    expect(handler).not.toHaveBeenCalled()
  })

  it('ignores shortcuts while typing in an input', () => {
    const handler = vi.fn()
    setup({ s: { label: 'Save', handler } })
    const input = document.createElement('input')
    document.body.appendChild(input)
    press('s', {}, input)
    expect(handler).not.toHaveBeenCalled()
  })

  it('ignores shortcuts inside contenteditable', () => {
    const handler = vi.fn()
    setup({ s: { label: 'Save', handler } })
    const editable = document.createElement('p')
    editable.setAttribute('contenteditable', 'true')
    document.body.appendChild(editable)
    press('s', {}, editable)
    expect(handler).not.toHaveBeenCalled()
  })

  it('still runs bindings marked allowInText while typing', () => {
    const handler = vi.fn()
    setup({ escape: { label: 'Exit', allowInText: true, handler } })
    const input = document.createElement('input')
    document.body.appendChild(input)
    press('Escape', {}, input)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('prevents the default action for handled keys only', () => {
    setup({ s: { label: 'Save', handler: () => {} } })
    expect(press('s').defaultPrevented).toBe(true)
    expect(press('x').defaultPrevented).toBe(false)
  })

  it('flags keyboardUsed on the first keydown', () => {
    const { keyboardUsed } = setup({})
    expect(keyboardUsed.value).toBe(false)
    press('Tab')
    expect(keyboardUsed.value).toBe(true)
  })

  it('builds the legend from the bindings', () => {
    const { legend } = setup({
      s: { label: 'Save pairing', handler: () => {} },
      '/': { label: 'Focus hex', handler: () => {} },
    })
    expect(legend).toEqual([
      { key: 's', label: 'Save pairing' },
      { key: '/', label: 'Focus hex' },
    ])
  })
})
