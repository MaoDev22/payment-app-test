import './styles.scss'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addProduct, deleteProduct } from 'store';

function ProductCard({product}) {
    const [isAdded, setIsAdded] = useState(false);
    const products = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const toggleProduct = () => {
        !isAdded ? dispatch(addProduct(product)) : dispatch(deleteProduct(product.id));
    }

    useEffect(() => {
        const finded = products.find((item) => item.id === product.id);
        setIsAdded(!!finded);
    }, [products]);

    return (
        <article className="productCard" data-aos="fade-up">
            <div className="containerImgProduct">
                <img src={product.cover_image} alt={product.name}/>
            </div>
            <div className="containerInfoProduct">
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>

                <div className="amount"><strong>Precio: </strong> {product.amount} {product.currency}</div>

                <div className="quantity"><strong>Disponible: </strong> {product.quantity} unidades</div>
            </div>
            
            {
                !isAdded ? <button onClick={() => toggleProduct()} className="productAdded">Añadir al carrito</button>
                : <button onClick={() => toggleProduct()} className="deletePorduct">Eliminar del carrito</button>
            }
            
        </article>
    )
}

export default ProductCard;
