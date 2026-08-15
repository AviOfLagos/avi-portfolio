import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ResourcesShell, metadataForTab } from '../shell'
import { TABS, isTabSlug } from '../tabs'

export function generateStaticParams() {
  return TABS.map((t) => ({ tab: t.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tab: string }>
}): Promise<Metadata> {
  const { tab } = await params
  if (!isTabSlug(tab)) return {}
  return metadataForTab(tab)
}

export default async function ResourcesTabPage({ params }: { params: Promise<{ tab: string }> }) {
  const { tab } = await params
  if (!isTabSlug(tab)) notFound()
  return <ResourcesShell tab={tab} />
}
