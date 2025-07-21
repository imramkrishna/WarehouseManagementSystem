import { Request, Response } from "express";
import pool from "../../utils/database";
import { StatusCodes } from "../../interfaces/statusCodes";

async function updateSupplier(req: Request, res: Response) {
    try {
        const {
            company_name,
            contact_person,
            email,
            phone,
            address,
            city,
            state,
            zip_code,
            country,
            tax_id,
            payment_terms,
            rating,
            status
        } = req.body;

        // Get supplier ID from URL params
        const supplierId = req.params.id;

        // Get user ID from the authenticated request
        const updated_by = req.profile.userDetails.id;

        // Validate required fields
        if (!supplierId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Supplier ID is required"
            });
            return;
        }

        // Check if supplier exists
        const existingSupplier = await pool.query('SELECT id, company_name FROM suppliers WHERE id = $1', [supplierId]);
        if (existingSupplier.rows.length === 0) {
            res.status(StatusCodes.NOT_FOUND).json({
                message: "Supplier not found"
            });
            return;
        }

        // Check if email already exists for other suppliers (excluding current supplier)
        if (email) {
            const existingEmail = await pool.query('SELECT id FROM suppliers WHERE email = $1 AND id != $2', [email, supplierId]);
            if (existingEmail.rows.length > 0) {
                res.status(StatusCodes.CONFLICT).json({
                    message: "Email already exists for another supplier"
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

        // Validate rating
        const supplierRating = parseInt(rating) || 0;
        if (supplierRating < 0 || supplierRating > 5) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Rating must be between 0 and 5"
            });
            return;
        }

        // Validate required fields
        if (!company_name || !contact_person || !email || !phone || !address || !city || !country) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Company name, contact person, email, phone, address, city, and country are required"
            });
            return;
        }

        // Update supplier
        const updateQuery = `
            UPDATE suppliers
            SET company_name = $1, contact_person = $2, email = $3, phone = $4,
                address = $5, city = $6, state = $7, zip_code = $8, country = $9,
                tax_id = $10, payment_terms = $11, rating = $12, status = $13,
                updated_by = $14, updated_at = CURRENT_TIMESTAMP
            WHERE id = $15
            RETURNING *
        `;

        const values = [
            company_name,
            contact_person,
            email,
            phone,
            address,
            city,
            state,
            zip_code,
            country,
            tax_id,
            payment_terms,
            supplierRating,
            status || 'active',
            updated_by,
            supplierId
        ];

        const result = await pool.query(updateQuery, values);
        const updatedSupplier = result.rows[0];

        // Log the activity
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES ($1, $2, $3, $4, $5)',
            [updated_by, 'UPDATE', 'supplier', supplierId, `Updated supplier: ${company_name}`]
        );

        res.status(StatusCodes.OK).json({
            message: "Supplier updated successfully",
            supplier: updatedSupplier
        });

    } catch (error) {
        console.error("Error updating supplier:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating supplier"
        });
    }
}

export default updateSupplier;