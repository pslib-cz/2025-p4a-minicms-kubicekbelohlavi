import Link from "next/link";

type PaginationLinksProps = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
};

function createHref(searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value);
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function PaginationLinks({
  page,
  searchParams,
  totalPages,
}: PaginationLinksProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination">
      <Link
        aria-disabled={page <= 1}
        className={`secondary-button ${page <= 1 ? "is-disabled" : ""}`}
        href={createHref(searchParams, page - 1)}
      >
        Previous
      </Link>
      <span>
        Page {page} of {totalPages}
      </span>
      <Link
        aria-disabled={page >= totalPages}
        className={`secondary-button ${page >= totalPages ? "is-disabled" : ""}`}
        href={createHref(searchParams, page + 1)}
      >
        Next
      </Link>
    </nav>
  );
}
