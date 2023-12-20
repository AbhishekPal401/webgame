// export const getDateOrTime = (dateTimeString, wantTime = false) => {
//     const [date, time] = dateTimeString.split(' ');
//     return wantTime ? (time ? time : '') : (date ? date.slice(1) : '');
// };
// utils.js

// utils.js

export const formatDateString = (dateTimeString, formatType = 'default') => {
    const [datePart, timePart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('/');

    switch (formatType) {
        case 'DD-MM-YYYY':
            return `${day}-${month}-${year}`;
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'timeOnly':
            return timePart || ''; // Return time if available, otherwise an empty string
        case 'default':
        default:
            const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ];
            const formattedMonth = months[parseInt(month, 10) - 1];
            return `${parseInt(day, 10)} ${formattedMonth} ${year}`;
    }
};
