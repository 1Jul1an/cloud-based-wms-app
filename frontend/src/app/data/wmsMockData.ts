import data from "./wmsMockData.json";

export type WmsMockData = typeof data;
export type StatusTone = "blue" | "green" | "amber" | "red" | "slate" | "cyan";

export const wmsData = data;

export const getProduct = (id: string) => wmsData.products.find((item) => item.id === id);
export const getWarehouse = (id: string) => wmsData.warehouses.find((item) => item.id === id);
export const getLocation = (id: string | null) => id ? wmsData.locations.find((item) => item.id === id) : undefined;
export const getSupplier = (id: string) => wmsData.suppliers.find((item) => item.id === id);
export const getOperator = (id: string) => wmsData.operators.find((item) => item.id === id);
export const getOrder = (id: string) => wmsData.orders.find((item) => item.id === id);

export const statusLabel: Record<string, string> = {
  operational: "Operational",
  available: "Available",
  low_stock: "Low stock",
  replenish_today: "Replenish today",
  quality_hold: "Quality hold",
  arrived: "Arrived",
  expected: "Expected",
  in_review: "In review",
  received: "Received",
  released: "Released",
  picking: "Picking",
  ready_to_pack: "Ready to pack",
  packed: "Packed",
  shipped: "Shipped",
  in_progress: "In progress",
  open: "Open",
  done: "Done",
  ready: "Ready",
  label_printed: "Label printed",
  awaiting_pack: "Awaiting pack",
  high: "High",
  medium: "Medium",
  standard: "Standard",
  express: "Express"
};

export const statusTone: Record<string, StatusTone> = {
  operational: "green",
  available: "green",
  low_stock: "amber",
  replenish_today: "cyan",
  quality_hold: "red",
  arrived: "blue",
  expected: "slate",
  in_review: "amber",
  received: "green",
  released: "blue",
  picking: "amber",
  ready_to_pack: "cyan",
  packed: "green",
  shipped: "green",
  in_progress: "amber",
  open: "slate",
  done: "green",
  ready: "cyan",
  label_printed: "blue",
  awaiting_pack: "amber",
  high: "red",
  medium: "amber",
  standard: "slate",
  express: "red"
};

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function getInventoryRows() {
  return wmsData.inventory.map((row) => {
    const product = getProduct(row.productId)!;
    const warehouse = getWarehouse(row.warehouseId)!;
    const location = getLocation(row.locationId)!;

    return {
      ...row,
      product,
      warehouse,
      location,
      sku: product.sku,
      name: product.name,
      category: product.category,
      unit: product.unit,
      reorderPoint: product.reorderPoint
    };
  });
}

export function getOrderRows() {
  return wmsData.orders.map((order) => ({
    ...order,
    warehouse: getWarehouse(order.warehouseId),
    lines: order.items.map((line) => ({ ...line, product: getProduct(line.productId)! }))
  }));
}

export function getInboundRows() {
  return wmsData.inboundDeliveries.map((delivery) => ({
    ...delivery,
    supplier: getSupplier(delivery.supplierId),
    warehouse: getWarehouse(delivery.warehouseId),
    lines: delivery.items.map((line) => ({ ...line, product: getProduct(line.productId)! }))
  }));
}

export function getPickingRows() {
  return wmsData.pickingTasks.map((task) => ({
    ...task,
    order: getOrder(task.orderId),
    product: getProduct(task.productId),
    location: getLocation(task.locationId),
    operator: getOperator(task.operatorId)
  }));
}

export function getPackingRows() {
  return wmsData.packingTasks.map((task) => ({
    ...task,
    order: getOrder(task.orderId),
    operator: getOperator(task.operatorId)
  }));
}

export function getShipmentRows() {
  return wmsData.shipments.map((shipment) => ({
    ...shipment,
    order: getOrder(shipment.orderId)
  }));
}

export function getMovementRows() {
  return wmsData.stockMovements.map((movement) => ({
    ...movement,
    product: getProduct(movement.productId),
    fromLocation: getLocation(movement.fromLocationId),
    toLocation: getLocation(movement.toLocationId)
  }));
}

export function getDashboardMetrics() {
  const inventoryRows = getInventoryRows();
  const orders = wmsData.orders;
  const openPicks = wmsData.pickingTasks.filter((task) => task.status !== "done").length;
  const openAlerts = wmsData.alerts.filter((alert) => alert.status === "open").length;
  const availableUnits = inventoryRows.reduce((sum, row) => sum + row.available, 0);
  const dueToday = orders.filter((order) => order.dueAt.startsWith(wmsData.meta.operatingDate)).length;
  const lowStock = inventoryRows.filter((row) => row.status === "low_stock" || row.available < row.reorderPoint).length;

  return { availableUnits, dueToday, openPicks, openAlerts, lowStock };
}

export function getInventoryApiShape() {
  const groups = new Map<string, any[]>();

  getInventoryRows().forEach((row) => {
    const item = {
      MatID: Number(row.product.id.replace("PRD-", "")),
      Materialname: row.product.name,
      SKU: row.product.sku,
      Lagername: row.warehouse.name,
      LagerID: row.warehouse.id,
      Lagerort: row.location.code,
      Menge: row.onHand,
      Reserviert: row.reserved,
      Verfuegbar: row.available,
      Active: String(row.product.active),
      Status: row.status,
      Charge: row.lot
    };

    const existing = groups.get(row.product.category) || [];
    existing.push(item);
    groups.set(row.product.category, existing);
  });

  return Array.from(groups.entries()).map(([Kategorie, Materialien], index) => ({
    MatKatID: index + 1,
    Kategorie,
    Materialien
  }));
}

export function getIncomeApiShape() {
  const mapDelivery = (delivery: (typeof wmsData.inboundDeliveries)[number]) => ({
    BestellID: delivery.id,
    PONumber: delivery.poNumber,
    Lieferant: getSupplier(delivery.supplierId)?.name,
    ETA: delivery.eta,
    Materialien: delivery.items.map((line) => {
      const product = getProduct(line.productId)!;
      return {
        MatID: Number(product.id.replace("PRD-", "")),
        SKU: product.sku,
        Name: product.name,
        Menge: line.expectedQty,
        Received: line.receivedQty
      };
    })
  });

  return {
    offen: wmsData.inboundDeliveries.filter((delivery) => delivery.status !== "in_review").map(mapDelivery),
    pruefung: wmsData.inboundDeliveries.filter((delivery) => delivery.status === "in_review").map(mapDelivery)
  };
}

export function getSupplierApiShape() {
  return {
    Lieferanten: wmsData.suppliers.map((supplier) => ({
      LiefID: supplier.legacyId,
      Name: supplier.name,
      LeadTimeDays: supplier.leadTimeDays,
      Reliability: supplier.reliability
    }))
  };
}

export function getSupplierMaterialsApiShape(legacySupplierId: number) {
  const supplier = wmsData.suppliers.find((item) => item.legacyId === legacySupplierId);
  if (!supplier) return [];

  return wmsData.supplierProducts
    .filter((item) => item.supplierId === supplier.id)
    .map((item, index) => {
      const product = getProduct(item.productId)!;
      return {
        MatLiefID: index + 1,
        MatID: Number(product.id.replace("PRD-", "")),
        MaterialName: product.name,
        SKU: product.sku,
        LieferantName: supplier.name,
        Mindestmenge: item.minOrderQty,
        Link: item.link
      };
    });
}

export function getFulfillmentProfileRows() {
  return wmsData.fulfillmentProfiles.map((profile) => ({
    ...profile,
    productRows: profile.products.map((id) => getProduct(id)).filter(Boolean)
  }));
}
