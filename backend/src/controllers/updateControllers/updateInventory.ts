import { Request, Response } from "express";
import pool from "../../utils/database";
async function updateInventory(req: Request, res: Response) {
    const { id, brand, category, cost_price, description, dimensions, expiry_date, maximum_stock_level, minimum_stock_level
        , quantity_on_hand, quantity_reserved, unit_of_measure, status } = req.body;

    try {
        const query = `
            UPDATE inventory
            SET sku = $1, product_name = $2, quantity = $3, supplier_id = $4, status = $5
            WHERE id = $6
        `;
        const values = [sku, product_name, quantity, supplier_id, status, id];

        await pool.query(query, values);
        res.status(200).json({ message: "Inventory updated successfully" });
    } catch (error) {
        console.error("Error updating inventory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}