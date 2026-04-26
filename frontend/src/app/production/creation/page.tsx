"use client";

import { useMemo, useState } from "react";
import { FaCheck, FaClipboardCheck, FaTasks } from "react-icons/fa";
import { AppShell, DataTable, GlassCard, MetricCard, PageIntro, SecondaryButton, StatusBadge, TableCell, TableHead, TopBar } from "../../components/wms-ui";
import { getPackingRows, getPickingRows } from "../../data/wmsMockData";
import { useI18n } from "../../i18n";

export default function TaskExecutionPage() {
  const { t, dataText } = useI18n();
  const initialTasks = useMemo(() => [
    ...getPickingRows().map((task) => ({ ...task, taskType: "Pick" })),
    ...getPackingRows().map((task) => ({ ...task, taskType: "Pack" }))
  ], []);
  const [tasks, setTasks] = useState(initialTasks);

  const completeTask = (taskId: string) => {
    setTasks((current) => current.map((task) => task.id === taskId ? { ...task, status: "done" } : task));
  };

  const openTasks = tasks.filter((task) => task.status !== "done");

  return (
    <AppShell>
      <TopBar title={t("taskBoard.title")} subtitle={t("taskBoard.subtitle")} showBack backHref="/production" />
      <PageIntro eyebrow={t("taskBoard.eyebrow")} title={t("taskBoard.intro.title")} description={t("taskBoard.intro.desc")} />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <MetricCard label={t("taskBoard.total")} value={tasks.length} hint={t("taskBoard.total.hint")} icon={<FaTasks />} />
        <MetricCard label={t("status.open")} value={openTasks.length} hint={t("taskBoard.open.hint")} icon={<FaClipboardCheck />} />
        <MetricCard label={t("taskBoard.completed")} value={tasks.length - openTasks.length} hint={t("taskBoard.completed.hint")} icon={<FaCheck />} />
      </section>

      <GlassCard>
        <DataTable>
          <TableHead>
            <tr>
              <th className="px-4 py-3">{t("outbound.task")}</th>
              <th className="px-4 py-3">{t("common.type")}</th>
              <th className="px-4 py-3">{t("common.order")}</th>
              <th className="px-4 py-3">{t("taskBoard.productOrStation")}</th>
              <th className="px-4 py-3">{t("common.operator")}</th>
              <th className="px-4 py-3">{t("common.status")}</th>
              <th className="px-4 py-3">{t("common.action")}</th>
            </tr>
          </TableHead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task: any) => (
              <tr key={task.id} className="hover:bg-slate-50/80">
                <TableCell className="font-semibold text-slate-950">{task.id}</TableCell>
                <TableCell>{dataText(task.taskType)}</TableCell>
                <TableCell>{task.orderId}</TableCell>
                <TableCell>{task.product?.sku || task.station}</TableCell>
                <TableCell>{task.operator?.name}</TableCell>
                <TableCell><StatusBadge status={task.status} /></TableCell>
                <TableCell>{task.status === "done" ? <span className="text-sm text-slate-400">{t("common.complete")}</span> : <SecondaryButton onClick={() => completeTask(task.id)}><FaCheck /> {t("common.complete")}</SecondaryButton>}</TableCell>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </GlassCard>
    </AppShell>
  );
}
