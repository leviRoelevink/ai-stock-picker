function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function dateNDaysLater(date, n) {
    return new Date(date.setDate(date.getDate() + n));
}

export function getFromToDates(startDate, timespan) {
    const date = new Date(startDate);
    const formattedStartDate = formatDate(date);
    const endDate = dateNDaysLater(date, timespan);
    const formattedEndDate = formatDate(endDate);
    return [formattedStartDate, formattedEndDate];
}
