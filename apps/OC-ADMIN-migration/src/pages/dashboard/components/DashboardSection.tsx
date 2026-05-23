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
      className={`flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4 ${className}`}
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
    <div>
      <h2 className="flex items-center gap-2 font-semibold text-gray-900">
        <Icon className="h-5 w-5 text-[#2C67BC]" />
        {children}
      </h2>
      {description && (
        <p className="ml-7 mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  )
}

type BodyProps = ComponentPropsWithoutRef<'div'>

function Body({ className = '', children, ...props }: BodyProps) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

function Action({ children }: { children: ReactNode }) {
  return <div className="shrink-0">{children}</div>
}

export const DashboardSection = {
  Root,
  Header,
  Title,
  Action,
  Body,
}
