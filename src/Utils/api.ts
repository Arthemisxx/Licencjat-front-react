import type {ReportMapData} from "../types/report.ts";
import axiosClient from "../Auth/axiosClient.ts";

export const fetchFilteredReports = async (categoryIds: number[]): Promise<ReportMapData[]> => {
    const response = await axiosClient.get<ReportMapData[]>('/reports', {params: {categoryIds}});
    return response.data;
}