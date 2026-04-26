"use client";

import { useMemo, useState } from "react";
import { FaCartPlus, FaCheck, FaPlus, FaShoppingCart, FaTruck } from "react-icons/fa";
import { AppShell, DataTable, GlassCard, Input, MetricCard, PageIntro, PrimaryButton, SecondaryButton, StatusBadge, TableCell, TableHead, TopBar } from "../components/wms-ui";
import { getProduct, getSupplierMaterialsApiShape, wmsData } from "../data/wmsMockData";
import { useI18n } from "../i18n";

type CartLine = {
  supplierLegacyId: number;
  supplierName: string;
  productId: string;
  sku: string;
  name: string;
  qty: number;
  minOrderQty: number;
};

export default function ReplenishmentPage() {
  const { t } = useI18n();
  const [selectedSupplier, setSelectedSupplier] = useState(wmsData.suppliers[0]?.legacyId || 1);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [createdInbound, setCreatedInbound] = useState<string | null>(null);
  const [createdCount, setCreatedCount] = useState(0);

  const supplier = wmsData.suppliers.find((item) => item.legacyId === selectedSupplier)!;
  const materials = useMemo(() => getSupplierMaterialsApiShape(selectedSupplier), [selectedSupplier]);

  const addLine = (material: any) => {
    const product = wmsData.products.find((item) => Number(item.id.replace("PRD-", "")) === material.MatID);
    if (!product) return;

    setCart((current) => {
      if (current.length > 0 && current[0].supplierLegacyId !== selectedSupplier) {
        alert(t("replenishment.alert.supplier"));
        return current;
      }

      const existing = current.find((line) => line.productId === product.id);
      if (existing) {
        return current.map((line) => line.productId === product.id ? { ...line, qty: line.qty + material.Mindestmenge } : line);
      }

      return [...current, {
        supplierLegacyId: selectedSupplier,
        supplierName: supplier.name,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        qty: material.Mindestmenge,
        minOrderQty: material.Mindestmenge
      }];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    setCart((current) => current.map((line) => line.productId === productId ? { ...line, qty: Math.max(line.minOrderQty, qty) } : line));
  };

  const removeLine = (productId: string) => {
    setCart((current) => current.filter((line) => line.productId !== productId));
  };

  const createInboundPlan = () => {
    if (!cart.length) return;
    const nextCount = createdCount + 1;
    const id = `PO-${String(nextCount).padStart(3, "0")}`;
    setCreatedCount(nextCount);
    setCreatedInbound(id);
    setCart([]);
  };

  return (
    <AppShell>
      <TopBar title={t("replenishment.title")} subtitle={t("replenishment.subtitle")} showBack />
      <PageIntro eyebrow={t("replenishment.eyebrow")} title={t("replenishment.intro.title")} description={t("replenishment.intro.desc")} />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label={t("replenishment.activeSuppliers")} value={wmsData.suppliers.length} hint={t("replenishment.activeSuppliers.hint")} icon={<FaTruck />} />
        <MetricCard label={t("replenishment.reliability")} value={`${supplier.reliability}%`} hint={t("replenishment.reliability.hint", { supplier: supplier.name })} icon={<FaCheck />} />
        <MetricCard label={t("replenishment.draftLines")} value={cart.length} hint={t("replenishment.draftLines.hint")} icon={<FaShoppingCart />} />
      </section>

      {createdInbound && (
        <GlassCard className="mb-6 border-emerald-200 bg-emerald-50/80">
          <div className="flex items-center gap-3 text-emerald-800">
            <FaCheck />
            <p className="font-semibold">{t("replenishment.created", { id: createdInbound })}</p>
          </div>
        </GlassCard>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{t("replenishment.suppliers")}</h2>
          <div className="space-y-3">
            {wmsData.suppliers.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedSupplier(item.legacyId)}
                className={`w-full rounded-2xl border p-4 text-left transition ${selectedSupplier === item.legacyId ? "border-blue-300 bg-blue-50/70" : "border-slate-200 bg-white/70 hover:border-blue-200"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-950">{item.name}</p>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">{item.leadTimeDays} {t("replenishment.lead")}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{t("replenishment.supplierMeta", { reliability: item.reliability })}</p>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{t("replenishment.catalog")}</h2>
              <p className="mt-1 text-sm text-slate-500">{supplier.name}</p>
            </div>
            <StatusBadge status="operational" />
          </div>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("common.sku")}</th>
                <th className="px-4 py-3">{t("common.product")}</th>
                <th className="px-4 py-3 text-right">{t("replenishment.moq")}</th>
                <th className="px-4 py-3">{t("common.action")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {materials.map((material) => {
                const product = getProduct(`PRD-${String(material.MatID).padStart(4, "0")}`);
                return (
                  <tr key={material.MatLiefID} className="hover:bg-slate-50/80">
                    <TableCell className="font-semibold text-slate-950">{material.SKU}</TableCell>
                    <TableCell>{material.MaterialName}</TableCell>
                    <TableCell className="text-right">{material.Mindestmenge}</TableCell>
                    <TableCell>
                      <SecondaryButton onClick={() => addLine(material)}><FaCartPlus /> {t("replenishment.add")}</SecondaryButton>
                    </TableCell>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </GlassCard>
      </section>

      <GlassCard className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{t("replenishment.plan")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("replenishment.planHint")}</p>
          </div>
          <PrimaryButton onClick={createInboundPlan} className={!cart.length ? "pointer-events-none opacity-50" : ""}><FaPlus /> {t("replenishment.createPlan")}</PrimaryButton>
        </div>
        {cart.length ? (
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("replenishment.suppliers")}</th>
                <th className="px-4 py-3">{t("common.sku")}</th>
                <th className="px-4 py-3">{t("common.product")}</th>
                <th className="px-4 py-3">{t("common.qty")}</th>
                <th className="px-4 py-3">{t("common.remove")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {cart.map((line) => (
                <tr key={line.productId}>
                  <TableCell>{line.supplierName}</TableCell>
                  <TableCell className="font-semibold text-slate-950">{line.sku}</TableCell>
                  <TableCell>{line.name}</TableCell>
                  <TableCell><Input type="number" value={line.qty} onChange={(event) => updateQty(line.productId, Number(event.target.value))} className="max-w-32" /></TableCell>
                  <TableCell><button className="font-semibold text-rose-600 hover:text-rose-700" onClick={() => removeLine(line.productId)}>{t("common.remove")}</button></TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">{t("replenishment.empty")}</div>
        )}
      </GlassCard>
    </AppShell>
  );
}
