export declare const VIEWER_SCOPES: {
    readonly GLOBAL: "OneWayReports.GlobalViewer.Read";
    readonly COUNTRY: "OneWayReports.CountryViewer.Read";
    readonly ZONE: {
        readonly AFR: "OneWayReports.AfricaViewer.Read";
        readonly APAC: "OneWayReports.AsiaPacificViewer.Read";
        readonly EUR: "OneWayReports.EuropeViewer.Read";
        readonly MAZ: "OneWayReports.MiddleAmericasViewer.Read";
        readonly NAZ: "OneWayReports.NorthAmericasViewer.Read";
        readonly SAZ: "OneWayReports.SouthAmericasViewer.Read";
    };
};
export type ZoneScopeKey = keyof typeof VIEWER_SCOPES.ZONE;
