import React from 'react'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
}

export function Image(props: ImageProps): JSX.Element {
  // Simple shim for next/image -> <img>
  const { style, ...rest } = props
  return <img loading="lazy" decoding="async" {...rest} />
}


