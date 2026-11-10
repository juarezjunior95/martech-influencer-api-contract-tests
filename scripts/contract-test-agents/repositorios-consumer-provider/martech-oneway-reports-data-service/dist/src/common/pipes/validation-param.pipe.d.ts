import { PipeTransform, ArgumentMetadata } from "@nestjs/common";
export declare class ValidationParamPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any;
}
