"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaExclamationTriangle, FaWarehouse } from "react-icons/fa";
import { StatusTone, statusTone } from "../data/wmsMockData";
import { useI18n, type Locale } from "../i18n";

type AppShellProps = {
  children: React.ReactNode;
  maxWidth?: string;
};

export function AppShell({ children, maxWidth = "max-w-7xl" }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute right-0 top-48 h-80 w-80 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>
      <main className={`relative mx-auto w-full ${maxWidth} px-4 py-6 sm:px-6 lg:px-8`}>{children}</main>
    </div>
  );
}

function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();
  const options: Array<{ locale: Locale; flag: string; label: string }> = [
    { locale: "de", flag: "🇩🇪", label: "DE" },
    { locale: "en", flag: "🇬🇧", label: "EN" }
  ];

  return (
    <div className="flex rounded-2xl border border-slate-200/80 bg-white/70 p-1 shadow-sm" aria-label={t("common.language")}>
      {options.map((option) => (
        <button
          key={option.locale}
          type="button"
          onClick={() => setLocale(option.locale)}
          aria-label={option.locale === "de" ? t("common.deutsch") : t("common.english")}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition ${locale === option.locale ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}
        >
          <span>{option.flag}</span>
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}

type TopBarProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
};

export function TopBar({ title, subtitle, showBack = false, backHref = "/" }: TopBarProps) {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200/70 bg-white/70 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => router.push(backHref)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
            aria-label={t("common.back")}
          >
            <FaArrowLeft />
          </button>
        )}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20">
          <FaWarehouse />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">{subtitle || t("app.subtitle")}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title || t("app.title")}</h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-2 text-sm text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
          {t("common.systemActive")}
        </div>
        <LanguageSwitch />
      </div>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{eyebrow}</p>}
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[1.75rem] border border-slate-200/70 bg-white/75 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl ${className}`}>{children}</div>;
}

export function MetricCard({ label, value, hint, icon }: { label: string; value: React.ReactNode; hint?: string; icon?: React.ReactNode }) {
  return (
    <GlassCard className="min-h-[136px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
        </div>
        {icon && <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">{icon}</div>}
      </div>
      {hint && <p className="mt-4 text-sm text-slate-500">{hint}</p>}
    </GlassCard>
  );
}

const toneClasses: Record<StatusTone, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-700"
};

export function StatusBadge({ status, tone }: { status: string; tone?: StatusTone }) {
  const { statusLabel } = useI18n();
  const resolvedTone = tone || statusTone[status] || "slate";
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClasses[resolvedTone]}`}>{statusLabel(status)}</span>;
}

export function PrimaryButton({ children, onClick, type = "button", className = "" }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; className?: string }) {
  return (
    <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 ${className}`}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, type = "button", className = "" }: { children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; className?: string }) {
  return (
    <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-700 ${className}`}>
      {children}
    </button>
  );
}

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 ${className}`} />;
}

export function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100 ${className}`}>{children}</select>;
}

export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 ${className}`} />;
}

export function DataTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-white/80 shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 text-sm">{children}</table></div></div>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-slate-50/90 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{children}</thead>;
}

export function TableCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-4 align-middle text-slate-700 ${className}`}>{children}</td>;
}

export function EmptyState({ title, text }: { title: string; text?: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/60 p-8 text-center">
      <FaCheckCircle className="mx-auto mb-3 text-2xl text-emerald-500" />
      <p className="font-semibold text-slate-900">{title}</p>
      {text && <p className="mt-1 text-sm text-slate-500">{text}</p>}
    </div>
  );
}

export function AlertRow({ title, message, severity }: { title: string; message: string; severity: string }) {
  const { dataText } = useI18n();
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4">
      <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${severity === "high" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>
        <FaExclamationTriangle />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-950">{dataText(title)}</p>
          <StatusBadge status={severity} />
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{dataText(message)}</p>
      </div>
    </div>
  );
}

export function LinkCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: React.ReactNode }) {
  const router = useRouter();
  return (
    <button onClick={() => router.push(href)} className="group rounded-[1.75rem] border border-slate-200/70 bg-white/75 p-5 text-left shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(37,99,235,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-3 text-blue-600">{icon}</div>
        <FaArrowRight className="mt-2 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </button>
  );
}
