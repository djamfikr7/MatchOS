"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const user_entity_1 = require("../../users/entities/user.entity");
let PrivacyInterceptor = class PrivacyInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)(data => {
            if (Array.isArray(data)) {
                return data.map(item => this.sanitize(item));
            }
            return this.sanitize(data);
        }));
    }
    sanitize(data) {
        if (!data || typeof data !== 'object')
            return data;
        if ('privacy_level' in data) {
            const level = data.privacy_level;
            if (level === user_entity_1.PrivacyLevel.PUBLIC) {
                return data;
            }
            if (level === user_entity_1.PrivacyLevel.ALIAS) {
                return {
                    ...data,
                    email: '***@***.com',
                    phone: '******',
                    full_name: data.full_name ? data.full_name.split(' ')[0] + '...' : 'Alias',
                    location: null,
                    wallet_address: data.wallet_address ? data.wallet_address.substring(0, 6) + '...' : null,
                };
            }
            if (level === user_entity_1.PrivacyLevel.MEDIATED) {
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
            if (level === user_entity_1.PrivacyLevel.GHOST) {
                return {
                    id: data.id,
                    role: data.role,
                    privacy_level: data.privacy_level,
                    full_name: 'Ghost User',
                    email: null,
                    phone: null,
                    location: null,
                    skills: [],
                    reputation_base: null,
                };
            }
        }
        return data;
    }
};
exports.PrivacyInterceptor = PrivacyInterceptor;
exports.PrivacyInterceptor = PrivacyInterceptor = __decorate([
    (0, common_1.Injectable)()
], PrivacyInterceptor);
//# sourceMappingURL=privacy.interceptor.js.map