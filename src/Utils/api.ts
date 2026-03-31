import type {Category, ReportMapData} from "../types/report.ts";
import axiosClient from "../Auth/axiosClient.ts";

export const fetchFilteredReports = async (categoryIds: number[]): Promise<ReportMapData[]> => {
    const response = await axiosClient.get<ReportMapData[]>('/reports', {params: {categoryIds}});
    return response.data;
}

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>('/categories');
    return response.data;
}