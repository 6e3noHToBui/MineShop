import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/globalContext';
import "./Shop.css"
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../store/actions/cartActions'

function Shop() {
    const { shop, servers, getServerShop, getServers } = useGlobalContext();
    const [serverName, setServerName] = useState('');
    const [cart] = useSelector(state=>state.cart)
    const [showPrivileges, setShowPrivileges] = useState(true);
    const [showCases, setShowCases] = useState(true);
    const [showItems, setShowItems] = useState(true);
    const { buyItems } = useGlobalContext()
    const dispatch = useDispatch()

    useEffect(() => {
        getServers();
        getServerShop(localStorage.getItem('serverName'));
    }, []);

    const handleServerNameChange = (e) => {
        e.persist();
        if (e.target.value === 'null') {
            setServerName(e.target.value);
        } else {
            setServerName(e.target.value);
            const serverData = {
                serverName: e.target.value
            };
            getServerShop(serverData);
        }
    };

    const addItemToCart = (item, cost, category) => {
        const count = 1
        dispatch(addItem([item,count, cost, category]))
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'privilege') {
            setShowPrivileges(checked);
        } else if (name === 'case') {
            setShowCases(checked);
        } else if (name === 'item') {
            setShowItems(checked);
        }
    };
    const handleBuyItems = () => {
        if (cart != '') {
            buyItems(cart);
            //setCart([]);
        } else {
            console.log("Cart is empty")
        }
    };

    return (
        <div className="shop-container">
            <div className='filter-container'>
                <div className="shop-select">
                    <select name="serverName" onChange={handleServerNameChange} value={serverName}>
                        {servers.map((serv) => (
                            <option key={serv._id} value={serv.serverName}>{serv.serverName}</option>
                        ))}
                    </select>
                </div>
                <hr style={{ width: '98%' }} />
                <div className="checkbox-label">
                    <label htmlFor="privileges">Privileges</label>
                    <input type="checkbox" id="privilege" name="privilege" checked={showPrivileges} onChange={handleCheckboxChange} />
                </div>
                <div className="checkbox-label">
                    <label htmlFor="cases">Cases</label>
                    <input type="checkbox" id="cases" name="case" checked={showCases} onChange={handleCheckboxChange} />
                </div>
                <div className="checkbox-label">
                    <label htmlFor="items">Items</label>
                    <input type="checkbox" id="items" name="item" checked={showItems} onChange={handleCheckboxChange} />
                </div>
                <div className="cart-logo">
                    <button onClick={handleBuyItems}>Buy</button>
                </div>
            </div>
            <div className='shop'>
                <div className='items'>
                    {serverName === 'null' ? '' : (
                        shop.map((item, index) => {
                            const { item: itemName, cost, category } = item;
                            if ((showPrivileges && category === 'privilege') || (showCases && category === 'case') || (showItems && category === 'items')) {
                                return (
                                    <div key={index} className="item">
                                        <p>{itemName}</p>
                                        <div className='item-image'>ТУТ БУДЕТ КАРТИНКА</div>
                                        <p>{cost} $</p>
                                        {true ? (
                                            <p>Добавлено в корзину</p>
                                        ) : (
                                            <div className="add-to-cart" style={{ margin: '5px' }}>
                                                <button onClick={() => addItemToCart(itemName, cost, category)}>Add to cart</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default Shop;
