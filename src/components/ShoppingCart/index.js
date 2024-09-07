import './styles.scss'
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { deleteProduct } from 'store';
import { validateToken } from 'services/authService';
import ModalPayment from './ModalPayment';

import GarbashIcon from './assets/garbash.svg';

const messageSession = "Debes inciar sesión";

function ShopingCart() {
    const products = useSelector((state) => state.products);
    const token = useSelector((state) => state.token);
    const [total, setTotal] = useState(0);
    const [baseRate, setBaseRate] = useState(5);
    const [deliveryRate, setDeliveryRate] = useState(5);
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePayment = () => {
        if(token) {
            (async () => {
                try {
                    await validateToken();
                    setOpenModal(true);
                } catch (e) {
                    toast.error(messageSession);
                    navigate('/login?redirectPayment=shoping-cart');
                }
            })()
        } else {
            toast.error(messageSession);
            navigate('/login?redirectPayment=shoping-cart');
        }
    }

    useEffect(() => {
        const totalPayment = products.reduce((acc, product) => acc + product.amount, 0);
        setTotal(totalPayment);
    }, [products])

    return (
        <>
            <div id="generalContainerShopingCart">
                <div>
                    <h1>Carrito de compras</h1>

                    <div id="resumePayment">
                        <div><strong>Monto total:</strong> ${total}</div>
                        <div><strong>Tarifa base:</strong> ${baseRate}</div>
                        <div><strong>Tarifa entrega:</strong> ${deliveryRate}</div>
                    </div>

                    {products.map((product) => (
                        <div className="resumeProduct" key={product.id}>
                            <div>
                                <img src={product.cover_image} />
                            </div>
                            <div>
                                <h5>{product.name}</h5>

                                <p>{product.description}</p>
                                <p style={{marginTop: "10px"}}><strong>Precio: </strong>{product.amount}</p>
                            </div>

                            <span onClick={() => dispatch(deleteProduct(product.id))}>
                                <img src={GarbashIcon} />
                            </span>
                        </div>
                    ))}

                    {products.length > 0 && (<button onClick={() => handlePayment()} data-testid="open-modal-button">Pagar con tarjeta de crédito</button>)}
                </div>
            </div>

            <ModalPayment openModal={openModal} setOpenModal={setOpenModal} total={total} baseRate={baseRate} deliveryRate={deliveryRate} />
        </>
    );
}

export default ShopingCart;
