import { View } from "../entities/view.entity";
import { UserEntity } from "../entities/user.entity";
export interface IViewCacheRepository {
    getView(viewEntity: View, user?: UserEntity | null): Promise<any | null>;
    setView(viewEntity: View, user: UserEntity | null, result: any, ttl?: number): Promise<boolean>;
    invalidateByTags(tags: string[]): Promise<number>;
}
