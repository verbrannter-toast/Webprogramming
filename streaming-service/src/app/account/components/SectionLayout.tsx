import React from 'react';

export default function SectionLayout({
  sectionTitle, 
  children,
  buttonAtBottom = false
}: {
  sectionTitle?: string; 
  children: React.ReactNode
  buttonAtBottom?: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* <h3 className="text-3xl font-bold mb-8">{sectionTitle}</h3> */}
      <div className={`bg-zinc-900 p-5 rounded-lg ${buttonAtBottom ? 'flex flex-col min-h-[calc(100vh-8rem)]' : 'space-y-4'
      }`}>

        { buttonAtBottom ? (
          <>
            <div className="flex-grow space-y-4">
              {React.Children.toArray(children).slice(0, -1)}
            </div>
            <div className="mt-6">
              {React.Children.toArray(children).slice(-1)}
            </div>
          </>
          ) : (
            children
          )}

      </div>
    </div>
  )
}