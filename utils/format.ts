export const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export const formatCompactRupiah = (amount: number): string => {
    if (amount < 1000) return `Rp${amount}`;

    if (amount >= 1000000000000) {
        return `Rp${(amount / 1000000000000).toFixed(1).replace(/\.0$/, "")}t`;
    }
    if (amount >= 1000000000) {
        return `Rp${(amount / 1000000000).toFixed(1).replace(/\.0$/, "")}m`;
    }
    if (amount >= 1000000) {
        return `Rp${(amount / 1000000).toFixed(1).replace(/\.0$/, "")}jt`;
    }
    if (amount >= 1000) {
        return `Rp${(amount / 1000).toFixed(1).replace(/\.0$/, "")}rb`;
    }

    return formatRupiah(amount);
};
