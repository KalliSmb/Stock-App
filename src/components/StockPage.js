import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StockRow from './StockRow.js';

class StockPage extends Component {
  constructor(props) {
    super(props);
    
    // Carregar ações do localStorage
    const stocks = this.loadStocksFromLocalStorage();
    const total = this.calculateTotal(stocks);

    this.state = {
      total: total,
      stocks: stocks
    };
  }

  loadStocksFromLocalStorage = () => {
    const stocks = [];
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith('stock-')) {
        const stockData = JSON.parse(localStorage.getItem(key));
        stocks.push(stockData);
      }
    }
    return stocks;
  }

  calculateTotal = (stocks) => {
    return stocks.reduce((acc, stock) => {
      const finalPrice = stock.purchasePrice !== 'N/A' && stock.quantity > 0 ? stock.purchasePrice * stock.quantity : 0;
      return acc + finalPrice;
    }, 0);
  }

  updateTotal = (amount, action) => {
    this.setState((prevState) => {
      let newTotal;
      if (action === 'buy') {
        newTotal = prevState.total + amount;
      } else if (action === 'sell') {
        newTotal = prevState.total - amount;
      }
      localStorage.setItem('total', newTotal.toString());
      return { total: newTotal };
    });
  }

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      this.importPortfolio(data);
    };

    reader.readAsText(file);
  }

  importPortfolio = (data) => {
    if (data.total) {
      localStorage.setItem('total', data.total.toString());
    }
    if (data.stocks) {
      data.stocks.forEach(stock => {
        localStorage.setItem(`stock-${stock.ticker}`, JSON.stringify(stock));
      });
      const stocks = this.loadStocksFromLocalStorage();
      const total = this.calculateTotal(stocks);
      this.setState({
        total: total,
        stocks: stocks
      });
    }
  }

  render() {
    return (
      <div className="container mt-5">
        <input type="file" accept=".json" onChange={this.handleFileUpload} className="mb-3" />
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
            {this.state.stocks.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">Por favor, importe um ficheiro JSON para carregar as ações.</td>
              </tr>
            ) : (
              this.state.stocks.map(stock => (
                <StockRow
                  key={stock.ticker}
                  ticker={stock.ticker}
                  initialQuantity={stock.quantity}
                  updateTotal={this.updateTotal}
                />
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="fw-bold">
              <td>TOTAL:</td>
              <td colSpan="6"></td>
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
