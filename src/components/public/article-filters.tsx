type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
};

type ArticleFiltersProps = {
  categories: TaxonomyItem[];
  query?: string;
  selectedCategory?: string;
  selectedTag?: string;
  tags: TaxonomyItem[];
};

export function ArticleFilters({
  categories,
  query,
  selectedCategory,
  selectedTag,
  tags,
}: ArticleFiltersProps) {
  return (
    <form className="filter-card" method="get">
      <div className="filter-grid">
        <div className="filter-field">
          <label htmlFor="q">Search</label>
          <input defaultValue={query} id="q" name="q" placeholder="Search title or text" />
        </div>
        <div className="filter-field">
          <label htmlFor="category">Category</label>
          <select defaultValue={selectedCategory || ""} id="category" name="category">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="tag">Tag</label>
          <select defaultValue={selectedTag || ""} id="tag" name="tag">
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.slug}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="filter-actions">
        <button className="primary-button" type="submit">
          Apply filters
        </button>
        <Link className="secondary-button" href="/">
          Reset
        </Link>
      </div>
    </form>
  );
}
import Link from "next/link";
