"use client";

import { useMemo, useState } from "react";
import { FaSave } from "react-icons/fa";
import { AppShell, DataTable, GlassCard, Input, PageIntro, PrimaryButton, StatusBadge, TableCell, TableHead, Textarea, TopBar } from "../../components/wms-ui";
import { getInventoryRows } from "../../data/wmsMockData";
import { useI18n } from "../../i18n";

export default function InventoryCorrectionsPage() {
  const { t } = useI18n();
  const initialRows = useMemo(() => getInventoryRows(), []);
  const [rows, setRows] = useState(initialRows);
  const [selectedId, setSelectedId] = useState(initialRows[0]?.id || "");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const selected = rows.find((row) => row.id === selectedId);

  const saveCorrection = () => {
    if (!selected || !quantity || !reason.trim()) {
      alert(t("corrections.alert.required"));
      return;
    }
    const newQty = Number(quantity);
    setRows((current) => current.map((row) => row.id === selected.id ? { ...row, onHand: newQty, available: Math.max(0, newQty - row.reserved), status: newQty - row.reserved < row.reorderPoint ? "low_stock" : "available" } : row));
    setQuantity("");
    setReason("");
  };

  return (
    <AppShell>
      <TopBar title={t("corrections.title")} subtitle={t("corrections.subtitle")} showBack backHref="/changes" />
      <PageIntro eyebrow={t("corrections.eyebrow")} title={t("corrections.intro.title")} description={t("corrections.intro.desc")} />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("common.sku")}</th>
                <th className="px-4 py-3">{t("common.product")}</th>
                <th className="px-4 py-3">{t("common.bin")}</th>
                <th className="px-4 py-3 text-right">{t("inventory.onHand")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} onClick={() => setSelectedId(row.id)} className={`cursor-pointer hover:bg-slate-50/80 ${selectedId === row.id ? "bg-blue-50/60" : ""}`}>
                  <TableCell className="font-semibold text-slate-950">{row.sku}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.location.code}</TableCell>
                  <TableCell className="text-right">{row.onHand}</TableCell>
                  <TableCell><StatusBadge status={row.status} /></TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </GlassCard>

        <GlassCard>
          {selected && (
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{selected.sku}</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">{selected.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{selected.warehouse.name} · {selected.location.code} · {t("common.lot")} {selected.lot}</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{t("corrections.correctedQty")}</label>
                  <Input type="number" placeholder={`${t("common.current")} ${selected.onHand}`} value={quantity} onChange={(event) => setQuantity(event.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{t("corrections.reason")}</label>
                  <Textarea rows={4} placeholder={t("corrections.reasonPlaceholder")} value={reason} onChange={(event) => setReason(event.target.value)} />
                </div>
                <div className="flex justify-end">
                  <PrimaryButton onClick={saveCorrection}><FaSave /> {t("corrections.save")}</PrimaryButton>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </section>
    </AppShell>
  );
}
