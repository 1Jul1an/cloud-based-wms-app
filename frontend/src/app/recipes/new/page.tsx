"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { AppShell, GlassCard, Input, PageIntro, PrimaryButton, SecondaryButton, Select, Textarea, TopBar } from "../../components/wms-ui";
import { wmsData } from "../../data/wmsMockData";
import { useI18n } from "../../i18n";

export default function NewFulfillmentProfilePage() {
  const router = useRouter();
  const { t, dataText } = useI18n();
  const products = useMemo(() => wmsData.products, []);
  const [formData, setFormData] = useState({
    name: "",
    storageClass: "Standard",
    productId: products[0]?.id || "",
    description: "",
    step: ""
  });
  const [steps, setSteps] = useState<string[]>([]);

  const addStep = () => {
    if (!formData.step.trim()) return;
    setSteps((current) => [...current, formData.step.trim()]);
    setFormData((current) => ({ ...current, step: "" }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(t("newProfile.alert.created"));
    router.push("/recipes");
  };

  return (
    <AppShell maxWidth="max-w-4xl">
      <TopBar title={t("newProfile.title")} subtitle={t("newProfile.subtitle")} showBack backHref="/recipes" />
      <PageIntro eyebrow={t("newProfile.eyebrow")} title={t("newProfile.intro.title")} description={t("newProfile.intro.desc")} />

      <GlassCard>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t("newProfile.name")}</label>
              <Input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required placeholder={t("newProfile.namePlaceholder")} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{t("common.storageClass")}</label>
              <Select value={formData.storageClass} onChange={(event) => setFormData({ ...formData, storageClass: event.target.value })}>
                {Array.from(new Set(products.map((product) => product.storageClass))).map((storageClass) => <option key={storageClass} value={storageClass}>{dataText(storageClass)}</option>)}
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">{t("newProfile.linkedSku")}</label>
            <Select value={formData.productId} onChange={(event) => setFormData({ ...formData, productId: event.target.value })}>
              {products.map((product) => <option key={product.id} value={product.id}>{product.sku} · {product.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">{t("common.description")}</label>
            <Textarea rows={4} value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} required placeholder={t("newProfile.descPlaceholder")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">{t("common.executionSteps")}</label>
            <div className="flex gap-3">
              <Input value={formData.step} onChange={(event) => setFormData({ ...formData, step: event.target.value })} placeholder={t("newProfile.stepPlaceholder")} />
              <SecondaryButton onClick={addStep}><FaPlus /> {t("common.add")}</SecondaryButton>
            </div>
            {steps.length > 0 && (
              <ol className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                {steps.map((step, index) => <li key={`${step}-${index}`}>{index + 1}. {step}</li>)}
              </ol>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <SecondaryButton onClick={() => router.push("/recipes")}>{t("common.cancel")}</SecondaryButton>
            <PrimaryButton type="submit">{t("newProfile.create")}</PrimaryButton>
          </div>
        </form>
      </GlassCard>
    </AppShell>
  );
}
