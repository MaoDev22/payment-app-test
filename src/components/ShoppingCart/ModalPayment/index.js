import './styles.scss';

import { usePaymentForm } from 'hooks/usePaymentForm';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { createTransaction } from 'services/transactionService'
import { clearStoreProducts } from 'store';

import Visa from './assets/Visa.svg';
import MasterCard from './assets/MasterCard.svg';
import DefaultCard from './assets/Default.svg';
import Close from './assets/Close.svg';

function ModalPayment({ openModal, setOpenModal, total, baseRate, deliveryRate }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products);
  const {
    cardNumber,
    cardType,
    cvv,
    expiryDate,
    isFormValid,
    deliveryAddress,
    handleCardNumberChange,
    handleCvvChange,
    handleExpiryDateChange,
    getCurrentMonthYear,
    handleDeliveryAddressChange
  } = usePaymentForm();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    
    try {
      setLoading(true);
      const [year, month] = expiryDate.split('-');
      const expYear = year.slice(-2);
      const productsMapped = products.map((item) => ({...item, quantity: 1}));

      await createTransaction({
        cvv,
        card_number: cardNumber.replaceAll(' ', ''),
        exp_month: month,
        exp_year: expYear,
        amount_in_cents: parseInt(total),
        currency: "COP",
        products: productsMapped
      });

      await dispatch(clearStoreProducts());

      toast.success("Su solicitud ha sido recibida exitosamente. Estamos procesando su pago y le informaremos en breve sobre el estado de la transacción.", {
        autoClose: false,
      });

      navigate('/');
    } catch (error) {
      toast.error(error.message, {
        autoClose: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    openModal && (
      <div id="generalContainerModal">

        <form onSubmit={handleSubmit}>
          <h3>Digite los datos de su tarjeta</h3>

          <div id="resumePayment">
              <div><strong>Monto total:</strong> ${total}</div>
              <div><strong>Tarifa base:</strong> ${baseRate}</div>
              <div><strong>Tarifa entrega:</strong> ${deliveryRate}</div>
          </div>
          
          <span onClick={() => setOpenModal(false)}>
            <img src={Close} />
          </span>

          <div className="formControl">
            <label htmlFor="numberCard">Número de tarjeta:</label>
            <input
              id="numberCard"
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength="19"
              placeholder="4242 4242 4242 4242"
              required
            />
            <img
              src={
                cardType === 'Visa'
                  ? Visa
                  : cardType === 'MasterCard'
                  ? MasterCard
                  : DefaultCard
              }
              alt={cardType}
            />
          </div>

          <div className="formControl">
            <label htmlFor="expirationDate">Fecha de expiración:</label>
            <input
              id="expirationDate"
              type="month"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              min={getCurrentMonthYear()}
              required
            />
          </div>

          <div className="formControl">
            <label htmlFor="cvv">CVV:</label>
            <input
              id="cvv"
              type="text"
              value={cvv}
              onChange={handleCvvChange}
              maxLength={cardType === 'Amex' ? 4 : 3}
              placeholder="789"
              required
            />
          </div>

          <div className="formControl">
            <label htmlFor="deliveryAddress">Dirección de entrega:</label>
            <input
              id="deliveryAddress"
              type="text"
              value={deliveryAddress}
              onChange={handleDeliveryAddressChange}
              minLength={5}
              maxLength={50}
              placeholder="1234 Elm Street, Springfield, IL 62704"
              required
            />
          </div>

          <button type="submit" data-testid="payment-button" disabled={!isFormValid || loading}>
            {loading ? 'Creando transferencia...' : 'Crear transferencia' }
          </button>
        </form>
      </div>
    )
  );
}

export default ModalPayment;
