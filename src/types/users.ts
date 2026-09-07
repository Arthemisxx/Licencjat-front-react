export interface AdminUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    reportsCount: number;
}

export interface UserReportMini {
    id: number;
    description: string;
    categoryName: string;
    status: string;
    createdAt: string;
}