import { Request, Response } from "express";
import pool from "../../utils/database";
import { StatusCodes } from "../../interfaces/statusCodes";

async function updateOrder(req: Request, res: Response) {
    try {
        const {
            order_type,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            supplier_id,
            warehouse_id,
            expected_delivery_date,
            priority,
            status,
            total_amount,
            tax_amount,
            shipping_amount,
            discount_amount,
            payment_status,
            payment_method,
            shipping_method,
            tracking_number,
            notes,
            assigned_to,
            approved_by
        } = req.body;

        // Get order ID from URL params
        const orderId = req.params.id;

        // Get user ID from the authenticated request
        const updated_by = req.profile.id;

        // Validate required fields
        if (!orderId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Order ID is required"
            });
            return;
        }

        // Check if order exists
        const existingOrder = await pool.query('SELECT id, order_number FROM orders WHERE id = $1', [orderId]);
        if (existingOrder.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Order not found"
            });
            return;
        }

        // Validate order type specific requirements
        if (order_type === 'inbound' && !supplier_id) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Supplier is required for inbound orders"
            });
            return;
        }

        if (order_type === 'outbound') {
            if (!customer_name || !customer_email) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Customer name and email are required for outbound orders"
                });
                return;
            }
        }

        // Validate warehouse exists
        if (warehouse_id) {
            const warehouseExists = await pool.query('SELECT id FROM warehouses WHERE id = $1', [warehouse_id]);
            if (warehouseExists.rows.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid warehouse ID"
                });
                return;
            }
        }

        // Validate supplier exists (for inbound orders)
        if (supplier_id) {
            const supplierExists = await pool.query('SELECT id FROM suppliers WHERE id = $1', [supplier_id]);
            if (supplierExists.rows.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid supplier ID"
                });
                return;
            }
        }

        // Calculate net amount (total - discount)
        const totalAmt = parseFloat(total_amount) || 0;
        const discountAmt = parseFloat(discount_amount) || 0;
        const net_amount = totalAmt - discountAmt;

        // Update order
        const updateQuery = `
            UPDATE orders
            SET order_type = $1, customer_name = $2, customer_email = $3, customer_phone = $4,
                customer_address = $5, supplier_id = $6, warehouse_id = $7, expected_delivery_date = $8,
                priority = $9, status = $10, total_amount = $11, tax_amount = $12,
                shipping_amount = $13, discount_amount = $14, net_amount = $15, payment_status = $16,
                payment_method = $17, shipping_method = $18, tracking_number = $19, notes = $20,
                assigned_to = $21, approved_by = $22, updated_by = $23, updated_at = CURRENT_TIMESTAMP
            WHERE id = $24
            RETURNING *
        `;

        const values = [
            order_type,
            order_type === 'outbound' ? customer_name : null,
            order_type === 'outbound' ? customer_email : null,
            order_type === 'outbound' ? customer_phone : null,
            order_type === 'outbound' ? customer_address : null,
            order_type === 'inbound' ? parseInt(supplier_id) || null : null,
            parseInt(warehouse_id) || null,
            expected_delivery_date || null,
            priority || 'medium',
            status || 'pending',
            totalAmt,
            parseFloat(tax_amount) || 0,
            parseFloat(shipping_amount) || 0,
            discountAmt,
            net_amount,
            payment_status || 'pending',
            payment_method,
            shipping_method,
            tracking_number,
            notes,
            assigned_to ? parseInt(assigned_to) : null,
            approved_by ? parseInt(approved_by) : null,
            updated_by,
            orderId
        ];

        const result = await pool.query(updateQuery, values);
        const updatedOrder = result.rows[0];

        // Log the activity
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES ($1, $2, $3, $4, $5)',
            [updated_by, 'UPDATE', 'order', orderId, `Updated ${order_type} order ${updatedOrder.order_number}`]
        );

        // Update order status history if status changed
        if (status) {
            await pool.query(
                'INSERT INTO order_status_history (order_id, status, changed_by, changed_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
                [orderId, status, updated_by]
            );
        }

        res.status(StatusCodes.OK).json({
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating order:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating order"
        });
    }
}

export default updateOrder;