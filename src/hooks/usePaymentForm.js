import { useState, useEffect } from 'react';
import { getCardType, formatCardNumber } from 'utils/paymentCard';

export function usePaymentForm() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('Unknown');
  const [cvv, setCvv] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleCardNumberChange = (e) => {
    const formattedNumber = formatCardNumber(e.target.value);
    setCardNumber(formattedNumber);

    const type = getCardType(e.target.value);
    setCardType(type);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, '');
    const maxLength = cardType === 'Amex' ? 4 : 3;
    setCvv(numericValue.substring(0, maxLength));
  };

  const handleExpiryDateChange = (e) => {
    setExpiryDate(e.target.value);
  };

  const handleDeliveryAddressChange = (e) => {
    setDeliveryAddress(e.target.value);
  };

  const getCurrentMonthYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  useEffect(() => {
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
    const isCvvValid = cvv?.length && (cardType === 'Amex' ? cvv.length === 4 : cvv.length === 3);
    const isExpiryDateValid = expiryDate.length > 0 && expiryDate && expiryDate >= getCurrentMonthYear();

    setIsFormValid(isCardNumberValid && isCvvValid && isExpiryDateValid && deliveryAddress.length > 5);
  }, [cardNumber, cvv, expiryDate, cardType, deliveryAddress]);

  return {
    cardNumber,
    cardType,
    cvv,
    expiryDate,
    deliveryAddress,
    isFormValid,
    handleCardNumberChange,
    handleCvvChange,
    handleExpiryDateChange,
    getCurrentMonthYear,
    handleDeliveryAddressChange
  };
}
