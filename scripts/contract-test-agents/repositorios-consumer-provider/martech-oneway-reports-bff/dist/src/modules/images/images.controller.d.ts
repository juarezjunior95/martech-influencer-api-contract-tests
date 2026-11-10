import { ImagesBrandQueryDto } from "./dto/images-brand-query.dto";
import { ImagesCountryQueryDto } from "./dto/images-country-query.dto";
import { ImagesProxyService } from "./images-proxy.service";
export declare class ImagesController {
    private readonly imagesProxyService;
    constructor(imagesProxyService: ImagesProxyService);
    getBrand(query: ImagesBrandQueryDto): Promise<any>;
    getCountry(query: ImagesCountryQueryDto): Promise<any>;
}
