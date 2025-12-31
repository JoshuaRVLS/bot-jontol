export const formatRupiah = (num: number, withPrefix: boolean = true): string => {
    const prefix = withPrefix ? "Rp " : "";
    const absNum = Math.abs(num);
    const sign = num < 0 ? "-" : "";

    if (absNum >= 1_000_000_000_000) {
        return `${sign}${prefix}${(absNum / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "")}T`;
    }
    if (absNum >= 1_000_000_000) {
        return `${sign}${prefix}${(absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (absNum >= 1_000_000) {
        return `${sign}${prefix}${(absNum / 1_000_000).toFixed(1).replace(/\.0$/, "")}JT`;
    }
    if (absNum >= 1_000) {
        return `${sign}${prefix}${(absNum / 1_000).toFixed(1).replace(/\.0$/, "")}RB`;
    }
    return `${sign}${prefix}${absNum.toLocaleString("id-ID")}`;
};

export const formatNumber = (num: number): string => {
    const absNum = Math.abs(num);
    const sign = num < 0 ? "-" : "";

    if (absNum >= 1_000_000_000_000) {
        return `${sign}${(absNum / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "")}T`;
    }
    if (absNum >= 1_000_000_000) {
        return `${sign}${(absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (absNum >= 1_000_000) {
        return `${sign}${(absNum / 1_000_000).toFixed(1).replace(/\.0$/, "")}JT`;
    }
    if (absNum >= 1_000) {
        return `${sign}${(absNum / 1_000).toFixed(1).replace(/\.0$/, "")}RB`;
    }
    return `${sign}${absNum.toLocaleString("id-ID")}`;
};

export const formatFullRupiah = (num: number): string => {
    return `Rp ${num.toLocaleString("id-ID")}`;
};
