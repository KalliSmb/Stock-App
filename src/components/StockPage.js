import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StockRow from './StockRow.js';

class StockPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: 0
    };
  }

  updateTotal = (finalPrice) => {
    this.setState((prevState) => ({
      total: prevState.total + finalPrice
    }));
  }

  render() {
    return (
      <div className="container mt-5">
        <table className="table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Empresa</th>
              <th>Preço Inicial</th>
              <th>Data da Compra</th>
              <th>Hora da Compra</th>
              <th>Quantidade</th>
              <th>Preço Atual</th>
              <th>Preço Final</th>
              <th>Variação (%)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <StockRow ticker="AAPL" initialQuantity={0} updateTotal={this.updateTotal} />
            <StockRow ticker="GOOGL" initialQuantity={0} updateTotal={this.updateTotal} />
            <StockRow ticker="MSFT" initialQuantity={0} updateTotal={this.updateTotal} />
            <StockRow ticker="TSLA" initialQuantity={0} updateTotal={this.updateTotal} />
            <StockRow ticker="NVDA" initialQuantity={0} updateTotal={this.updateTotal} />
          </tbody>
          <tfoot>
            <tr className="fw-bold">
              <td colSpan="6"></td>
              <td>TOTAL:</td>
              <td>${this.state.total.toFixed(2)}</td>
              <td colSpan="2"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default StockPage;
