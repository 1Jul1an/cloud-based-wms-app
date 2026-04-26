"use client";

import { useMemo, useState } from "react";
import { FaCheck, FaClipboardCheck, FaExclamationTriangle, FaTruckLoading } from "react-icons/fa";
import { AlertRow, AppShell, DataTable, EmptyState, GlassCard, PageIntro, PrimaryButton, SecondaryButton, StatusBadge, TableCell, TableHead, Textarea, TopBar } from "../components/wms-ui";
import { getInboundRows } from "../data/wmsMockData";
import { useI18n } from "../i18n";

export default function IncomingGoodsPage() {
  const { t, formatDateTime } = useI18n();
  const initialDeliveries = useMemo(() => getInboundRows(), []);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(initialDeliveries[0]?.id || "");
  const [exceptionComment, setExceptionComment] = useState("");

  const selectedDelivery = deliveries.find((delivery) => delivery.id === selectedDeliveryId);
  const actionableDeliveries = deliveries.filter((delivery) => delivery.status !== "received");
  const reviewDeliveries = deliveries.filter((delivery) => delivery.status === "in_review");

  const receiveDelivery = (id: string) => {
    setDeliveries((current) =>
      current.map((delivery) =>
        delivery.id === id
          ? {
              ...delivery,
              status: "received",
              lines: delivery.lines.map((line) => ({ ...line, receivedQty: line.expectedQty }))
            }
          : delivery
      )
    );
  };

  const sendToReview = (id: string) => {
    if (!exceptionComment.trim()) return;
    setDeliveries((current) =>
      current.map((delivery) =>
        delivery.id === id
          ? { ...delivery, status: "in_review", exception: exceptionComment.trim() }
          : delivery
      )
    );
    setExceptionComment("");
  };

  return (
    <AppShell>
      <TopBar title={t("incoming.title")} subtitle={t("incoming.subtitle")} showBack />
      <PageIntro eyebrow={t("incoming.eyebrow")} title={t("incoming.intro.title")} description={t("incoming.intro.desc")} />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{t("incoming.expectedArrived")}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{actionableDeliveries.length}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600"><FaTruckLoading /></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{t("incoming.qualityReview")}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{reviewDeliveries.length}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-600"><FaExclamationTriangle /></div>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{t("incoming.linesQueue")}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{deliveries.reduce((sum, delivery) => sum + delivery.lines.length, 0)}</p>
            </div>
            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600"><FaClipboardCheck /></div>
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">{t("incoming.queue")}</h2>
          <div className="space-y-3">
            {deliveries.map((delivery) => (
              <button
                key={delivery.id}
                onClick={() => setSelectedDeliveryId(delivery.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${selectedDeliveryId === delivery.id ? "border-blue-300 bg-blue-50/70" : "border-slate-200 bg-white/70 hover:border-blue-200"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{delivery.poNumber}</p>
                    <p className="mt-1 text-sm text-slate-500">{delivery.supplier?.name} · {delivery.dock}</p>
                  </div>
                  <StatusBadge status={delivery.status} />
                </div>
                <p className="mt-3 text-sm text-slate-500">{t("incoming.eta")} {formatDateTime(delivery.eta)} · {delivery.lines.length} {t("incoming.skuLines")}</p>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          {selectedDelivery ? (
            <div>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{selectedDelivery.id}</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">{selectedDelivery.poNumber}</h2>
                  <p className="mt-2 text-sm text-slate-500">{selectedDelivery.supplier?.name} {t("common.to")} {selectedDelivery.warehouse?.name}</p>
                </div>
                <StatusBadge status={selectedDelivery.status} />
              </div>

              {selectedDelivery.exception && (
                <div className="mb-5">
                  <AlertRow title={t("incoming.activeException")} message={selectedDelivery.exception} severity="medium" />
                </div>
              )}

              <DataTable>
                <TableHead>
                  <tr>
                    <th className="px-4 py-3">{t("common.sku")}</th>
                    <th className="px-4 py-3">{t("common.product")}</th>
                    <th className="px-4 py-3 text-right">{t("incoming.expected")}</th>
                    <th className="px-4 py-3 text-right">{t("incoming.received")}</th>
                  </tr>
                </TableHead>
                <tbody className="divide-y divide-slate-100">
                  {selectedDelivery.lines.map((line) => (
                    <tr key={line.productId}>
                      <TableCell className="font-medium text-slate-900">{line.product.sku}</TableCell>
                      <TableCell>{line.product.name}</TableCell>
                      <TableCell className="text-right">{line.expectedQty}</TableCell>
                      <TableCell className="text-right">{line.receivedQty}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </DataTable>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{t("incoming.exceptionNote")}</label>
                  <Textarea rows={3} placeholder={t("incoming.exceptionPlaceholder")} value={exceptionComment} onChange={(event) => setExceptionComment(event.target.value)} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <SecondaryButton onClick={() => sendToReview(selectedDelivery.id)} className="text-amber-700">
                    <FaExclamationTriangle /> {t("incoming.review")}
                  </SecondaryButton>
                  <PrimaryButton onClick={() => receiveDelivery(selectedDelivery.id)} className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20">
                    <FaCheck /> {t("incoming.book")}
                  </PrimaryButton>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState title={t("incoming.empty")} />
          )}
        </GlassCard>
      </section>
    </AppShell>
  );
}
