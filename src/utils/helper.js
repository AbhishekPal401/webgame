import { dateFormats } from "../constants/date";
import DOMPurify from 'dompurify';


// export const formatTime = (value) => {
//   if (!value || value.trim() === "") {
//     return "Invalid Time";
//   }
//   console.log(" Time incoing : ",value)
//   if (value >= 60) {
//     const hours = Math.floor(value / 60);
//     const minutes = value % 60;
//     if (minutes === 0) {
//       return `${hours}hr`;
//     } else {
//       return `${hours}.${minutes}hr`;
//     }
//   } else {
//     return `${value}min`;
//   }
// };

export const formatTime = (value) => {
  if (!value || value.trim() === "") {
    return "Invalid Time";
  }
  console.log("Value : ",value)
  const seconds = parseInt(value);
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = remainingSeconds / 60;

  // if (hours > 0) {
  //   if (minutes === 0) {
  //     return `${hours} hr`;
  //   } else {
  //     // Calculate total hours with decimal precision
  //     const totalHours = hours + (minutes / 60);

  //     // Round to two decimal places
  //     const formattedHours = totalHours.toFixed(2);
  //     return `${formattedHours} hr`;
  //   }
  // } else {
  //   return `${minutes.toFixed(2)} min`;
  // }

   // Check if there are decimals in minutes
   const hasDecimals = minutes % 1 !== 0;

   if (hours > 0) {
     if (minutes === 0) {
       return `${hours} hr`;
     } else {
       // Calculate total hours with decimal precision
       const totalHours = hours + (minutes / 60);
 
       // Round to two decimal places if there are decimals, else just convert to integer
       const formattedHours = hasDecimals ? totalHours.toFixed(2) : totalHours.toFixed(0);
       return `${formattedHours} hr`;
     }
   } else {
     // Round to two decimal places if there are decimals, else just convert to integer
     const formattedMinutes = hasDecimals ? minutes.toFixed(2) : minutes.toFixed(0);
     return `${formattedMinutes} min`;
   }
};


export const formatDateString = (dateTimeString, formatType = "default") => {

  const formats = [
    {
      format: dateFormats.DATE_FORMAT_3,
      regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})$/,
    },
    {
      format: dateFormats.DATE_FORMAT_5,
      regex:
        /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/,
    },
    {
      format: dateFormats.DATE_FORMAT_10,
      regex:
        /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/,
    },
    {
      format: dateFormats.DATE_FORMAT_1,
      regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    },
    {
      format: dateFormats.DATE_FORMAT_2,
      regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    },
    {
      format: dateFormats.DATE_FORMAT_11,
      regex:
        /^([a-zA-Z]{3})\s+(\d{1,2})\s+(\d{4})\s+(\d{1,2}):(\d{2})([APMapm]{2})$/,
    },
    {
      format: dateFormats.DATE_FORMAT_13,
      regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/,
    },
    {
      format: dateFormats.DATE_FORMAT_12,
      regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/,
    },
  ];

  // const formats = [
  //   {
  //     format: dateFormats.DATE_FORMAT_0,
  //     regex: /^(\d{1,2}) ([a-zA-Z]{3}) (\d{4})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_1,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_2,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_3,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_4,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_5,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_6,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_7,
  //     regex: /^(\d{1,2}) ([a-zA-Z]{3}) (\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_8,
  //     regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_9,
  //     regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_10,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2}) (AM|PM)$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_11,
  //     regex: /^([a-zA-Z]{3}) (\d{1,2}) (\d{4}) (\d{1,2}):(\d{2})([APMapm]{2})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_13,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/,
  //   },
  //   {
  //     format: dateFormats.DATE_FORMAT_12,
  //     regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{2}):(\d{2})$/,
  //   },
  // ];


  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let formattedMonth;
  let parsedDate;
  let timeString;

  if (!dateTimeString || dateTimeString.trim() === "") {
    return "Invalid Date";
  }

  for (const dateFormat of formats) {
    const matches = dateTimeString.match(dateFormat.regex);
    if (matches) {
      parsedDate = createDateFromMatches(matches, dateFormat.format);
      // console.log("parsedDate :",parsedDate);
      break;
    }
  }

  if (!parsedDate) {
    return "Invalid Date";
  }

  switch (formatType) {
    case dateFormats.DATE_FORMAT_8:
      return `${parsedDate.getDate()}-${parsedDate.getMonth() + 1
        }-${parsedDate.getFullYear()}`;

    case dateFormats.DATE_FORMAT_1:
      return `${parsedDate.getDate()}/${parsedDate.getMonth() + 1
        }/${parsedDate.getFullYear()}`;

    case dateFormats.DATE_FORMAT_9:
      return `${parsedDate.getMonth() + 1
        }-${parsedDate.getDate()}-${parsedDate.getFullYear()}`;

    case dateFormats.DATE_FORMAT_2:
      return `${parsedDate.getMonth() + 1
        }/${parsedDate.getDate()}/${parsedDate.getFullYear()}`;

    case dateFormats.DATE_FORMAT_7:
      formattedMonth = months[parsedDate.getMonth()];
      timeString = parsedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      console.log("toLocaleTimeString :", timeString);
      return `${parsedDate.getDate()} 
                    ${formattedMonth} 
                    ${parsedDate.getFullYear()} 
                    ${timeString}
                    `;

    case "default":
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
    const [, ...parsedMatches] = matches.map((match) => parseInt(match, 10));

    const formatParts = format.split(/\W+/); // Split format by non-word characters

    const yearIndex = formatParts.findIndex((part) => part === "YYYY");
    const monthIndex = formatParts.findIndex(
      (part) => part === "MM" || part === "M"
    );
    const dayIndex = formatParts.findIndex(
      (part) => part === "DD" || part === "D"
    );

    const hourIndex = formatParts.findIndex(
      (part) => part === "hh" || part === "h" || part === "HH" || part === "H"
    );
    const minuteIndex = formatParts.findIndex(
      (part) => part === "mm" || part === "m"
    );
    const secondIndex = formatParts.findIndex(
      (part) => part === "ss" || part === "s"
    );
    const meridiemIndex = formatParts.findIndex(
      (part) => part === "A" || part === "a"
    );

    const year = yearIndex !== -1 ? parsedMatches[yearIndex] : 0;
    const month = monthIndex !== -1 ? parsedMatches[monthIndex] - 1 : 0;
    const day = dayIndex !== -1 ? parsedMatches[dayIndex] : 1;

    let hour = hourIndex !== -1 ? parsedMatches[hourIndex] : 0;
    const minute = minuteIndex !== -1 ? parsedMatches[minuteIndex] : 0;
    const second = secondIndex !== -1 ? parsedMatches[secondIndex] : 0;

    // Adjust hour for AM/PM format if available
    if (meridiemIndex !== -1) {
      const meridiem = matches[meridiemIndex + 1]; // Check the match at meridiemIndex + 1
      if ((meridiem === "PM" || meridiem === "pm") && hour < 12) {
        hour += 12;
      } else if ((meridiem === "AM" || meridiem === "am") && hour === 12) {
        hour = 0;
      }
    }

    const date = new Date(year, month, day, hour, minute, second);
    // console.log("date formated :",date);
    return date;
  } catch (error) {
    console.log("date formated error:", error);
    return null;
  }
};

