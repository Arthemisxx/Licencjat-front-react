import type {
    AdminReport,
    AdminReportDetailsData,
    Category,
    Page,
    ReportDetails,
    ReportMapData,
    UserReportDetailsData
} from "../types/report.ts";
import axiosClient from "../Auth/axiosClient.ts";
import type {AuthenticatedUserDetails, UserUpdatedDetails} from "../types/User.ts";
import type {UserReportMini} from "../types/users.ts";
import type {AdminCategory} from "../types/category.ts";

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

export const fetchUserReportDetails = async (reportId: number): Promise<UserReportDetailsData> => {
    const response = await axiosClient.get<UserReportDetailsData>(`/reports/${reportId}`);
    return response.data;
}

export const fetchAdminReportDetails = async (reportId: number): Promise<AdminReportDetailsData> => {
    const response = await axiosClient.get<AdminReportDetailsData>(`/reports/admin/${reportId}`);
    return response.data;
}

export const fetchUserDetails = async (): Promise<AuthenticatedUserDetails> => {
    const response = await axiosClient.get<AuthenticatedUserDetails>('users/me');
    return response.data;
}

export const fetchAdminReports = async (
    page: number = 0,
    search: string = "",
    size: number = 5,
    sortField: string = "createdAt",
    sortDirection: string = "desc"): Promise<Page<AdminReport>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: `${sortField},${sortDirection}`
    });

    if (search.trim() !== "") {
        params.append("search", search.trim());
    }

    const response = await axiosClient.get<Page<AdminReport>>(`reports/admin?${params.toString()}`);
    return response.data;
}

export const updateUserDetails = async (user: UserUpdatedDetails): Promise<UserUpdatedDetails> => {
    const response = await axiosClient.put<UserUpdatedDetails>('users/me', user);
    return response.data;
}

export const updateStatus = async (status: string | null, note: string | null,  id: number): Promise<void> => {
    await axiosClient.put<UserUpdatedDetails>(`reports/${id}`, {status, note});
    return;
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


export const deleteAdminReport = async (id: number): Promise<void> => {
    const response = await axiosClient.delete<void>(`reports/${id}`);
    return response.data;
}


export const fetchAdminUsers = async (page: number = 0, search: string = "", size: number = 10, sortField: string = "id", sortDirection: string = "desc") => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sort: sortField,
        dir: sortDirection
    });
    if (search.trim() !== "") params.append("search", search.trim());

    const response = await axiosClient.get(`/users/admin?${params.toString()}`);
    return response.data;
};

export const fetchUserReportsMini = async (userId: number): Promise<UserReportMini[]> => {
    const response = await axiosClient.get(`/users/admin/${userId}/reports`);
    return response.data;
};

export const fetchAdminCategories = async (): Promise<AdminCategory[]> => {
    const response = await axiosClient.get<AdminCategory[]>('/categories');
    return response.data;
};

export const createAdminCategory = async (name: string): Promise<void> => {
    await axiosClient.post('/categories', name);
};

export const deleteAdminCategory = async (id: number): Promise<void> => {
    await axiosClient.delete(`/categories/${id}`);
};
