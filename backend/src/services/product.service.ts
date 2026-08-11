import prisma from "../config/database.js";

interface CreateProductData {
    name: string;
    sku: string;
    category: string;
    unitPrice: number;
    currentStock?: number;
    minimumStock: number;
    warehouseLocation: string;
}

export async function createProduct(data: CreateProductData) {
    return prisma.product.create({
        data: {
            name: data.name,
            sku: data.sku,
            category: data.category,
            unitPrice: data.unitPrice,
            currentStock: data.currentStock ?? 0,
            minimumStock: data.minimumStock,
            warehouseLocation: data.warehouseLocation,
        },
    });
}

export async function getProducts(search?: string) {
    return prisma.product.findMany({
        where: search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        sku: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        category: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : undefined,
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function getProductById(id: number) {
    return prisma.product.findUnique({
        where: {
            id,
        },
    });
}

export async function updateProduct(
    id: number,
    data: Partial<CreateProductData>
) {
    return prisma.product.update({
        where: {
            id,
        },
        data,
    });
}