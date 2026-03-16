import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container empty-state">
      <h2>Not found</h2>
      <p>The requested page or article does not exist.</p>
      <Link className="primary-button" href="/">
        Back to homepage
      </Link>
    </div>
  );
}
