import type { Metadata } from 'next'
import { ResourcesShell, metadataForTab } from './shell'

export const metadata: Metadata = metadataForTab('writing')

export default function ResourcesPage() {
  return <ResourcesShell tab="writing" />
}
