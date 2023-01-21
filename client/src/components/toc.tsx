export interface TOCProps {
  items: TOCItem[]
}

export interface TOCItem {
  label: string
  href: string
}

export default function TOC({items}: TOCProps) {
  return (
    <nav className='toc'>
      <ul>
        {
          items.map(({label, href}: TOCItem) => (
            <li>
              <a
                href={href}
              >{label}</a>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}