export interface ITrackPerformanceOptions {
    trackUrl: string;
    threshold?: number;
    batchSize?: number;
    excludeKeys: string[];
    excludeHosts: string[];
    includeHosts: string[];
    parserCb: any;
    filterCb: any;
    addAdditionalData: any;
}
declare class TrackPerformance {
    static computeMetrics(entry: any, type: any, dom: any): any;
    static chunk(array: any[], size: number): any;
    queuedEntries: any[];
    options: ITrackPerformanceOptions;
    intervalId: number;
    constructor({ trackUrl, threshold, batchSize, excludeKeys, excludeHosts, includeHosts, parserCb, filterCb, addAdditionalData, }: ITrackPerformanceOptions);
    handleEntries(entries: any[]): void;
    sendToServer(): void;
    stop(): void;
    static getDeviceType(): any;
    static getOS(): any;
}
export default TrackPerformance;
