"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaPlus, FaShieldAlt } from "react-icons/fa";
import { AppShell, DataTable, GlassCard, PageIntro, PrimaryButton, SecondaryButton, StatusBadge, TableCell, TableHead, Textarea, TopBar } from "../components/wms-ui";
import { getFulfillmentProfileRows } from "../data/wmsMockData";
import { useI18n } from "../i18n";

export default function FulfillmentProfilesPage() {
  const router = useRouter();
  const { t, dataText } = useI18n();
  const initialProfiles = useMemo(() => getFulfillmentProfileRows(), []);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [selectedId, setSelectedId] = useState(initialProfiles[0]?.id || "");
  const [isEditing, setIsEditing] = useState(false);
  const selectedProfile = profiles.find((profile) => profile.id === selectedId);
  const [editDescription, setEditDescription] = useState(selectedProfile?.description || "");

  const startEdit = () => {
    setEditDescription(selectedProfile?.description || "");
    setIsEditing(true);
  };

  const saveProfile = () => {
    if (!selectedProfile) return;
    setProfiles((current) => current.map((profile) => profile.id === selectedProfile.id ? { ...profile, description: editDescription } : profile));
    setIsEditing(false);
  };

  return (
    <AppShell>
      <TopBar title={t("profiles.title")} subtitle={t("profiles.subtitle")} showBack backHref="/production" />
      <PageIntro
        eyebrow={t("profiles.eyebrow")}
        title={t("profiles.intro.title")}
        description={t("profiles.intro.desc")}
        action={<PrimaryButton onClick={() => router.push("/recipes/new")}><FaPlus /> {t("profiles.new")}</PrimaryButton>}
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassCard>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("common.profile")}</th>
                <th className="px-4 py-3">{t("common.storageClass")}</th>
                <th className="px-4 py-3">{t("common.linkedSkus")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((profile) => (
                <tr key={profile.id} onClick={() => { setSelectedId(profile.id); setIsEditing(false); }} className={`cursor-pointer hover:bg-slate-50/80 ${selectedId === profile.id ? "bg-blue-50/60" : ""}`}>
                  <TableCell className="font-semibold text-slate-950">{dataText(profile.name)}</TableCell>
                  <TableCell>{dataText(profile.storageClass)}</TableCell>
                  <TableCell>{profile.productRows.map((product: any) => product?.sku).join(", ")}</TableCell>
                  <TableCell><StatusBadge status="operational" /></TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </GlassCard>

        <GlassCard>
          {selectedProfile && (
            <div>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{selectedProfile.id}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">{dataText(selectedProfile.name)}</h2>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><FaShieldAlt /></div>
              </div>

              {isEditing ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{t("common.description")}</label>
                  <Textarea rows={4} value={editDescription} onChange={(event) => setEditDescription(event.target.value)} />
                  <div className="mt-4 flex justify-end gap-3">
                    <SecondaryButton onClick={() => setIsEditing(false)}>{t("common.cancel")}</SecondaryButton>
                    <PrimaryButton onClick={saveProfile}>{t("profiles.save")}</PrimaryButton>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-6 text-slate-600">{dataText(selectedProfile.description)}</p>
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="mb-3 font-semibold text-slate-950">{t("common.executionSteps")}</p>
                    <ol className="space-y-2 text-sm text-slate-600">
                      {selectedProfile.steps.map((step: string, index: number) => <li key={step}>{index + 1}. {dataText(step)}</li>)}
                    </ol>
                  </div>
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <p className="mb-3 font-semibold text-slate-950">{t("common.linkedSkus")}</p>
                    <div className="space-y-2">
                      {selectedProfile.productRows.map((product: any) => (
                        <div key={product?.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                          <span className="font-semibold text-slate-950">{product?.sku}</span>
                          <span className="text-slate-500">{product?.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <SecondaryButton onClick={startEdit}><FaEdit /> {t("profiles.editDescription")}</SecondaryButton>
                  </div>
                </>
              )}
            </div>
          )}
        </GlassCard>
      </section>
    </AppShell>
  );
}
