export declare class ViewFilterDto {
    filter?: {
        [key: string]: string | number | boolean | {
            [nestedKey: string]: string | number | boolean;
        };
    };
}
