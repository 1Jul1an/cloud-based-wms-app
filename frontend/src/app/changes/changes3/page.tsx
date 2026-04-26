"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus, FaSave } from "react-icons/fa";
import { AppShell, DataTable, GlassCard, Input, PageIntro, PrimaryButton, SecondaryButton, Select, StatusBadge, TableCell, TableHead, TopBar } from "../../components/wms-ui";
import { wmsData } from "../../data/wmsMockData";
import { useI18n } from "../../i18n";

export default function CreateSkuPage() {
  const router = useRouter();
  const { t, dataText } = useI18n();
  const [products, setProducts] = useState(wmsData.products);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Finished Goods",
    unit: "pcs",
    storageClass: "Standard",
    reorderPoint: "100",
    weightKg: "0.2"
  });

  const createSku = (event: React.FormEvent) => {
    event.preventDefault();
    const newProduct = {
      id: `PRD-NEW-${products.length + 1}`,
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      storageClass: formData.storageClass,
      reorderPoint: Number(formData.reorderPoint),
      weightKg: Number(formData.weightKg),
      active: true
    };
    setProducts((current: any) => [newProduct, ...current]);
    setFormData({ sku: "", name: "", category: "Finished Goods", unit: "pcs", storageClass: "Standard", reorderPoint: "100", weightKg: "0.2" });
  };

  return (
    <AppShell>
      <TopBar title={t("sku.title")} subtitle={t("sku.subtitle")} showBack backHref="/changes" />
      <PageIntro eyebrow={t("sku.eyebrow")} title={t("sku.intro.title")} description={t("sku.intro.desc")} />

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <GlassCard>
          <form onSubmit={createSku} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t("common.sku")}</label>
              <Input value={formData.sku} onChange={(event) => setFormData({ ...formData, sku: event.target.value })} placeholder="SKU-NEW-001" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t("sku.productName")}</label>
              <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder={t("sku.productPlaceholder")} required />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{t("common.category")}</label>
                <Select value={formData.category} onChange={(event) => setFormData({ ...formData, category: event.target.value })}>
                  <option value="Finished Goods">{dataText("Finished Goods")}</option>
                  <option value="Packaging">{dataText("Packaging")}</option>
                  <option value="Consumable">{dataText("Consumable")}</option>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{t("common.storageClass")}</label>
                <Select value={formData.storageClass} onChange={(event) => setFormData({ ...formData, storageClass: event.target.value })}>
                  <option value="Standard">{dataText("Standard")}</option>
                  <option value="Fragile">{dataText("Fragile")}</option>
                  <option value="Liquid">{dataText("Liquid")}</option>
                  <option value="Small Parts">{dataText("Small Parts")}</option>
                  <option value="Packaging">{dataText("Packaging")}</option>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{t("sku.unit")}</label>
                <Input value={formData.unit} onChange={(event) => setFormData({ ...formData, unit: event.target.value })} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{t("sku.reorderPoint")}</label>
                <Input type="number" value={formData.reorderPoint} onChange={(event) => setFormData({ ...formData, reorderPoint: event.target.value })} required />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{t("sku.weight")}</label>
                <Input type="number" step="0.01" value={formData.weightKg} onChange={(event) => setFormData({ ...formData, weightKg: event.target.value })} required />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <SecondaryButton onClick={() => router.push("/changes")}>{t("common.cancel")}</SecondaryButton>
              <PrimaryButton type="submit"><FaSave /> {t("sku.save")}</PrimaryButton>
            </div>
          </form>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-950">{t("sku.catalog")}</h2>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700"><FaPlus /> {products.length} SKUs</span>
          </div>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("common.sku")}</th>
                <th className="px-4 py-3">{t("common.product")}</th>
                <th className="px-4 py-3">{t("common.category")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-semibold text-slate-950">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{dataText(product.category)}</TableCell>
                  <TableCell><StatusBadge status={product.active ? "available" : "quality_hold"} /></TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </GlassCard>
      </section>
    </AppShell>
  );
}
