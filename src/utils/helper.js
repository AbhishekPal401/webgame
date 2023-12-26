import { dateFormats } from "../constants/date";

export const formatDateString = (dateTimeString, formatType = 'default') => {
    const formats = [
        { 
            format: dateFormats.DATE_FORMAT_3,
            regex: /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/ 
        },
        { 
            format: dateFormats.DATE_FORMAT_5, 
            regex: /^(\d{2})\/(\d{2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/ 
        }, 
        { 
            format: dateFormats.DATE_FORMAT_1, 
            regex: /^(\d{2})\/(\d{2})\/(\d{4})$/ 
        }, 
        { 
            format: dateFormats.DATE_FORMAT_2, 
            regex: /^(\d{2})\/(\d{2})\/(\d{4})$/ 
        },
    ];

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    let formattedMonth;
    let parsedDate;
    let timeString;

    for (const dateFormat of formats) {
        const matches = dateTimeString.match(dateFormat.regex);
        if (matches) {
            parsedDate = createDateFromMatches(matches, dateFormat.format);
            break;
        }
    }

    if (!parsedDate) {
        return 'Invalid Date';
    }

    switch (formatType) {
        case dateFormats.DATE_FORMAT_8:
            return `${parsedDate.getDate()}-${parsedDate.getMonth() + 1}-${parsedDate.getFullYear()}`;

        case dateFormats.DATE_FORMAT_1:
            return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;

        case dateFormats.DATE_FORMAT_9:
            return `${parsedDate.getMonth() + 1}-${parsedDate.getDate()}-${parsedDate.getFullYear()}`;

        case dateFormats.DATE_FORMAT_2:
            return `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;

        case dateFormats.DATE_FORMAT_7:
            formattedMonth = months[parsedDate.getMonth()];
            timeString = parsedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            console.log("toLocaleTimeString :", timeString);
            return `${parsedDate.getDate()} 
                    ${formattedMonth} 
                    ${parsedDate.getFullYear()} 
                    ${timeString}
                    `;

        case 'default':
        default:
            formattedMonth = months[parsedDate.getMonth()];
            return `${parsedDate.getDate()} 
                    ${formattedMonth} 
                    ${parsedDate.getFullYear()} 
                    `;
    }
};

const createDateFromMatches = (matches, format) => {
    try {
        const [, ...parsedMatches] = matches.map(match => parseInt(match, 10));

        const formatParts = format.split(/\W+/); // Split format by non-word characters

        const yearIndex = formatParts.findIndex(part => part === 'YYYY');
        const monthIndex = formatParts.findIndex(part => part === 'MM' || part === 'M');
        const dayIndex = formatParts.findIndex(part => part === 'DD' || part === 'D');

        const hourIndex = formatParts.findIndex(part => part === 'hh' || part === 'h' || part === 'HH' || part === 'H');
        const minuteIndex = formatParts.findIndex(part => part === 'mm' || part === 'm');
        const secondIndex = formatParts.findIndex(part => part === 'ss' || part === 's');
        const meridiemIndex = formatParts.findIndex(part => part === 'A' || part === 'a');

        const year = yearIndex !== -1 ? parsedMatches[yearIndex] : 0;
        const month = monthIndex !== -1 ? parsedMatches[monthIndex] - 1 : 0;
        const day = dayIndex !== -1 ? parsedMatches[dayIndex] : 1;

        let hour = hourIndex !== -1 ? parsedMatches[hourIndex] : 0;
        const minute = minuteIndex !== -1 ? parsedMatches[minuteIndex] : 0;
        const second = secondIndex !== -1 ? parsedMatches[secondIndex] : 0;

        // Adjust hour for AM/PM format if available
        if (meridiemIndex !== -1) {
            const meridiem = matches[meridiemIndex + 1]; // Check the match at meridiemIndex + 1
            if ((meridiem === 'PM' || meridiem === 'pm') && hour < 12) {
                hour += 12;
            } else if ((meridiem === 'AM' || meridiem === 'am') && hour === 12) {
                hour = 0;
            }
        }

        const date = new Date(year, month, day, hour, minute, second);

        return date;

    } catch (error) {
        return null;
    }
};