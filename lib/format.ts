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

export const parseBet = (input: string): number => {
    const cleanInput = input.toLowerCase().replace(/,/g, ".").replace(/[^0-9.rbjmtk]/g, "");
    if (!cleanInput) return 0;

    let multiplier = 1;
    let numericPart = cleanInput;

    if (cleanInput.endsWith("rb") || cleanInput.endsWith("k")) {
        multiplier = 1_000;
        numericPart = cleanInput.slice(0, -2);
        if (cleanInput.endsWith("k")) numericPart = cleanInput.slice(0, -1);
    } else if (cleanInput.endsWith("jt")) {
        multiplier = 1_000_000;
        numericPart = cleanInput.slice(0, -2);
    } else if (cleanInput.endsWith("m")) {
        multiplier = 1_000_000_000;
        numericPart = cleanInput.slice(0, -1);
    } else if (cleanInput.endsWith("t")) {
        multiplier = 1_000_000_000_000;
        numericPart = cleanInput.slice(0, -1);
    }

    const val = parseFloat(numericPart);
    return isNaN(val) ? 0 : Math.floor(val * multiplier);
};
