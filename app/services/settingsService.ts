import apiService from "./apiService";

export interface LogoSettings {
    ceoName: string;
}

export const settingsService = {
    async getLogoSettings(): Promise<LogoSettings> {
        try {
            const response = await apiService.get<LogoSettings>("/settings/logo");
            return response;
        } catch (error) {
            console.error("Error fetching logo settings:", error);
            return { ceoName: "" }; // Fallback
        }
    },
};
