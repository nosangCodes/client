import React from 'react'

type Props = {
  children: React.ReactNode
}

export default function layout({ children }: Props) {
  return (
    <section className='min-h-screen'>
      <div className='bg-primary px-4 py-2'>
        <h1 className='text-2xl font-semibold text-secondary'>Business Name</h1>
      </div>
      <div className=''>
        {children}
      </div>
    </section>
  )
}