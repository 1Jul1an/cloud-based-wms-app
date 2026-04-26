"use client";

import { useState } from "react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { AlertRow, AppShell, EmptyState, GlassCard, PageIntro, SecondaryButton, TopBar } from "../../components/wms-ui";
import { wmsData } from "../../data/wmsMockData";
import { useI18n } from "../../i18n";

export default function ExceptionReviewPage() {
  const { t } = useI18n();
  const [alerts, setAlerts] = useState(wmsData.alerts);
  const openAlerts = alerts.filter((alert) => alert.status === "open");

  const resolveAlert = (id: string) => {
    setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, status: "resolved" } : alert));
  };

  return (
    <AppShell>
      <TopBar title={t("exceptions.title")} subtitle={t("exceptions.subtitle")} showBack backHref="/changes" />
      <PageIntro eyebrow={t("exceptions.eyebrow")} title={t("exceptions.intro.title")} description={t("exceptions.intro.desc")} />

      <GlassCard>
        {openAlerts.length ? (
          <div className="space-y-4">
            {openAlerts.map((alert) => (
              <div key={alert.id} className="rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-4">
                <AlertRow title={alert.title} message={alert.message} severity={alert.severity} />
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-2"><FaExclamationTriangle /> {alert.entityType}: {alert.entityId}</span>
                  <SecondaryButton onClick={() => resolveAlert(alert.id)}><FaCheck /> {t("exceptions.resolve")}</SecondaryButton>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title={t("exceptions.empty.title")} text={t("exceptions.empty.text")} />
        )}
      </GlassCard>
    </AppShell>
  );
}
