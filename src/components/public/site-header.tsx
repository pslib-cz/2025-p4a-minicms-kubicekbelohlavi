import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">Ink!</span>
          <span>Inkspire</span>
        </Link>
        <nav className="site-nav">
          <Link href="/">Titulka</Link>
          <Link href="/dashboard">Studio</Link>
          <Link href="/login">Přihlášení</Link>
          <Link href="/register">Registrace</Link>
        </nav>
      </div>
    </header>
  );
}
