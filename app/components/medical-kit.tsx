import type { ButtonHTMLAttributes, ReactNode } from "react";

export function MedicalSpace({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={`mk-space ${className}`}>
      <div className="mk-stars" aria-hidden="true" />
      <div className="mk-orbit mk-orbit-one" aria-hidden="true" />
      <div className="mk-orbit mk-orbit-two" aria-hidden="true" />
      {children}
    </main>
  );
}

export function MedicalCard({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return <section id={id} className={`mk-card ${className}`}>{children}</section>;
}

export function MedicalBadge({
  children,
  tone = "cyan",
}: {
  children: ReactNode;
  tone?: "cyan" | "amber" | "red" | "muted";
}) {
  return <span className={`mk-badge mk-badge-${tone}`}>{children}</span>;
}

export function MedicalAlert({
  title,
  children,
  tone = "info",
}: {
  title: string;
  children: ReactNode;
  tone?: "info" | "warning" | "danger";
}) {
  return (
    <aside className={`mk-alert mk-alert-${tone}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}

export function MedicalButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`mk-button ${className}`} {...props}>{children}</button>;
}

export function MedicalProgress({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="mk-progress">
      <div><span>{label}</span><strong>{value}%</strong></div>
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function MedicalNumberInput({
  label,
  unit,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  value?: number;
  onChange: (value?: number) => void;
}) {
  return (
    <label className="mk-number">
      <span>{label}</span>
      <div>
        <input
          aria-label={label}
          type="number"
          min="0"
          step="any"
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value === "" ? undefined : Number(event.target.value))}
        />
        <small>{unit}</small>
      </div>
    </label>
  );
}

export function MedicalBottomNavigation({
  items,
}: {
  items: Array<{ href: string; icon: string; label: string }>;
}) {
  return (
    <nav className="mk-bottom-nav" aria-label="画面内ナビゲーション">
      {items.map((item) => (
        <a key={item.href} href={item.href}><span>{item.icon}</span>{item.label}</a>
      ))}
    </nav>
  );
}

