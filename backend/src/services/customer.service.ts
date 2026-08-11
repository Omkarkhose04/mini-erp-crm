import prisma from "../config/database.js";

interface CreateCustomerData {
    name: string;
    mobile: string;
    email?: string;
    businessName?: string;
    gstNumber?: string;
    customerType: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
    address: string;
    status?: "LEAD" | "ACTIVE" | "INACTIVE";
    followUpDate?: string;
    notes?: string;
}

export async function createCustomer(data: CreateCustomerData) {
    return prisma.customer.create({
        data: {
            name: data.name,
            mobile: data.mobile,
            email: data.email,
            businessName: data.businessName,
            gstNumber: data.gstNumber,
            customerType: data.customerType,
            address: data.address,
            status: data.status,
            followUpDate: data.followUpDate
                ? new Date(data.followUpDate)
                : undefined,
            notes: data.notes,
        },
    });
}

export async function getCustomers(search?: string) {
    return prisma.customer.findMany({
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
                        mobile: {
                            contains: search,
                        },
                    },
                    {
                        businessName: {
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

export async function getCustomerById(id: number) {
    return prisma.customer.findUnique({
        where: {
            id,
        },
        include: {
            followUps: {
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            },
        },
    });
}

export async function updateCustomer(
    id: number,
    data: Partial<CreateCustomerData>
) {
    return prisma.customer.update({
        where: {
            id,
        },
        data: {
            ...data,
            followUpDate: data.followUpDate
                ? new Date(data.followUpDate)
                : undefined,
        },
    });
}

export async function addFollowUp(
    customerId: number,
    note: string,
    followUpDate: string,
    createdById: number
) {
    return prisma.followUp.create({
        data: {
            customerId,
            note,
            followUpDate: new Date(followUpDate),
            createdById,
        },
    });
}