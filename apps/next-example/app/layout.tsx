import Link from 'next/link'
import '@company/ui-react-web/theme.css'
import './globals.css'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header__inner">
            <Link className="site-header__brand" href="/">Design system</Link>
            <nav className="site-header__nav" aria-label="Playground navigation">
              <Link href="/">Components</Link>
              <Link href="/primitives">Primitives</Link>
              <Link href="/developer-workspace">Developer workspace</Link>
              <Link href="/icons">Icons</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
