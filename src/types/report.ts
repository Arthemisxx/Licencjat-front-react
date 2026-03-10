export interface ReportData{
    categoryId: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    address?: string;
    guestEmail?: string;
    photos?: File[];
    }

export interface PartialReport{
    title: string
    description: string;
    latitude: number;
    longitude: number;
    address: string;
    photos?: File[];
}