"use client";

import { FaBoxes, FaClipboardCheck, FaExclamationTriangle, FaRoute, FaShippingFast, FaTasks, FaTruckLoading, FaWarehouse } from "react-icons/fa";
import { MdInventory2, MdLocalShipping, MdOutlineFactCheck } from "react-icons/md";
import Footer from "./components/footer";
import { AlertRow, AppShell, DataTable, GlassCard, LinkCard, MetricCard, PageIntro, StatusBadge, TableCell, TableHead, TopBar } from "./components/wms-ui";
import { getDashboardMetrics, getInboundRows, getMovementRows, getOrderRows, wmsData } from "./data/wmsMockData";
import { useI18n } from "./i18n";

export default function Home() {
  const { t, dataText, formatDateTime, formatNumber } = useI18n();
  const metrics = getDashboardMetrics();
  const inboundRows = getInboundRows();
  const movementRows = getMovementRows();
  const orderRows = getOrderRows();
  const capacity = wmsData.warehouses.reduce((sum, warehouse) => sum + warehouse.capacity, 0);
  const usedCapacity = wmsData.warehouses.reduce((sum, warehouse) => sum + warehouse.usedCapacity, 0);
  const capacityPercent = Math.round((usedCapacity / capacity) * 100);

  return (
    <AppShell>
      <TopBar />

      <section className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-white/85 via-blue-50/80 to-cyan-50/70 p-8 shadow-[0_24px_90px_rgba(37,99,235,0.12)] backdrop-blur-xl">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">{t("home.hero.eyebrow")}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              {t("home.hero.description")}
            </p>
          </div>
          <GlassCard className="bg-white/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{t("home.capacity.label")}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{capacityPercent}%</p>
              </div>
              <div className="rounded-2xl bg-blue-600 p-3 text-white">
                <FaWarehouse />
              </div>
            </div>
            <div className="mt-5 h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${capacityPercent}%` }} />
            </div>
            <p className="mt-4 text-sm text-slate-500">{t("home.capacity.hint", { used: formatNumber(usedCapacity), capacity: formatNumber(capacity) })}</p>
          </GlassCard>
        </div>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label={t("home.metric.available")} value={formatNumber(metrics.availableUnits)} hint={t("home.metric.available.hint")} icon={<MdInventory2 />} />
        <MetricCard label={t("home.metric.dueToday")} value={metrics.dueToday} hint={t("home.metric.dueToday.hint")} icon={<FaShippingFast />} />
        <MetricCard label={t("home.metric.openPicks")} value={metrics.openPicks} hint={t("home.metric.openPicks.hint")} icon={<FaTasks />} />
        <MetricCard label={t("home.metric.stockRisks")} value={metrics.lowStock} hint={t("home.metric.stockRisks.hint")} icon={<FaExclamationTriangle />} />
        <MetricCard label={t("home.metric.exceptions")} value={metrics.openAlerts} hint={t("home.metric.exceptions.hint")} icon={<MdOutlineFactCheck />} />
      </section>

      <PageIntro eyebrow={t("home.flows.eyebrow")} title={t("home.flows.title")} description={t("home.flows.description")} />
      <section className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <LinkCard title={t("home.card.incoming.title")} description={t("home.card.incoming.desc")} href="/income" icon={<FaTruckLoading />} />
        <LinkCard title={t("home.card.inventory.title")} description={t("home.card.inventory.desc")} href="/inventory" icon={<FaBoxes />} />
        <LinkCard title={t("home.card.outbound.title")} description={t("home.card.outbound.desc")} href="/sale" icon={<MdLocalShipping />} />
        <LinkCard title={t("home.card.replenishment.title")} description={t("home.card.replenishment.desc")} href="/shopping" icon={<FaRoute />} />
        <LinkCard title={t("home.card.tasks.title")} description={t("home.card.tasks.desc")} href="/production" icon={<FaTasks />} />
        <LinkCard title={t("home.card.control.title")} description={t("home.card.control.desc")} href="/changes" icon={<FaClipboardCheck />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">{t("home.activity.title")}</h2>
            <StatusBadge status="operational" />
          </div>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("home.activity.time")}</th>
                <th className="px-4 py-3">{t("home.activity.movement")}</th>
                <th className="px-4 py-3">{t("common.sku")}</th>
                <th className="px-4 py-3">{t("home.activity.from")}</th>
                <th className="px-4 py-3">{t("home.activity.to")}</th>
                <th className="px-4 py-3 text-right">{t("common.qty")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {movementRows.map((movement) => (
                <tr key={movement.id} className="hover:bg-slate-50/80">
                  <TableCell>{formatDateTime(movement.timestamp)}</TableCell>
                  <TableCell className="font-medium text-slate-900">{dataText(movement.type)}</TableCell>
                  <TableCell>{movement.product?.sku}</TableCell>
                  <TableCell>{movement.fromLocation?.code || t("common.external")}</TableCell>
                  <TableCell>{movement.toLocation?.code || t("common.adjustment")}</TableCell>
                  <TableCell className="text-right font-semibold">{movement.qty > 0 ? `+${movement.qty}` : movement.qty}</TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{t("home.exceptions.title")}</h2>
          <div className="space-y-3">
            {wmsData.alerts.map((alert) => (
              <AlertRow key={alert.id} title={alert.title} message={alert.message} severity={alert.severity} />
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{t("home.inbound.title")}</h2>
          <div className="space-y-3">
            {inboundRows.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                <div>
                  <p className="font-semibold text-slate-950">{delivery.poNumber}</p>
                  <p className="text-sm text-slate-500">{delivery.supplier?.name} · {delivery.lines.length} {t("home.lines")} · {formatDateTime(delivery.eta)}</p>
                </div>
                <StatusBadge status={delivery.status} />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{t("home.outbound.title")}</h2>
          <div className="space-y-3">
            {orderRows.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4">
                <div>
                  <p className="font-semibold text-slate-950">{order.id}</p>
                  <p className="text-sm text-slate-500">{order.customer} · {order.lines.length} {t("home.lines")} · {t("home.due")} {formatDateTime(order.dueAt)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <Footer />
    </AppShell>
  );
}
