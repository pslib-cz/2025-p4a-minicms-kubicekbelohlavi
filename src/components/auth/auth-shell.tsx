import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  eyebrow: string;
  children: ReactNode;
};

export function AuthShell({
  children,
  description,
  eyebrow,
  title,
}: AuthShellProps) {
  return (
    <section className="auth-layout" data-burst="Vstup!">
      <div className="auth-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="auth-card">{children}</div>
    </section>
  );
}
