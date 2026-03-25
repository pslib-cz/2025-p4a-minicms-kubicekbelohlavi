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
      <span className="eyebrow">Klientské redakční studio</span>
      <h1>Spravujte jen vlastní příběhy, ale s energií titulní strany.</h1>
      <p>
        Všechny akce jdou přes chráněnou serverovou vrstvu, takže autentizace,
        vlastnictví i validace zůstávají pod kontrolou serveru.
      </p>
      <div className="studio-stat-grid">
        <div className="studio-stat-card">
          <span>Články</span>
          <strong>{articleCount}</strong>
        </div>
        <div className="studio-stat-card">
          <span>Rubriky</span>
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