// extract mimeType from file source
// export const extractFileType = (fileSrc) => {
//     // // Split the fileSrc by commas to separate the data and the MIME type
//     // const splitFileSrc = fileSrc.split(',');

//     // // The MIME type is present after the 'data:' prefix before the first semicolon
//     // const mimeType = splitFileSrc[0].split(':')[1].split(';')[0];

//     // Find the index of the first semicolon after 'data:'
//     const semicolonIndex = fileSrc.indexOf(';');

//     // Extract the substring starting from 'data:' up to the first semicolon
//     const mimeType = fileSrc.substring(5, semicolonIndex);

//     return mimeType;
// }

export const extractFileType = (fileSrc) => {
  if (fileSrc.startsWith("data:")) {
    // For data URL
    const semicolonIndex = fileSrc.indexOf(";");
    const mimeType = fileSrc.substring(5, semicolonIndex);

    // console.log("fileExtension :", mimeType)
    return mimeType;
  } else if (fileSrc.startsWith("https")) {
    // For URLs starting with 'https'
    const urlParts = fileSrc.split("/");
    const filename = urlParts[urlParts.length - 1];
    const queryParamIndex = filename.indexOf("?");
    const filenameToParse =
      queryParamIndex !== -1
        ? filename.substring(0, queryParamIndex)
        : filename;
    const dotIndex = filenameToParse.lastIndexOf(".");
    if (dotIndex !== -1) {
      const fileExtension = filenameToParse.substring(dotIndex + 1);
      // Return the file extension directly
      // console.log("fileExtension :", fileExtension)
      return fileExtension;
    }
    return "unknown"; // Return 'unknown' if no extension found
  } else {
    return "unknown"; // Handle other cases or return a default type if needed
  }
};

