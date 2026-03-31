export interface ReportData{
    categoryId: number;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
    guestEmail?: string;
    photos?: File[];
    }


export interface Category{
    id: number;
    name: string;
    iconKey: string;
    colorHex: string;
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