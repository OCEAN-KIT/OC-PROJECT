import {
  Link as TanStackLink,
  type LinkProps as TanStackLinkProps,
} from '@tanstack/react-router'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type NextCompatLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href: string
  children?: ReactNode
}

export default function Link({
  href,
  children,
  ...props
}: NextCompatLinkProps) {
  return (
    <TanStackLink {...(props as TanStackLinkProps)} href={href}>
      {children}
    </TanStackLink>
  )
}
