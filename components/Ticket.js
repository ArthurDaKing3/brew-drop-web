import React from 'react';

const Ticket = () => {
  const business = {
    name: 'Corner Café',
    address: '123 Calle Bilbao, ',
    phone: '555-1234',
    schedule: '8:00 AM - 8:00 PM',
    logo: '/icon-512x512.png'
  };

  const order = {
    items: [
      { name: 'Coffee', quantity: 2, price: 1.5 },
      { name: 'Croissant', quantity: 1, price: 2.0 }
    ],
    total: 5.0,
    paymentMethod: 'Efectivo'
  };

  return (
    <div id="ticket" className="ticket-container">
      <div className="ticket">
        <div className="business-info">
          <img
            src={business.logo}
            alt={`${business.name} Logo`}
            className="business-logo"
          />
          <h1 className="title">{business.name}</h1>
          <p className="info">
            {business.address}<br />
            Teléfono: {business.phone}<br />
            Horario: {business.schedule}
          </p>
        </div>
        <hr className="separator" />
        <div className="order-info">
          <h3 className="subtitle">Resumen de la Orden</h3>
          <ul className="list">
            {order.items.map((item, index) => (
              <li key={index} className="list-item">
                <span className="item-name">{item.name} x {item.quantity}</span>
                <span className="item-price">${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr className="separator" />
          <p className="total">
            <strong>Total: ${order.total.toFixed(2)}</strong>
          </p>
          <p className="payment">Pago: {order.paymentMethod}</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
