import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyOrder() {
    const [orderData, setOrderData] = useState(null);

    const fetchMyOrder = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            const response = await fetch("http://localhost:5000/api/auth/myOrderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setOrderData(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <div>
            <Navbar />
            <div className='container'>
                <div className='row'>
                    {orderData && orderData.orderData ? (
                        orderData.orderData.slice(0).reverse().map((orderDateArray, index) => (
                            <div key={index}>
                                {orderDateArray[1] && (
                                    <div className='m-auto mt-5'>
                                        <div>{new Date(orderDateArray[1]).toLocaleDateString()}</div>
                                        <hr />
                                    </div>
                                )}
                                {orderDateArray[0] && Array.isArray(orderDateArray[0]) ? (
                                    orderDateArray[0].map((itemArray, itemIndex) => (
                                        <div key={itemIndex} className='col-12 col-md-6 col-lg-3'>
                                            {itemArray.map((arrayData, arrayDataIndex) => (
                                                <div key={arrayDataIndex}>
                                                    {arrayData.Order_date ? (
                                                        <div className='m-auto mt-5'>
                                                            {arrayData.Order_date}
                                                            <hr />
                                                        </div>
                                                    ) : (
                                                        <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                                            <img 
                                                                src={arrayData.img} 
                                                                className="card-img-top" 
                                                                alt={arrayData.name} 
                                                                style={{ height: "120px", objectFit: "fill" }} 
                                                            />
                                                            <div className="card-body">
                                                                <h5 className="card-title">{arrayData.name}</h5>
                                                                <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                                    <span className='m-1'>{arrayData.qty}</span>
                                                                    <span className='m-1'>{arrayData.size}</span>
                                                                    <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                                        ₹{arrayData.price}/-
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <div>No items available</div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>Loading orders...</div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
