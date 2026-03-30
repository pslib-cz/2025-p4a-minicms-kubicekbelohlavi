import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container empty-state" data-burst="404!">
      <h2>Tenhle vesmír neexistuje.</h2>
      <p>Požadovaná stránka se v žádné z paralelních dimenzí nenašla.</p>
      <Link className="primary-button" href="/">
        Zpět na titulku
      </Link>
    </div>
  );
}
