import { Request, Response } from "express";
import pool from "../../utils/database";
import { StatusCodes } from "../../interfaces/statusCodes";

async function updateWarehouse(req: Request, res: Response) {
    try {
        const {
            name,
            address,
            city,
            state,
            country,
            zip_code,
            phone,
            email,
            warehouse_type,
            status,
            total_capacity,
            available_capacity,
            manager_id
        } = req.body;

        // Get warehouse ID from URL params
        const warehouseId = req.params.id;

        // Get user ID from the authenticated request
        const updated_by = req.profile.userDetails.id;

        // Validate required fields
        if (!warehouseId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Warehouse ID is required"
            });
            return;
        }

        // Check if warehouse exists
        const existingWarehouse = await pool.query('SELECT id, name FROM warehouses WHERE id = $1', [warehouseId]);
        if (existingWarehouse.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Warehouse not found"
            });
            return;
        }

        // Check if email already exists for other warehouses (excluding current warehouse)
        if (email) {
            const existingEmail = await pool.query('SELECT id FROM warehouses WHERE email = $1 AND id != $2', [email, warehouseId]);
            if (existingEmail.rows.length > 0) {
                res.status(StatusCodes.CONFLICT).json({
                    message: "Email already exists for another warehouse"
                });
                return;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email && !emailRegex.test(email)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Please enter a valid email address"
            });
            return;
        }

        // Validate required fields
        if (!name || !address || !city || !country || !zip_code || !phone || !email) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Name, address, city, country, ZIP code, phone, and email are required"
            });
            return;
        }

        // Validate capacity values
        const totalCap = parseInt(total_capacity) || 0;
        const availableCap = parseInt(available_capacity) || 0;

        if (totalCap <= 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Total capacity must be greater than 0"
            });
            return;
        }

        if (availableCap < 0) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Available capacity cannot be negative"
            });
            return;
        }

        if (availableCap > totalCap) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Available capacity cannot exceed total capacity"
            });
            return;
        }

        // Validate manager exists (if provided)
        if (manager_id) {
            const managerExists = await pool.query('SELECT id FROM users WHERE id = $1', [manager_id]);
            if (managerExists.rows.length === 0) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Invalid manager ID"
                });
                return;
            }
        }

        // Calculate capacity utilization
        const capacity_utilization = totalCap > 0 ? ((totalCap - availableCap) / totalCap) * 100 : 0;

        // Update warehouse
        const updateQuery = `
            UPDATE warehouses
            SET name = $1, address = $2, city = $3, state = $4, country = $5,
                zip_code = $6, phone = $7, email = $8, warehouse_type = $9, status = $10,
                total_capacity = $11, available_capacity = $12, capacity_utilization = $13,
                manager_id = $14, updated_by = $15, updated_at = CURRENT_TIMESTAMP
            WHERE id = $16
            RETURNING *
        `;

        const values = [
            name,
            address,
            city,
            state,
            country,
            zip_code,
            phone,
            email,
            warehouse_type || 'storage',
            status || 'active',
            totalCap,
            availableCap,
            Math.round(capacity_utilization * 100) / 100, // Round to 2 decimal places
            manager_id ? parseInt(manager_id) : null,
            updated_by,
            warehouseId
        ];

        const result = await pool.query(updateQuery, values);
        const updatedWarehouse = result.rows[0];

        // Log the activity
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES ($1, $2, $3, $4, $5)',
            [updated_by, 'UPDATE', 'warehouse', warehouseId, `Updated warehouse: ${name}`]
        );

        // Update warehouse capacity history (for tracking capacity changes over time)
        await pool.query(
            'INSERT INTO warehouse_capacity_history (warehouse_id, total_capacity, available_capacity, capacity_utilization, recorded_by, recorded_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)',
            [warehouseId, totalCap, availableCap, capacity_utilization, updated_by]
        );

        res.status(StatusCodes.OK).json({
            message: "Warehouse updated successfully",
            warehouse: updatedWarehouse
        });

    } catch (error) {
        console.error("Error updating warehouse:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating warehouse"
        });
    }
}

export default updateWarehouse;