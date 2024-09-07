import './styles.scss'

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';
import { closeSesion } from 'store';

import ShoppingCartIcon from './assets/shoping-cart.svg'

function Header() {
    const token = useSelector((state) => state.token);
    const products = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCloseSesion = () => {
        dispatch(closeSesion());
        navigate('/');
    }

    return (
        <>
            <div className="generalContainerHeader">
                <div>
                    <Link to="/"><h1>PayApp</h1></Link>

                    <div>
                        { token ? <a onClick={() => handleCloseSesion()}>Salir</a> : <Link to="/login">Ingresar</Link> }
                    </div>
                </div>
            </div>

            <Link to="/shoping-cart" id="shoping-cart-button" data-testid="shoping-cart-button">
                <img src={ShoppingCartIcon} />

                <span data-testid="counter-cart">
                    {products.length}
                </span>
            </Link>
        </>
        
    )
}

export default Header;
