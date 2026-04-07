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

//todo: poprawić - dodać pola
export interface ReportAdminDetails{
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
    author: string;
}
