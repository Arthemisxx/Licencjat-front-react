import type {Category, ReportDetails, ReportMapData} from "../types/report.ts";
import axiosClient from "../Auth/axiosClient.ts";
import type {AuthenticatedUserDetails, UserUpdatedDetails} from "../types/User.ts";

export const fetchFilteredReports = async (categoryIds: number[]): Promise<ReportMapData[]> => {
    const response = await axiosClient.get<ReportMapData[]>('/reports', {params: {categoryIds}});
    return response.data;
}

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>('/categories');
    return response.data;
}

export const fetchReportDetails = async (reportId: number): Promise<ReportDetails> => {
    const response = await axiosClient.get<ReportDetails>(`/reports/${reportId}`);
    return response.data;
}

export const fetchUserDetails = async (): Promise<AuthenticatedUserDetails> => {
    const response = await axiosClient.get<AuthenticatedUserDetails>('users/me');
    return response.data;
}

export const updateUserDetails = async (user: UserUpdatedDetails): Promise<UserUpdatedDetails> => {
    const response = await axiosClient.put<UserUpdatedDetails>('users/me', user);
    return response.data;
}

export const fetchCurrentUserReports = async (): Promise<ReportDetails[]> => {
    const response = await axiosClient.get<ReportDetails[]>('users/me/reports');
    return response.data;
}
export const fetchCurrentUserWatchedReports = async (): Promise<ReportDetails[]> => {
    const response = await axiosClient.get<ReportDetails[]>('users/me/watched');
    return response.data;
}

export const toggleWatchReport = async (reportId: number): Promise<void> => {
    await axiosClient.post(`/reports/${reportId}/watch`);
};


