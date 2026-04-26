"use client";

import { FaBoxes, FaClipboardCheck, FaExclamationTriangle, FaPlusCircle } from "react-icons/fa";
import { AppShell, AlertRow, GlassCard, LinkCard, MetricCard, PageIntro, TopBar } from "../components/wms-ui";
import { getInventoryRows, wmsData } from "../data/wmsMockData";
import { useI18n } from "../i18n";

export default function ControlCenterPage() {
  const { t } = useI18n();
  const inventoryRows = getInventoryRows();
  const lowStock = inventoryRows.filter((row) => row.available < row.reorderPoint).length;
  const exceptions = wmsData.alerts.filter((alert) => alert.status === "open");

  return (
    <AppShell>
      <TopBar title={t("control.title")} subtitle={t("control.subtitle")} showBack />
      <PageIntro eyebrow={t("control.eyebrow")} title={t("control.intro.title")} description={t("control.intro.desc")} />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label={t("control.activeSkus")} value={wmsData.products.length} hint={t("control.activeSkus.hint")} icon={<FaBoxes />} />
        <MetricCard label={t("control.stockRisks")} value={lowStock} hint={t("control.stockRisks.hint")} icon={<FaExclamationTriangle />} />
        <MetricCard label={t("control.openExceptions")} value={exceptions.length} hint={t("control.openExceptions.hint")} icon={<FaClipboardCheck />} />
      </section>

      <section className="mb-6 grid gap-5 md:grid-cols-3">
        <LinkCard title={t("control.corrections.title")} description={t("control.corrections.desc")} href="/changes/changes1" icon={<FaBoxes />} />
        <LinkCard title={t("control.exceptionReview.title")} description={t("control.exceptionReview.desc")} href="/changes/changes2" icon={<FaExclamationTriangle />} />
        <LinkCard title={t("control.createSku.title")} description={t("control.createSku.desc")} href="/changes/changes3" icon={<FaPlusCircle />} />
      </section>

      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-slate-950">{t("control.queue")}</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          {exceptions.map((alert) => <AlertRow key={alert.id} title={alert.title} message={alert.message} severity={alert.severity} />)}
        </div>
      </GlassCard>
    </AppShell>
  );
}
