import React from 'react'

interface SectionHeadingProps {
  tag: string
  title: string
  text: string
  children?: React.ReactNode
}

export default function SectionHeading({ tag, title, text, children }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">{tag}</span>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="mt-1 text-muted-foreground">{text}</p>
      </div>
      {children}
    </div>
  )
}