import { Request, Response } from "express";
import pool from "../../utils/database";
import { StatusCodes } from "../../interfaces/statusCodes";

async function addSupplier(req: Request, res: Response) {
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
            rating = 0,
            status = 'active'
        } = req.body;

        // Get user ID from the authenticated request
        const created_by = req.profile.id;

        // Validate required fields
        if (!company_name || !contact_person || !email || !phone || !address || !city || !country) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Missing required fields: company_name, contact_person, email, phone, address, city, country"
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid email format"
            });
            return;
        }

        // Validate rating range
        if (rating < 0 || rating > 5) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Rating must be between 0 and 5"
            });
            return;
        }

        // Check if supplier with same email already exists
        const existingSupplier = await pool.query('SELECT id FROM suppliers WHERE email = $1', [email]);
        if (existingSupplier.rows.length > 0) {
            res.status(StatusCodes.CONFLICT).json({
                message: "Supplier with this email already exists"
            });
        }

        // Check if company name already exists
        const existingCompany = await pool.query('SELECT id FROM suppliers WHERE company_name = $1', [company_name]);
        if (existingCompany.rows.length > 0) {
            res.status(StatusCodes.CONFLICT).json({
                message: "Company name already exists"
            });
            return;
        }

        // Insert new supplier
        const insertQuery = `
            INSERT INTO suppliers (
                company_name, contact_person, email, phone, address, city, state, zip_code, country,
                tax_id, payment_terms, rating, status, created_by, updated_by, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            ) RETURNING *
        `;

        const values = [
            company_name, contact_person, email, phone, address, city, state, zip_code, country,
            tax_id, payment_terms, rating, status, created_by, created_by
        ];

        const result = await pool.query(insertQuery, values);
        const newSupplier = result.rows[0];

        // Log the activity
        await pool.query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description) VALUES ($1, $2, $3, $4, $5)',
            [created_by, 'CREATE', 'supplier', newSupplier.id, `Added new supplier: ${company_name} (Contact: ${contact_person})`]
        );

        res.status(StatusCodes.CREATED).json({
            message: "Supplier added successfully",
            supplier: newSupplier
        });

    } catch (error) {
        console.error('Error adding supplier:', error);

        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error adding supplier"
        });
        return;
    }
}

export default addSupplier;