export interface ReportData{
    authorId: number | null;
    guestEmail: string | null;
    categoryId: number;
    description: string;
    latitude: number;
    longitude: number;
    address: string | null;
    photos?: File[];
    }


export interface Category{
    id: number;
    name: string;
    iconKey?: string;
    colorHex?: string;
}

export interface ReportMapData{
    id: number;
    categoryId: number;
    categoryName: string;
    categoryIconKey: string;
    categoryColorHex: string;
    latitude: number;
    longitude: number;
}
export interface ReportDetails{
    id: number;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    categoryId: number;
    categoryName: string;
    categoryIconKey?: string;
    categoryColorHex?: string;
    imageUrls?: string[];
    isWatched?: boolean;
}



export interface AdminReportDetailsData {
    adminNote?: string;
    id: number;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    authorId: number | null;
    authorName: string;
    authorEmail?: string;
    imageUrls?: string[];
    watchedBy: number;
    isWatched?: boolean;
}

export interface UserReportDetailsData {
    id: number;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    imageUrls?: string[];
    isWatched?: boolean;
}

export interface AdminReport {
    id: number;
    description: string;
    categoryId: number;
    categoryName: string;
    createdAt: Date;
    updatedAt: Date;
    status: string;
    authorId: number | null;
    authorName: string;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    last: boolean;
    empty: boolean;
}
