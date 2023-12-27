export interface HistoricData {
    time: number;
    close: number;
    high: number;
    low: number;
    open: number;
    volumefrom: number;
    volumeto: number;
}

export interface HistoricApiResponse {
    Response: string;
    Message: string;
    Data: {
    Aggregated: boolean;
    Data: HistoricData[];
    };
}