import { ImagesService } from "./images.service";
import { ImagesBrandQueryDto } from "./dto/images-brand-query.dto";
import { ImagesCountryQueryDto } from "./dto/images-country-query.dto";
export declare class ImagesController {
    private readonly imagesService;
    constructor(imagesService: ImagesService);
    getBrand(query: ImagesBrandQueryDto): import("./images.service").ResolveBrandImageResult;
    getCountry(query: ImagesCountryQueryDto): import("./images.service").ResolveCountryImageResult;
}
