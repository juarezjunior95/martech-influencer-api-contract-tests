"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDateUtc = parseDateUtc;
function parseDateUtc(refresh) {
    const ddMmYyyy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(refresh);
    if (ddMmYyyy) {
        const day = Number(ddMmYyyy[1]);
        const month = Number(ddMmYyyy[2]);
        const year = Number(ddMmYyyy[3]);
        const utcMs = Date.UTC(year, month - 1, day);
        const cal = new Date(utcMs);
        if (cal.getUTCFullYear() !== year ||
            cal.getUTCMonth() !== month - 1 ||
            cal.getUTCDate() !== day) {
            return null;
        }
        return cal;
    }
    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(refresh);
    if (iso) {
        const year = Number(iso[1]);
        const month = Number(iso[2]);
        const day = Number(iso[3]);
        const utcMs = Date.UTC(year, month - 1, day);
        return new Date(utcMs);
    }
    return null;
}
//# sourceMappingURL=date-utils.js.map