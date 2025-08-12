import React, { type JSX } from 'react'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
}

export function Image(props: ImageProps): JSX.Element {
  // Simple shim for next/image -> <img>
  // Preserve style and allow responsive attributes like sizes.
  const { style, sizes, ...rest } = props
  return <img loading="lazy" decoding="async" sizes={sizes} style={style} {...rest} />
}


