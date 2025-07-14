import { Request, Response } from "express";
import pool from "../../utils/database";
import { StatusCodes } from "../../interfaces/statusCodes";

async function addOrder(req: Request, res: Response) {
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
            priority = 'medium',
            status = 'pending',
            total_amount,
            tax_amount = 0,
            shipping_amount = 0,
            discount_amount = 0,
            payment_status = 'pending',
            payment_method,
            shipping_method,
            tracking_number,
            notes,
            assigned_to,
            approved_by
        } = req.body;

        // Get user ID from the authenticated request
        const created_by = req.profile.id;

        // Validate required fields
        if (!order_type || !warehouse_id || !total_amount || !expected_delivery_date) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Missing required fields: order_type, warehouse_id, total_amount, expected_delivery_date"
            });
            return;
        }

        // Validate order_type
        const validOrderTypes = ['inbound', 'outbound', 'transfer'];
        if (!validOrderTypes.includes(order_type)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid order_type. Must be one of: inbound, outbound, transfer"
            });
            return;
        }

        // Validate priority
        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!validPriorities.includes(priority)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid priority. Must be one of: low, medium, high, urgent"
            });
            return;
        }

        // Validate status
        const validStatuses = ['pending', 'processing', 'picking', 'packed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid status. Must be one of: pending, processing, picking, packed, shipped, delivered, cancelled"
            });
            return;
        }

        // Validate payment_status
        const validPaymentStatuses = ['pending', 'paid', 'refunded'];
        if (!validPaymentStatuses.includes(payment_status)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid payment_status. Must be one of: pending, paid, refunded"
            });
            return;
        }

        // For inbound orders, supplier_id is required
        if (order_type === 'inbound' && !supplier_id) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "supplier_id is required for inbound orders"
            });
            return;
        }

        // For outbound orders, customer information is required
        if (order_type === 'outbound' && (!customer_name || !customer_email)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "customer_name and customer_email are required for outbound orders"
            });
            return;
        }

        // Validate email format if provided
        if (customer_email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(customer_email)) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid customer email format"
                });
                return;
            }
        }

        // Validate warehouse exists
        const warehouseExists = await pool.query('SELECT id FROM warehouses WHERE id = $1', [warehouse_id]);
        if (warehouseExists.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Warehouse not found"
            });
            return;
        }

        // Validate supplier exists (if provided)
        if (supplier_id) {
            const supplierExists = await pool.query('SELECT id FROM suppliers WHERE id = $1', [supplier_id]);
            if (supplierExists.rows.length === 0) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: "Supplier not found"
                });
                return;
            }
        }

        // Validate assigned_to user exists (if provided)
        if (assigned_to) {
            const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [assigned_to]);
            if (userExists.rows.length === 0) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: "Assigned user not found"
                });
                return;
            }
        }

        // Generate unique order number
        const orderNumberQuery = `
            SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 'ORD-[0-9]+-([0-9]+)') AS INTEGER)), 0) + 1 as next_number
            FROM orders 
            WHERE order_number LIKE 'ORD-' || EXTRACT(YEAR FROM CURRENT_DATE) || '-%'
        `;
        const orderNumberResult = await pool.query(orderNumberQuery);
        const nextNumber = orderNumberResult.rows[0].next_number;
        const currentYear = new Date().getFullYear();
        const order_number = `ORD-${currentYear}-${nextNumber.toString().padStart(3, '0')}`;

        // Insert new order
        const insertQuery = `
            INSERT INTO orders (
                order_number, order_type, customer_name, customer_email, customer_phone, customer_address,
                supplier_id, warehouse_id, order_date, expected_delivery_date, priority, status,
                total_amount, tax_amount, shipping_amount, discount_amount, payment_status,
                payment_method, shipping_method, tracking_number, notes, created_by, assigned_to,
                approved_by, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, $9, $10, $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20, $21, $22, $23, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            ) RETURNING *
        `;

        const values = [
            order_number, order_type, customer_name, customer_email, customer_phone, customer_address,
            supplier_id, warehouse_id, expected_delivery_date, priority, status, total_amount,
            tax_amount, shipping_amount, discount_amount, payment_status, payment_method,
            shipping_method, tracking_number, notes, created_by, assigned_to, approved_by
        ];

        const result = await pool.query(insertQuery, values);
        const newOrder = result.rows[0];

        // Log the activity
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES ($1, $2, $3, $4, $5)',
            [created_by, 'CREATE', 'order', newOrder.id, `Created new ${order_type} order: ${order_number} (Total: $${total_amount})`]
        );

        res.status(StatusCodes.CREATED).json({
            message: "Order created successfully",
            order: newOrder
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error creating order"
        });
        return
    }
}

export default addOrder;