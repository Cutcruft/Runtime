import { useCfg, iconView, type ImageConfig } from '@cutcrft/plugin-sdk'
import type { ComponentProps } from './common'

export default function UiImage(props: ComponentProps) {
  const cfg = useCfg<ImageConfig>(props.config, { src: '', alt: '', fit: 'cover' })
  const icon = iconView(cfg.value.src)
  const src = icon.src ?? cfg.value.src ?? ''
  const style: Record<string, string> = {
    objectFit: cfg.value.fit ?? 'cover',
    ...(cfg.value.style ?? {})
  }

  return (
    <img
      class={`ui-image${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      src={src}
      alt={cfg.value.alt ?? ''}
      title={cfg.value.tooltip}
      style={style}
      width={cfg.value.width}
      height={cfg.value.height}
    />
  )
}
