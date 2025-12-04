import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrivacyLevel, User } from '../users/entities/user.entity';
import * as crypto from 'crypto';

/**
 * Privacy Interceptor - The Onion Protocol
 * 
 * Filters user PII based on their privacy_level setting:
 * - PUBLIC: Full data visible
 * - ALIAS: Name replaced with generated alias, email/phone hidden
 * - MEDIATED: Only alias + location visible, contact via platform
 * - GHOST: Only user ID visible, completely anonymous
 */
@Injectable()
export class PrivacyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const viewerRole = request.user?.role || 'anonymous';
        const viewerId = request.user?.id;

        return next.handle().pipe(
            map(data => this.applyPrivacyFilter(data, viewerRole, viewerId)),
        );
    }

    private applyPrivacyFilter(data: any, viewerRole: string, viewerId: string): any {
        if (!data) return data;

        // Handle arrays
        if (Array.isArray(data)) {
            return data.map(item => this.applyPrivacyFilter(item, viewerRole, viewerId));
        }

        // Handle objects with user data
        if (typeof data === 'object') {
            // Check if this is a User object
            if (data.privacy_level && data.id) {
                return this.filterUserData(data, viewerRole, viewerId);
            }

            // Recursively filter nested objects
            const filtered = { ...data };
            for (const key of Object.keys(filtered)) {
                if (typeof filtered[key] === 'object' && filtered[key] !== null) {
                    filtered[key] = this.applyPrivacyFilter(filtered[key], viewerRole, viewerId);
                }
            }
            return filtered;
        }

        return data;
    }

    private filterUserData(user: Partial<User>, viewerRole: string, viewerId: string): Partial<User> & { alias?: string } {
        // Owner and admins see full data
        if (user.id === viewerId || viewerRole === 'admin') {
            return user;
        }

        const privacyLevel = user.privacy_level || PrivacyLevel.ALIAS;
        const userId = user.id || 'anonymous';

        switch (privacyLevel) {
            case PrivacyLevel.PUBLIC:
                // Return all data except password
                const { password_hash, ...publicData } = user as any;
                return publicData;

            case PrivacyLevel.ALIAS:
                return {
                    id: user.id,
                    alias: this.generateAlias(userId),
                    role: user.role,
                    reputation_base: user.reputation_base,
                    skills: user.skills,
                    languages: user.languages,
                    // Hidden: email, full_name, phone, location, wallet_address
                };

            case PrivacyLevel.MEDIATED:
                return {
                    id: user.id,
                    alias: this.generateAlias(userId),
                    role: user.role,
                    reputation_base: user.reputation_base,
                    // Only approximate location (city level)
                    location_zone_id: user.location_zone_id,
                    // Hidden: everything else
                };

            case PrivacyLevel.GHOST:
                return {
                    id: user.id,
                    // Literally nothing else visible
                };

            default:
                return this.filterUserData({ ...user, privacy_level: PrivacyLevel.ALIAS }, viewerRole, viewerId);
        }
    }

    /**
     * Generate a consistent alias from user ID
     * Same ID always produces same alias
     */
    private generateAlias(userId: string): string {
        const hash = crypto.createHash('md5').update(userId).digest('hex');
        const adjectives = ['Swift', 'Clever', 'Bold', 'Kind', 'Wise', 'Fair', 'Calm', 'Brave'];
        const nouns = ['Falcon', 'Lion', 'Eagle', 'Wolf', 'Bear', 'Fox', 'Hawk', 'Tiger'];

        const adjIndex = parseInt(hash.substring(0, 4), 16) % adjectives.length;
        const nounIndex = parseInt(hash.substring(4, 8), 16) % nouns.length;
        const number = parseInt(hash.substring(8, 12), 16) % 1000;

        return `${adjectives[adjIndex]}${nouns[nounIndex]}${number}`;
    }
}

/**
 * Decorator to skip privacy filtering on specific endpoints
 */
export const SkipPrivacyFilter = () => {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        Reflect.defineMetadata('skipPrivacyFilter', true, descriptor.value);
        return descriptor;
    };
};
