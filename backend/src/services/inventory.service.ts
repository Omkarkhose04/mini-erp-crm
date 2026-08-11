import prisma from "../config/database.js";

interface StockMovementData {
    productId: number;
    quantity: number;
    movementType: "IN" | "OUT";
    reason: string;
    createdById: number;
}

export async function createStockMovement(
    data: StockMovementData
) {
    return prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: {
                id: data.productId,
            },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        let newStock = product.currentStock;

        if (data.movementType === "IN") {
            newStock += data.quantity;
        } else {
            if (data.quantity > product.currentStock) {
                throw new Error("Insufficient stock");
            }

            newStock -= data.quantity;
        }

        const updatedProduct = await tx.product.update({
            where: {
                id: data.productId,
            },
            data: {
                currentStock: newStock,
            },
        });

        const movement = await tx.stockMovement.create({
            data: {
                productId: data.productId,
                quantity: data.quantity,
                movementType: data.movementType,
                reason: data.reason,
                createdById: data.createdById,
            },
        });

        return {
            movement,
            product: updatedProduct,
        };
    });
}

export async function getStockMovements() {
    return prisma.stockMovement.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                },
            },
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
    });
}