export const extractFileInfo = (fileSrc) => {
  if (fileSrc.startsWith("data:")) {
    // For data URL
    const semicolonIndex = fileSrc.indexOf(";");
    const mimeType = fileSrc.substring(5, semicolonIndex);

    return { type: mimeType, name: null, size: "unknown" };
  } else if (fileSrc.startsWith("https")) {
    // For URLs starting with 'https'
    const urlParts = fileSrc.split("/");
    const filename = urlParts[urlParts.length - 1];
    const queryParamIndex = filename.indexOf("?");
    const filenameToParse =
      queryParamIndex !== -1
        ? filename.substring(0, queryParamIndex)
        : filename;
    const dotIndex = filenameToParse.lastIndexOf(".");

    if (dotIndex !== -1) {
      const fileExtension = filenameToParse.substring(dotIndex + 1);
      // const fileSizeIndex = filename.indexOf('_'); // Assuming size is included in the filename with underscore
      // const fileSize = fileSizeIndex !== -1 ? filename.substring(fileSizeIndex + 1, dotIndex) : 'unknown';
      console.log("filenameToParse", filenameToParse);
      return { type: fileExtension, name: filenameToParse };
    } else {
      return { type: "unknown", name: filenameToParse };
    }
  } else {
    return { type: "unknown", name: "unknown" };
  }
};


export const renderFirstLine = (htmlString) => {
  // Create a temporary element to parse the HTML string
  const tempElement = document.createElement('div');
  tempElement.innerHTML = htmlString;

  // Get the text content of the first child element
  const firstLine = tempElement.firstChild?.textContent || '';

  console.log(" firstline : ", firstLine)
  // Return the first line of text
  return firstLine.trim();
};

export const extractTextContent = (html) => {
  if (!html) return '';

  const sanitizedHTML = DOMPurify.sanitize(html);
  const tempElement = document.createElement('div');
  tempElement.innerHTML = sanitizedHTML;

  // Get the first child node that is not a text node
  let firstChild = tempElement.firstChild;
  while (firstChild && firstChild.nodeType === 3) { // 3: Text node
    firstChild = firstChild.nextSibling;
  }
  // console.log("first child :",firstChild)
  // Extract content based on the element type
  if (firstChild) {
    switch (firstChild.tagName.toLowerCase()) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'p':
      case 'div':
      case 'span':
        return firstChild.innerText;
      case 'ul':
      case 'ol':
        // Get the first list item's text content
        const firstListItem = firstChild.querySelector('li');
        return firstListItem ? firstListItem.innerText : '';
      case 'table':
        // Get the first table cell's text content
        const firstTableCell = firstChild.querySelector('td, th');
        return firstTableCell ? firstTableCell.innerText : '';
      default:
        return '';
    }
  }
  return '';
};

export const extractFirstElementHTML = (html) => {
  // if (!html) return '';
  if (!html || typeof html !== 'string') return html;


  const sanitizedHTML = DOMPurify.sanitize(html);
  const tempElement = document.createElement('div');
  tempElement.innerHTML = sanitizedHTML;

  // Get the first child node that is not a text node
  let firstChild = tempElement.firstChild;
  while (firstChild && firstChild.nodeType === 3) { // 3: Text node
    firstChild = firstChild.nextSibling;
  }

  // Extract HTML content of the first element
  if (firstChild) {
    // return firstChild.outerHTML; /// return formatted text
    return firstChild.textContent; // return plain text
  }
  return '';
};

// export const extractFirstElementHTML = (html) => {
//   if (!html || typeof html !== 'string') return html;

//   const sanitizedHTML = DOMPurify.sanitize(html);
//   const tempElement = document.createElement('div');
//   tempElement.innerHTML = sanitizedHTML;

//   // Get the first child node that is not a text node
//   let firstChild = tempElement.firstChild;
//   while (firstChild && firstChild.nodeType === 3) { // 3: Text node
//     firstChild = firstChild.nextSibling;
//   }

//   console.log("Firstchild :",firstChild)

//   // Extract HTML content of the first element
//   if (firstChild) {
//     const firstElementHTML = firstChild.outerHTML;
//     const closingTagIndex = firstElementHTML.lastIndexOf('</');
//     const ellipsisAppendedHTML = firstElementHTML.substring(0, closingTagIndex) + '...' + firstElementHTML.substring(closingTagIndex);
//     return ellipsisAppendedHTML;

//     // const firstElementHTML = firstChild.outerHTML;
//     // if (firstElementHTML.includes('<li>')) {
//     //   const openingLiTagIndex = firstElementHTML.indexOf('<li>');
//     //   const closingLiTagIndex = firstElementHTML.indexOf('</li>', openingLiTagIndex);
//     //   const ellipsisAppendedHTML = firstElementHTML.substring(0, closingLiTagIndex) + '...' + firstElementHTML.substring(closingLiTagIndex);
//     //   console.log("ellipsisAppendedHTML :",ellipsisAppendedHTML)

//     //   return ellipsisAppendedHTML;
//     // } else {
//     //   const closingTagIndex = firstElementHTML.lastIndexOf('</');
//     //   const ellipsisAppendedHTML = firstElementHTML.substring(0, closingTagIndex) + '...' + firstElementHTML.substring(closingTagIndex);
//     //   return ellipsisAppendedHTML;
//     // }
//   }
//   return '';
// };

