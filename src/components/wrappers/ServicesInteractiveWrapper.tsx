'use client'

import dynamic from 'next/dynamic'

const ServicesInteractive = dynamic(
  () => import('@/components/sections/ServicesInteractive'),
  { ssr: false }
)

export default function ServicesInteractiveWrapper() {
  return <ServicesInteractive />
}
