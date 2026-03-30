type DashboardStudioHeroProps = {
  articleCount: number;
  categoryCount: number;
  tagCount: number;
};

export function DashboardStudioHero({
  articleCount,
  categoryCount,
  tagCount,
}: DashboardStudioHeroProps) {
  return (
    <div className="dashboard-intro studio-intro" data-burst="Studio!">
      <span className="eyebrow">Redakční studio</span>
      <h1 data-text="Spravujte své články, kategorie a štítky.">
        Spravujte své články, kategorie a štítky.
      </h1>
      <p>
        Všechny akce jdou přes chráněnou serverovou vrstvu — autentizace,
        vlastnictví i validace zůstávají pod kontrolou serveru.
      </p>
      <div className="studio-stat-grid">
        <div className="studio-stat-card">
          <span>Články</span>
          <strong>{articleCount}</strong>
        </div>
        <div className="studio-stat-card">
          <span>Kategorie</span>
          <strong>{categoryCount}</strong>
        </div>
        <div className="studio-stat-card">
          <span>Štítky</span>
          <strong>{tagCount}</strong>
        </div>
      </div>
    </div>
  );
}
