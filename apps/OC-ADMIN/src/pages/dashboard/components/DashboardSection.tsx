import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type RootProps = ComponentPropsWithoutRef<'section'>

function Root({ className = '', children, ...props }: RootProps) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </section>
  )
}

type HeaderProps = ComponentPropsWithoutRef<'div'>

function Header({ className = '', children, ...props }: HeaderProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-4 sm:px-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

type TitleProps = {
  icon: LucideIcon
  children: ReactNode
  description?: string
}

function Title({ icon: Icon, children, description }: TitleProps) {
  return (
    <div className="min-w-0 flex-1">
      <h2 className="flex min-w-0 items-center gap-2 font-semibold text-gray-900">
        <Icon className="h-5 w-5 shrink-0 text-[#2C67BC]" />
        <span className="min-w-0 break-words">{children}</span>
      </h2>
      {description && (
        <p className="ml-7 mt-1 break-words text-xs text-gray-500">
          {description}
        </p>
      )}
    </div>
  )
}

type BodyProps = ComponentPropsWithoutRef<'div'>

function Body({ className = '', children, ...props }: BodyProps) {
  return (
    <div className={`p-4 sm:p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

function Action({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-wrap justify-end gap-2">{children}</div>
  )
}

export const DashboardSection = {
  Root,
  Header,
  Title,
  Action,
  Body,
}
