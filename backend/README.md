# Motoko ICP Backend for Vendor Dapp

This backend is a Motoko-based canister implementation for the Vendor Dapp, migrated from a Django REST API backend. It provides similar data models, business logic, and HTTP endpoints for use on the Internet Computer (ICP).

## Structure
- `main.mo`: Main Motoko canister logic, including models, CRUD, and API endpoints.
- `models/`: Motoko modules for each data model (Company, Product, Category, etc.).
- `utils/`: Utility modules (auth, email, allocation, etc.).
- `tests/`: Test modules for canister logic.

## Features
- Company, Product, Category, Retailer, Order, and related CRUD operations
- JWT-like authentication (ICP compatible)
- Business logic for allocation, Odoo integration, and more
- HTTP endpoints mapped from Django API

## Usage
- Deploy on ICP using DFX
- Interact via HTTP or Candid

## Migration Notes
- All Django models and endpoints are mapped to Motoko modules and HTTP endpoints.
- Authentication uses ICP identity and tokens.
- Utilities (email, Odoo, etc.) are adapted for Motoko/ICP.

See the full documentation at the end of this project for details.
