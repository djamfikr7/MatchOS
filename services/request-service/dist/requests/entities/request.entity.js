"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.TemporalType = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["OPEN"] = "open";
    RequestStatus["MATCHED"] = "matched";
    RequestStatus["IN_PROGRESS"] = "in_progress";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["CANCELLED"] = "cancelled";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var TemporalType;
(function (TemporalType) {
    TemporalType["FLEXIBLE"] = "flexible";
    TemporalType["SCHEDULED"] = "scheduled";
    TemporalType["URGENT"] = "urgent";
    TemporalType["EMERGENCY"] = "emergency";
})(TemporalType || (exports.TemporalType = TemporalType = {}));
let Request = class Request {
    id;
    user_id;
    category_id;
    title;
    description;
    temporal_type;
    deadline;
    penalty_rate;
    location;
    broadcast_radius_km;
    privacy_zone;
    budget_min;
    budget_max;
    currency;
    status;
    campaign_status;
    dynamic_data;
    created_at;
    updated_at;
};
exports.Request = Request;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Request.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Request.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Request.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Request.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Request.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TemporalType,
        default: TemporalType.FLEXIBLE,
    }),
    __metadata("design:type", String)
], Request.prototype, "temporal_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Request.prototype, "deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], Request.prototype, "penalty_rate", void 0);
__decorate([
    (0, typeorm_1.Index)({ spatial: true }),
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Request.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 10 }),
    __metadata("design:type", Number)
], Request.prototype, "broadcast_radius_km", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Request.prototype, "privacy_zone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "budget_min", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Request.prototype, "budget_max", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'DZD' }),
    __metadata("design:type", String)
], Request.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: RequestStatus,
        default: RequestStatus.OPEN,
    }),
    __metadata("design:type", String)
], Request.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Request.prototype, "campaign_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Request.prototype, "dynamic_data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Request.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Request.prototype, "updated_at", void 0);
exports.Request = Request = __decorate([
    (0, typeorm_1.Entity)('requests')
], Request);
//# sourceMappingURL=request.entity.js.map