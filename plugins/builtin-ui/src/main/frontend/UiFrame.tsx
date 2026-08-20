import { useCfg, type FrameConfig } from '@cutcrft/runtime-client'
import type { ComponentProps } from './common'

export default function UiFrame(props: ComponentProps) {
  const cfg = useCfg<FrameConfig>(props.config, { src: '', height: '100%' })
  const src = cfg.value.src
  const style: Record<string, string> = {
    width: cfg.value.width ?? '100%',
    height: cfg.value.height ?? '100%',
    border: 'none',
    ...(cfg.value.style ?? {})
  }

  return (
    <iframe
      class={`ui-frame${cfg.value.className ? ' ' + cfg.value.className : ''}`}
      src={src}
      title={cfg.value.title ?? cfg.value.tooltip}
      style={style}
      sandbox={cfg.value.sandbox}
    />
  )
}
