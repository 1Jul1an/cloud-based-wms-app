"use client";

import { FaClipboardList, FaRoute, FaTasks, FaWarehouse } from "react-icons/fa";
import { AppShell, GlassCard, LinkCard, MetricCard, PageIntro, StatusBadge, TopBar } from "../components/wms-ui";
import { getFulfillmentProfileRows, getPackingRows, getPickingRows, wmsData } from "../data/wmsMockData";
import { useI18n } from "../i18n";

export default function WarehouseTasksPage() {
  const { t, dataText } = useI18n();
  const picking = getPickingRows();
  const packing = getPackingRows();
  const profiles = getFulfillmentProfileRows();
  const openTasks = [...picking, ...packing].filter((task) => task.status !== "done").length;

  return (
    <AppShell>
      <TopBar title={t("tasks.title")} subtitle={t("tasks.subtitle")} showBack />
      <PageIntro eyebrow={t("tasks.eyebrow")} title={t("tasks.intro.title")} description={t("tasks.intro.desc")} />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label={t("tasks.open")} value={openTasks} hint={t("tasks.open.hint")} icon={<FaTasks />} />
        <MetricCard label={t("tasks.operators")} value={wmsData.operators.length} hint={t("tasks.operators.hint")} icon={<FaWarehouse />} />
        <MetricCard label={t("tasks.profiles")} value={profiles.length} hint={t("tasks.profiles.hint")} icon={<FaClipboardList />} />
      </section>

      <section className="mb-6 grid gap-5 md:grid-cols-2">
        <LinkCard title={t("tasks.board.title")} description={t("tasks.board.desc")} href="/production/creation" icon={<FaTasks />} />
        <LinkCard title={t("tasks.profiles.title")} description={t("tasks.profiles.desc")} href="/recipes" icon={<FaRoute />} />
      </section>

      <GlassCard>
        <h2 className="mb-4 text-lg font-semibold text-slate-950">{t("tasks.workload")}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {wmsData.operators.map((operator) => {
            const assignedPicks = picking.filter((task) => task.operatorId === operator.id);
            const assignedPacks = packing.filter((task) => task.operatorId === operator.id);
            return (
              <div key={operator.id} className="rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{operator.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{dataText(operator.role)} · {dataText(operator.shift)} {t("tasks.shift")}</p>
                  </div>
                  <StatusBadge status="operational" />
                </div>
                <p className="mt-4 text-sm text-slate-600">{assignedPicks.length + assignedPacks.length} {t("tasks.assigned")}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </AppShell>
  );
}
