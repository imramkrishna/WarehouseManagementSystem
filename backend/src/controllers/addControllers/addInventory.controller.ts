import { Request, Response } from "express";
import pool from "../../utils/database";
import { StatusCodes } from "../../interfaces/statusCodes";

async function addInventory(req: Request, res: Response) {
    try {
        const {
            sku,
            product_name,
            description,
            category,
            brand,
            supplier_id,
            warehouse_id,
            location,
            quantity_on_hand,
            quantity_reserved = 0,
            unit_price,
            cost_price,
            minimum_stock_level,
            maximum_stock_level,
            reorder_point,
            reorder_quantity,
            unit_of_measure,
            expiry_date,
            batch_number,
            barcode,
            weight,
            dimensions,
            status = 'active'
        } = req.body;

        // Get user ID from the authenticated request
        const created_by = req.profile.id;

        // Validate required fields
        if (!sku || !product_name || !category || !supplier_id || !warehouse_id || !quantity_on_hand || !unit_price || !cost_price) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Missing required fields: sku, product_name, category, supplier_id, warehouse_id, quantity_on_hand, unit_price, cost_price"
            });
            return
        }

        // Check if SKU already exists
        const existingSku = await pool.query('SELECT id FROM inventory WHERE sku = $1', [sku]);
        if (existingSku.rows.length > 0) {
            res.status(StatusCodes.CONFLICT).json({
                message: "SKU already exists. Please use a unique SKU."
            });
            return
        }

        // Validate supplier exists
        const supplierExists = await pool.query('SELECT id FROM suppliers WHERE id = $1', [supplier_id]);
        if (supplierExists.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Supplier not found"
            });
            return
        }

        // Validate warehouse exists
        const warehouseExists = await pool.query('SELECT id FROM warehouses WHERE id = $1', [warehouse_id]);
        if (warehouseExists.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Warehouse not found"
            });
            return;
        }

        // Calculate quantity_available
        const quantity_available = quantity_on_hand - quantity_reserved;

        // Insert new inventory item
        const insertQuery = `
            INSERT INTO inventory (
                sku, product_name, description, category, brand, supplier_id, warehouse_id, location,
                quantity_on_hand, quantity_reserved, quantity_available, unit_price, cost_price,
                minimum_stock_level, maximum_stock_level, reorder_point, reorder_quantity,
                unit_of_measure, expiry_date, batch_number, barcode, weight, dimensions,
                status, last_counted_date, created_by, updated_by, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
                $18, $19, $20, $21, $22, $23, $24, CURRENT_TIMESTAMP, $25, $26, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            ) RETURNING *
        `;

        const values = [
            sku, product_name, description, category, brand, supplier_id, warehouse_id, location,
            quantity_on_hand, quantity_reserved, quantity_available, unit_price, cost_price,
            minimum_stock_level, maximum_stock_level, reorder_point, reorder_quantity,
            unit_of_measure, expiry_date, batch_number, barcode, weight, dimensions,
            status, created_by, created_by
        ];

        const result = await pool.query(insertQuery, values);
        const newItem = result.rows[0];

        // Log the activity
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES ($1, $2, $3, $4, $5)',
            [created_by, 'CREATE', 'inventory', newItem.id, `Added new inventory item: ${product_name} (SKU: ${sku})`]
        );

        res.status(StatusCodes.CREATED).json({
            message: "Inventory item added successfully",
            item: newItem
        });

    } catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error adding inventory item"
        });
        return;
    }
}

export default addInventory;