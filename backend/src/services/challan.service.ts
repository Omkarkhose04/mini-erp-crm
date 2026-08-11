import prisma from "../config/database.js";

interface ChallanItemData {
    productId: number;
    quantity: number;
}

interface CreateChallanData {
    customerId: number;
    items: ChallanItemData[];
    createdById: number;
}

function generateChallanNumber() {
    const timestamp = Date.now();

    return `CH-${timestamp}`;
}

export async function createChallan(data: CreateChallanData) {
    const customer = await prisma.customer.findUnique({
        where: {
            id: data.customerId,
        },
    });

    if (!customer) {
        throw new Error("Customer not found");
    }

    if (!data.items || data.items.length === 0) {
        throw new Error("At least one product is required");
    }

    const productIds = data.items.map((item) => item.productId);

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
        },
    });

    if (products.length !== productIds.length) {
        throw new Error("One or more products not found");
    }

    let totalQuantity = 0;

    const challanItems = data.items.map((item) => {
        const product = products.find(
            (p) => p.id === item.productId
        );

        if (!product) {
            throw new Error("Product not found");
        }

        if (item.quantity <= 0) {
            throw new Error(
                "Product quantity must be greater than 0"
            );
        }

        totalQuantity += item.quantity;

        return {
            productId: product.id,
            productNameSnapshot: product.name,
            skuSnapshot: product.sku,
            unitPriceSnapshot: product.unitPrice,
            quantity: item.quantity,
            total: product.unitPrice.mul(item.quantity),
        };
    });

    return prisma.challan.create({
        data: {
            challanNumber: generateChallanNumber(),
            customerId: data.customerId,
            totalQuantity,
            status: "DRAFT",
            createdById: data.createdById,
            items: {
                create: challanItems,
            },
        },
        include: {
            customer: true,
            items: true,
        },
    });
}


// ===============================
// CONFIRM CHALLAN
// ===============================

export async function confirmChallan(
    challanId: number,
    userId: number
) {
    return prisma.$transaction(async (tx) => {

        // 1. Find the challan
        const challan = await tx.challan.findUnique({
            where: {
                id: challanId,
            },
            include: {
                items: true,
            },
        });

        if (!challan) {
            throw new Error("Challan not found");
        }

        // 2. Make sure challan is still a DRAFT
        if (challan.status !== "DRAFT") {
            throw new Error(
                "Only draft challans can be confirmed"
            );
        }

        // 3. Check stock for ALL products first
        for (const item of challan.items) {

            const product = await tx.product.findUnique({
                where: {
                    id: item.productId,
                },
            });

            if (!product) {
                throw new Error(
                    `Product not found: ${item.productId}`
                );
            }

            if (item.quantity > product.currentStock) {
                throw new Error(
                    `Insufficient stock for ${product.name}`
                );
            }
        }

        // 4. Reduce stock and create OUT movements
        for (const item of challan.items) {

            const product = await tx.product.findUnique({
                where: {
                    id: item.productId,
                },
            });

            if (!product) {
                throw new Error("Product not found");
            }

            await tx.product.update({
                where: {
                    id: item.productId,
                },
                data: {
                    currentStock:
                        product.currentStock - item.quantity,
                },
            });

            await tx.stockMovement.create({
                data: {
                    productId: item.productId,
                    quantity: item.quantity,
                    movementType: "OUT",
                    reason: `Challan ${challan.challanNumber}`,
                    createdById: userId,
                },
            });
        }

        // 5. Finally change status to CONFIRMED
        return tx.challan.update({
            where: {
                id: challanId,
            },
            data: {
                status: "CONFIRMED",
            },
            include: {
                customer: true,
                items: true,
            },
        });
    });
}

export async function getChallans() {
    return prisma.challan.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    mobile: true,
                    businessName: true,
                },
            },
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
            items: true,
        },
    });
}

export async function getChallanById(id: number) {
    return prisma.challan.findUnique({
        where: {
            id,
        },
        include: {
            customer: true,
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            items: true,
        },
    });
}

export async function cancelChallan(id: number) {
    const challan = await prisma.challan.findUnique({
        where: {
            id,
        },
    });

    if (!challan) {
        throw new Error("Challan not found");
    }

    if (challan.status !== "DRAFT") {
        throw new Error(
            "Only draft challans can be cancelled"
        );
    }

    return prisma.challan.update({
        where: {
            id,
        },
        data: {
            status: "CANCELLED",
        },
        include: {
            customer: true,
            items: true,
        },
    });
}