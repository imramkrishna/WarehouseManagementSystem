import { Request, Response } from "express";
import pool from "../../utils/database";
import { StatusCodes } from "../../interfaces/statusCodes";

async function updateInventory(req: Request, res: Response) {
    try {
        const {
            id,
            sku,
            product_name,
            description,
            category,
            brand,
            location,
            quantity_on_hand,
            quantity_reserved,
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
            status
        } = req.body;

        // Get user ID from the authenticated request
        const updated_by = req.profile.id;

        // Validate required fields
        if (!id) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Inventory item ID is required"
            });
            return;
        }

        // Check if inventory item exists
        const existingItem = await pool.query('SELECT id FROM inventory WHERE id = $1', [id]);
        if (existingItem.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Inventory item not found"
            });
            return;
        }

        // Check if SKU already exists for other items (excluding current item)
        if (sku) {
            const existingSku = await pool.query('SELECT id FROM inventory WHERE sku = $1 AND id != $2', [sku, id]);
            if (existingSku.rows.length > 0) {
                res.status(StatusCodes.CONFLICT).json({
                    message: "SKU already exists for another item"
                });
                return;
            }
        }

        // Calculate quantity_available
        const quantityOnHand = parseInt(quantity_on_hand) || 0;
        const quantityReserved = parseInt(quantity_reserved) || 0;

        // Update inventory item
        const updateQuery = `
            UPDATE inventory
            SET sku = $1, product_name = $2, description = $3, category = $4, brand = $5,
                location = $6, quantity_on_hand = $7, quantity_reserved = $8,
                unit_price = $9, cost_price = $10, minimum_stock_level = $11, maximum_stock_level = $12,
                reorder_point = $13, reorder_quantity = $14, unit_of_measure = $15, expiry_date = $16,
                batch_number = $17, barcode = $18, weight = $19, dimensions = $20, status = $21,
                updated_by = $22, updated_at = CURRENT_TIMESTAMP
            WHERE id = $23
            RETURNING *
        `;

        const values = [
            sku, product_name, description, category, brand,
            location, quantityOnHand, quantityReserved,
            parseFloat(unit_price) || 0, parseFloat(cost_price) || 0,
            parseInt(minimum_stock_level) || 0, parseInt(maximum_stock_level) || 0,
            parseInt(reorder_point) || 0, parseInt(reorder_quantity) || 0,
            unit_of_measure, expiry_date || null,
            batch_number, barcode, weight, dimensions, status || 'active',
            updated_by, id
        ];

        const result = await pool.query(updateQuery, values);
        const updatedItem = result.rows[0];

        // Log the activity
        // await pool.query(
        //     'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES ($1, $2, $3, $4, $5)',
        //     [updated_by, 'UPDATE', 'inventory', id, `Updated inventory item: ${product_name} (SKU: ${sku})`]
        // );

        res.status(StatusCodes.OK).json({
            message: "Inventory item updated successfully",
            item: updatedItem
        });

    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating inventory item"
        });
    }
}

export default updateInventory;