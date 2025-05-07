import { Sql, sqltag } from "@prisma/client/runtime/library";

export const ORDERE_TOTAL_QUERY: TemplateStringsArray | Sql = sqltag`
WITH order_stats AS (
    SELECT
        id,
        total_price,
        status,
        user_id
    FROM "Order"
),
order_detail_stats AS (
    SELECT
        o.id,
        SUM(od.quantity)::int AS "soldProducts",
        SUM(CASE WHEN o.user_id != '968954832' THEN od.product_price * 0.2 ELSE 0 END)::int AS "mimsShare"
    FROM "Order" o
    LEFT JOIN "OrderDetails" od ON o.id = od.order_id
    GROUP BY o.id, o.user_id
)
SELECT
    COUNT(DISTINCT o.id)::int AS "ordersCount",
    SUM(CASE WHEN o.status != 'Payed' THEN o.total_price ELSE 0 END)::int AS "waitingPayments",
    SUM(CASE WHEN o.status != 'Canceled' THEN o.total_price ELSE 0 END)::int AS "totalPayment",
    SUM(od_stats."soldProducts")::int AS "soldProducts",
    SUM(od_stats."mimsShare")::int AS "mimsShare"
FROM order_stats o
LEFT JOIN order_detail_stats od_stats ON o.id = od_stats.id
`
export const ORDER_DELETE: TemplateStringsArray | Sql = sqltag``