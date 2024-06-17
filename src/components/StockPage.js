import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StockRow from './StockRow.js';

function StockPage() {
  return (
    <div className="container mt-5">
      <table className="table">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Empresa</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Preço</th>
            <th>Variação (%)</th>
          </tr>
        </thead>
        <tbody>
          <StockRow ticker="AAPL" />
          <StockRow ticker="GOOGL" />
          <StockRow ticker="MSFT" />
          <StockRow ticker="TSLA" />
          <StockRow ticker="NVDA" />
        </tbody>
      </table>
    </div>
  );
}

export default StockPage;
