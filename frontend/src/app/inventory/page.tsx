"use client";

import { useMemo, useState } from "react";
import { FaBoxOpen, FaEdit, FaLayerGroup, FaSearch, FaWarehouse } from "react-icons/fa";
import { AppShell, DataTable, GlassCard, Input, MetricCard, PageIntro, PrimaryButton, SecondaryButton, StatusBadge, TableCell, TableHead, Textarea, TopBar } from "../components/wms-ui";
import { getInventoryRows } from "../data/wmsMockData";
import { useI18n } from "../i18n";

export default function InventoryPage() {
  const { t, dataText, formatNumber } = useI18n();
  const initialRows = useMemo(() => getInventoryRows(), []);
  const [inventory, setInventory] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [selectedRowId, setSelectedRowId] = useState(initialRows[0]?.id || "");
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [adjustmentComment, setAdjustmentComment] = useState("");

  const filteredInventory = inventory.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = [item.name, item.sku, item.location.code, item.lot].some((value) => value.toLowerCase().includes(query));
    const matchesWarehouse = warehouseFilter === "all" || item.warehouse.id === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  const selectedRow = inventory.find((row) => row.id === selectedRowId);
  const availableUnits = inventory.reduce((sum, row) => sum + row.available, 0);
  const reservedUnits = inventory.reduce((sum, row) => sum + row.reserved, 0);
  const qualityHoldUnits = inventory.filter((row) => row.status === "quality_hold").reduce((sum, row) => sum + row.onHand, 0);

  const saveAdjustment = () => {
    if (!selectedRow || !adjustmentQty) return;
    const newOnHand = Number(adjustmentQty);
    if (newOnHand < selectedRow.onHand && !adjustmentComment.trim()) {
      alert(t("inventory.alert.reason"));
      return;
    }

    setInventory((current) =>
      current.map((row) =>
        row.id === selectedRow.id
          ? {
              ...row,
              onHand: newOnHand,
              available: Math.max(0, newOnHand - row.reserved),
              status: newOnHand - row.reserved < row.reorderPoint ? "low_stock" : "available"
            }
          : row
      )
    );
    setAdjustmentQty("");
    setAdjustmentComment("");
  };

  return (
    <AppShell>
      <TopBar title={t("inventory.title")} subtitle={t("inventory.subtitle")} showBack />
      <PageIntro eyebrow={t("inventory.eyebrow")} title={t("inventory.intro.title")} description={t("inventory.intro.desc")} />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label={t("inventory.available")} value={formatNumber(availableUnits)} hint={t("inventory.available.hint")} icon={<FaBoxOpen />} />
        <MetricCard label={t("inventory.reserved")} value={formatNumber(reservedUnits)} hint={t("inventory.reserved.hint")} icon={<FaLayerGroup />} />
        <MetricCard label={t("inventory.qualityHold")} value={formatNumber(qualityHoldUnits)} hint={t("inventory.qualityHold.hint")} icon={<FaWarehouse />} />
      </section>

      <GlassCard className="mb-6">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input className="pl-11" placeholder={t("inventory.search")} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
          <select
            value={warehouseFilter}
            onChange={(event) => setWarehouseFilter(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">{t("inventory.allWarehouses")}</option>
            {Array.from(new Map(inventory.map((row) => [row.warehouse.id, row.warehouse])).values()).map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
            ))}
          </select>
        </div>
      </GlassCard>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <GlassCard>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("common.sku")}</th>
                <th className="px-4 py-3">{t("common.product")}</th>
                <th className="px-4 py-3">{t("common.location")}</th>
                <th className="px-4 py-3 text-right">{t("inventory.onHand")}</th>
                <th className="px-4 py-3 text-right">{t("inventory.reservedCol")}</th>
                <th className="px-4 py-3 text-right">{t("inventory.availableCol")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedRowId(item.id)}
                  className={`cursor-pointer transition hover:bg-slate-50/80 ${selectedRowId === item.id ? "bg-blue-50/60" : ""}`}
                >
                  <TableCell className="font-semibold text-slate-950">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.location.code}</TableCell>
                  <TableCell className="text-right">{item.onHand}</TableCell>
                  <TableCell className="text-right">{item.reserved}</TableCell>
                  <TableCell className="text-right font-semibold text-slate-950">{item.available}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </GlassCard>

        <GlassCard>
          {selectedRow && (
            <div>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{selectedRow.sku}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">{selectedRow.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{selectedRow.warehouse.name} · {selectedRow.location.code} · {t("common.lot")} {selectedRow.lot}</p>
                </div>
                <StatusBadge status={selectedRow.status} />
              </div>

              <dl className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-sm text-slate-500">{t("common.category")}</dt><dd className="mt-1 font-semibold text-slate-950">{dataText(selectedRow.category)}</dd></div>
                <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-sm text-slate-500">{t("common.storageClass")}</dt><dd className="mt-1 font-semibold text-slate-950">{dataText(selectedRow.product.storageClass)}</dd></div>
                <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-sm text-slate-500">{t("inventory.onHand")}</dt><dd className="mt-1 font-semibold text-slate-950">{selectedRow.onHand}</dd></div>
                <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-sm text-slate-500">{t("inventory.reorderPoint")}</dt><dd className="mt-1 font-semibold text-slate-950">{selectedRow.reorderPoint}</dd></div>
              </dl>

              <div className="mt-6 rounded-[1.5rem] border border-slate-200/70 bg-white/70 p-4">
                <div className="mb-3 flex items-center gap-2 font-semibold text-slate-950"><FaEdit /> {t("inventory.adjust")}</div>
                <Input type="number" placeholder={`${t("common.current")}: ${selectedRow.onHand}`} value={adjustmentQty} onChange={(event) => setAdjustmentQty(event.target.value)} />
                <Textarea className="mt-3" rows={3} placeholder={t("inventory.reasonRequired")} value={adjustmentComment} onChange={(event) => setAdjustmentComment(event.target.value)} />
                <div className="mt-4 flex justify-end gap-3">
                  <SecondaryButton onClick={() => { setAdjustmentQty(""); setAdjustmentComment(""); }}>{t("common.clear")}</SecondaryButton>
                  <PrimaryButton onClick={saveAdjustment}>{t("inventory.saveAdjustment")}</PrimaryButton>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </section>
    </AppShell>
  );
}
