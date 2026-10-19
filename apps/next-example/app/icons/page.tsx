import { getCatalog } from './catalog'
import { IconGallery } from './IconGallery'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Icon Gallery · Design system' }

export default async function IconsPage() {
  const icons = (await getCatalog()).map(({ name, componentName }) => ({ name, componentName }))
  return <IconGallery icons={icons} />
}
