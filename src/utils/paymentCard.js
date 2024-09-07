export function getCardType(number) {
    const sanitizedNumber = number.replace(/\D/g, '');
    const visaPattern = /^4[0-9]{12}(?:[0-9]{3})?$/; 
    const masterCardPattern = /^5[1-5][0-9]{14}$/;
  
    if (visaPattern.test(sanitizedNumber)) {
      return 'Visa';
    } else if (masterCardPattern.test(sanitizedNumber)) {
      return 'MasterCard';
    } else {
      return 'Unknown';
    }
}
  
export function formatCardNumber(value) {
    let input = value.replace(/\D/g, '').substring(0, 16);
    return input.match(/.{1,4}/g)?.join(' ') || '';
} 