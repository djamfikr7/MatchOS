import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrivacyLevel } from '../../users/entities/user.entity';

@Injectable()
export class PrivacyInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(data => {
                if (Array.isArray(data)) {
                    return data.map(item => this.sanitize(item));
                }
                return this.sanitize(data);
            }),
        );
    }

    private sanitize(data: any): any {
        if (!data || typeof data !== 'object') return data;

        // Check if object has privacy_level property
        if ('privacy_level' in data) {
            const level = data.privacy_level;

            // Public: No sanitization needed (unless specific fields are always private)
            if (level === PrivacyLevel.PUBLIC) {
                return data;
            }

            // Alias: Hide contact info, fuzz location
            if (level === PrivacyLevel.ALIAS) {
                return {
                    ...data,
                    email: '***@***.com',
                    phone: '******',
                    full_name: data.full_name ? data.full_name.split(' ')[0] + '...' : 'Alias', // Show first name only or alias
                    location: null, // TODO: Implement fuzzing
                    wallet_address: data.wallet_address ? data.wallet_address.substring(0, 6) + '...' : null,
                };
            }

            // Mediated: Hide identity completely, only show reputation/skills
            if (level === PrivacyLevel.MEDIATED) {
                return {
                    id: data.id,
                    role: data.role,
                    privacy_level: data.privacy_level,
                    reputation_base: data.reputation_base,
                    skills: data.skills,
                    languages: data.languages,
                    timezone: data.timezone,
                    full_name: 'Mediated User',
                    email: null,
                    phone: null,
                    location: null,
                    wallet_address: null,
                };
            }

            // Ghost: Minimal info
            if (level === PrivacyLevel.GHOST) {
                return {
                    id: data.id,
                    role: data.role,
                    privacy_level: data.privacy_level,
                    full_name: 'Ghost User',
                    email: null,
                    phone: null,
                    location: null,
                    skills: [],
                    reputation_base: null, // Hide reputation in ghost mode? Or show it? Specs say "Ghost" is invisible.
                };
            }
        }

        return data;
    }
}
