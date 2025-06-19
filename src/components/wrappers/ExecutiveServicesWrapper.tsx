'use client'

import dynamic from 'next/dynamic'

const ExecutiveServices = dynamic(
  () => import('@/components/sections/ExecutiveServices'),
  { ssr: false }
)

export default function ExecutiveServicesWrapper() {
  return <ExecutiveServices />
}
