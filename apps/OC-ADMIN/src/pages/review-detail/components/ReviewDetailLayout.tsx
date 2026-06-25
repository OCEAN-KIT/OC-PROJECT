type ReviewDetailLayoutProps = {
  children: React.ReactNode
}

export function ReviewDetailLayout({ children }: ReviewDetailLayoutProps) {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-10 text-gray-900 lg:px-6">
      <div className="mx-auto max-w-[1100px]">{children}</div>
    </main>
  )
}
