import React from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function DesignSystemPage() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Design System (example)</h1>

      <section>
        <h2 className="text-lg font-semibold">Buttons</h2>
        <div className="mt-4 flex gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Card</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-md font-semibold">Example card</h3>
            <p className="mt-2 text-sm text-slate-600">This is a sample card used in the design system.</p>
          </Card>
          <Card>
            <h3 className="text-md font-semibold">Card variant</h3>
            <p className="mt-2 text-sm text-slate-600">Another example.</p>
          </Card>
        </div>
      </section>
    </main>
  )
}
