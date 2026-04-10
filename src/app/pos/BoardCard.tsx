import React from 'react'

interface BoardCardProps {
  title: string
  subtitle: string
  tone?: string
  children: React.ReactNode
}

export default function BoardCard({ title, subtitle, tone, children }: BoardCardProps) {
  return (
    <div className={`rounded-2xl border border-border bg-white p-6 shadow-sm ${tone === 'accent-panel' ? 'bg-primary/5 border-primary/20' : ''}`}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}