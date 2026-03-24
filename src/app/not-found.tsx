import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container empty-state">
      <h2>Tohle okno do paralelního čísla je prázdné.</h2>
      <p>Požadovaná stránka nebo článek v archivu neexistuje.</p>
      <Link className="primary-button" href="/">
        Zpět na titulku
      </Link>
    </div>
  );
}
