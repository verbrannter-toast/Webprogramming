import React from 'react';

export default function SectionLayout({
  sectionTitle, children
}: {
  sectionTitle: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold mb-8">{sectionTitle}</h3>
      <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
        {children}
      </div>
    </div>
  )
}