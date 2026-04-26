"use client";

import { useMemo, useState } from "react";
import { FaBox, FaCheck, FaClipboardList, FaShippingFast, FaTasks } from "react-icons/fa";
import { AppShell, DataTable, GlassCard, MetricCard, PageIntro, PrimaryButton, SecondaryButton, StatusBadge, TableCell, TableHead, TopBar } from "../components/wms-ui";
import { getOrderRows, getPackingRows, getPickingRows, getShipmentRows } from "../data/wmsMockData";
import { useI18n } from "../i18n";

const tabIds = ["orders", "picking", "packing", "shipments"] as const;
type TabId = typeof tabIds[number];

export default function OutboundPage() {
  const { t, dataText, formatDateTime } = useI18n();
  const initialOrders = useMemo(() => getOrderRows(), []);
  const initialPicks = useMemo(() => getPickingRows(), []);
  const initialPacks = useMemo(() => getPackingRows(), []);
  const initialShipments = useMemo(() => getShipmentRows(), []);

  const [activeTab, setActiveTab] = useState<TabId>("orders");
  const [orders, setOrders] = useState(initialOrders);
  const [picks, setPicks] = useState(initialPicks);
  const [packs, setPacks] = useState(initialPacks);
  const [shipments, setShipments] = useState(initialShipments);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0]?.id || "");

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  const completePick = (taskId: string) => {
    const task = picks.find((pick) => pick.id === taskId);
    setPicks((current) => current.map((pick) => pick.id === taskId ? { ...pick, status: "done" } : pick));
    if (task) {
      const remainingForOrder = picks.filter((pick) => pick.orderId === task.orderId && pick.id !== taskId && pick.status !== "done");
      if (!remainingForOrder.length) {
        setOrders((current) => current.map((order) => order.id === task.orderId ? { ...order, status: "ready_to_pack" } : order));
      }
    }
  };

  const completePack = (taskId: string) => {
    const task = packs.find((pack) => pack.id === taskId);
    setPacks((current) => current.map((pack) => pack.id === taskId ? { ...pack, status: "done" } : pack));
    if (task) {
      setOrders((current) => current.map((order) => order.id === task.orderId ? { ...order, status: "packed" } : order));
      setShipments((current) => current.map((shipment) => shipment.orderId === task.orderId ? { ...shipment, status: "label_printed" } : shipment));
    }
  };

  const shipOrder = (shipmentId: string) => {
    const shipment = shipments.find((item) => item.id === shipmentId);
    setShipments((current) => current.map((item) => item.id === shipmentId ? { ...item, status: "shipped" } : item));
    if (shipment) {
      setOrders((current) => current.map((order) => order.id === shipment.orderId ? { ...order, status: "shipped" } : order));
    }
  };

  return (
    <AppShell>
      <TopBar title={t("outbound.title")} subtitle={t("outbound.subtitle")} showBack />
      <PageIntro eyebrow={t("outbound.eyebrow")} title={t("outbound.intro.title")} description={t("outbound.intro.desc")} />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard label={t("outbound.orders")} value={orders.length} hint={t("outbound.intro.title")} icon={<FaClipboardList />} />
        <MetricCard label={t("outbound.openPicks")} value={picks.filter((task) => task.status !== "done").length} hint={t("outbound.openPicks.hint")} icon={<FaTasks />} />
        <MetricCard label={t("outbound.readyPacks")} value={packs.filter((task) => task.status !== "done").length} hint={t("outbound.readyPacks.hint")} icon={<FaBox />} />
        <MetricCard label={t("outbound.shipments")} value={shipments.length} hint={t("outbound.shipments.hint")} icon={<FaShippingFast />} />
      </section>

      <GlassCard className="mb-6">
        <div className="flex flex-wrap gap-2">
          {tabIds.map((tabId) => (
            <button key={tabId} onClick={() => setActiveTab(tabId)} className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${activeTab === tabId ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>{t(`outbound.tab.${tabId}`)}</button>
          ))}
        </div>
      </GlassCard>

      {activeTab === "orders" && (
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <GlassCard>
            <DataTable>
              <TableHead>
                <tr>
                  <th className="px-4 py-3">{t("common.order")}</th>
                  <th className="px-4 py-3">{t("common.customer")}</th>
                  <th className="px-4 py-3">{t("outbound.due")}</th>
                  <th className="px-4 py-3">{t("common.priority")}</th>
                  <th className="px-4 py-3">{t("common.status")}</th>
                </tr>
              </TableHead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} onClick={() => setSelectedOrderId(order.id)} className={`cursor-pointer hover:bg-slate-50/80 ${selectedOrderId === order.id ? "bg-blue-50/60" : ""}`}>
                    <TableCell className="font-semibold text-slate-950">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{formatDateTime(order.dueAt)}</TableCell>
                    <TableCell><StatusBadge status={order.priority} /></TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </GlassCard>

          <GlassCard>
            {selectedOrder && (
              <>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{dataText(selectedOrder.channel)}</p>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-950">{selectedOrder.id}</h2>
                    <p className="mt-2 text-sm text-slate-500">{selectedOrder.customer} · {selectedOrder.warehouse?.name}</p>
                  </div>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div className="space-y-3">
                  {selectedOrder.lines.map((line) => (
                    <div key={line.productId} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/70 p-4">
                      <div>
                        <p className="font-semibold text-slate-950">{line.product.sku}</p>
                        <p className="text-sm text-slate-500">{line.product.name}</p>
                      </div>
                      <span className="text-lg font-semibold text-slate-950">× {line.qty}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </section>
      )}

      {activeTab === "picking" && (
        <GlassCard>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("outbound.task")}</th>
                <th className="px-4 py-3">{t("common.order")}</th>
                <th className="px-4 py-3">{t("common.sku")}</th>
                <th className="px-4 py-3">{t("common.bin")}</th>
                <th className="px-4 py-3 text-right">{t("common.qty")}</th>
                <th className="px-4 py-3">{t("common.operator")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3">{t("common.action")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {picks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-semibold text-slate-950">{task.id}</TableCell>
                  <TableCell>{task.orderId}</TableCell>
                  <TableCell>{task.product?.sku}</TableCell>
                  <TableCell>{task.location?.code}</TableCell>
                  <TableCell className="text-right">{task.qty}</TableCell>
                  <TableCell>{task.operator?.name}</TableCell>
                  <TableCell><StatusBadge status={task.status} /></TableCell>
                  <TableCell>{task.status === "done" ? <span className="text-sm text-slate-400">{t("common.complete")}</span> : <SecondaryButton onClick={() => completePick(task.id)}><FaCheck /> {t("common.complete")}</SecondaryButton>}</TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </GlassCard>
      )}

      {activeTab === "packing" && (
        <GlassCard>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("outbound.task")}</th>
                <th className="px-4 py-3">{t("common.order")}</th>
                <th className="px-4 py-3">{t("outbound.station")}</th>
                <th className="px-4 py-3">{t("outbound.cartons")}</th>
                <th className="px-4 py-3">{t("common.operator")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3">{t("common.action")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {packs.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-semibold text-slate-950">{task.id}</TableCell>
                  <TableCell>{task.orderId}</TableCell>
                  <TableCell>{task.station}</TableCell>
                  <TableCell>{task.cartons}</TableCell>
                  <TableCell>{task.operator?.name}</TableCell>
                  <TableCell><StatusBadge status={task.status} /></TableCell>
                  <TableCell>{task.status === "done" ? <span className="text-sm text-slate-400">{t("common.complete")}</span> : <SecondaryButton onClick={() => completePack(task.id)}><FaCheck /> {t("outbound.finishPack")}</SecondaryButton>}</TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </GlassCard>
      )}

      {activeTab === "shipments" && (
        <GlassCard>
          <DataTable>
            <TableHead>
              <tr>
                <th className="px-4 py-3">{t("outbound.shipment")}</th>
                <th className="px-4 py-3">{t("common.order")}</th>
                <th className="px-4 py-3">{t("outbound.carrier")}</th>
                <th className="px-4 py-3">{t("outbound.tracking")}</th>
                <th className="px-4 py-3">{t("outbound.shipBy")}</th>
                <th className="px-4 py-3">{t("common.status")}</th>
                <th className="px-4 py-3">{t("common.action")}</th>
              </tr>
            </TableHead>
            <tbody className="divide-y divide-slate-100">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-slate-50/80">
                  <TableCell className="font-semibold text-slate-950">{shipment.id}</TableCell>
                  <TableCell>{shipment.orderId}</TableCell>
                  <TableCell>{shipment.carrier} · {shipment.service}</TableCell>
                  <TableCell>{shipment.tracking}</TableCell>
                  <TableCell>{formatDateTime(shipment.shipBy)}</TableCell>
                  <TableCell><StatusBadge status={shipment.status} /></TableCell>
                  <TableCell>{shipment.status === "shipped" ? <span className="text-sm text-slate-400">{t("outbound.shipped")}</span> : <PrimaryButton onClick={() => shipOrder(shipment.id)}>{t("outbound.release")}</PrimaryButton>}</TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </GlassCard>
      )}
    </AppShell>
  );
}
