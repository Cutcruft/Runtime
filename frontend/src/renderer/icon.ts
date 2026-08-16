export interface IconView {
  glyph?: string
  src?: string
}

export function iconView(icon: string | undefined | null): IconView {
  if (!icon) return {}
  const trimmed = icon.trim()
  if (trimmed.startsWith('/') || /^https?:/i.test(trimmed) || trimmed.startsWith('data:')) {
    return { src: trimmed }
  }
  return { glyph: trimmed }
}
