export function formatDateToDDMMYYYY(dateString: string | undefined): string {
    if (!dateString) return ''; // Handling empty or undefined input
  
    const dateObject = new Date(dateString);
  
    if (isNaN(dateObject.getTime())) {
      return ''; // Return an empty string if the date parsing fails
    }
  
    const day: number = dateObject.getDate();
    const month: number = dateObject.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year: number = dateObject.getFullYear();
  
    // Adding zero padding if needed for single-digit day or month
    const formattedDay: string = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth: string = month < 10 ? `0${month}` : `${month}`;
  
    const formattedDate: string = `${formattedDay}/${formattedMonth}/${year}`;
  
    return formattedDate;
  }
  
 