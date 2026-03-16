import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">I</span>
          <span>Inkspire</span>
        </Link>
        <nav className="site-nav">
          <Link href="/">Published articles</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/register">Register</Link>
        </nav>
      </div>
    </header>
  );
}
