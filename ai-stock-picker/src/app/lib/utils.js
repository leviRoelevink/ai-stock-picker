function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function dateNDaysBefore(date, n) {
    return new Date(date.setDate(date.getDate() - n));
}

export function getFromToDates(endDate, timespan) {
    const date = new Date(endDate);
    const formattedEndDate = formatDate(date);
    const startDate = dateNDaysBefore(date, timespan);
    const formattedStartDate = formatDate(startDate);
    return [formattedStartDate, formattedEndDate];
}
