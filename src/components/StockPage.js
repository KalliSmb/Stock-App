import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StockRow from './StockRow.js';

class StockPage extends Component {
  constructor(props) {
    super(props);
    
    // Carregar ações do localStorage
    const stocks = this.loadStocksFromLocalStorage();
    const total = this.calculateTotal(stocks);

    // Carregar total do localStorage
    const savedTotal = localStorage.getItem('total');
    this.state = {
      total: savedTotal ? parseFloat(savedTotal) : total,
      stocks: stocks
    };
  }

  componentDidMount() {
    // Verificar se há dados no localStorage e carregar se existirem
    const savedStocks = JSON.parse(localStorage.getItem('stocks')) || [];

    if (savedStocks.length > 0) {
      this.setState({
        stocks: savedStocks
      });
    }
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
      this.setState({
        stocks: stocks
      }, () => {
        // Após atualizar o estado, também atualizamos o localStorage
        localStorage.setItem('stocks', JSON.stringify(stocks));

        // Recalcula o total após a importação
        const total = this.calculateTotal(stocks);
        this.setState({
          total: total
        });
        localStorage.setItem('total', total.toString());
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
            </tr>
          </thead>
          <tbody>
            {this.state.stocks.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">Por favor, importe um ficheiro JSON para carregar as ações.</td>
              </tr>
            ) : (
              this.state.stocks.map(stock => (
                <StockRow
                  key={stock.ticker}
                  ticker={stock.ticker}
                  initialQuantity={stock.quantity}
                />
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="fw-bold">
              <td>TOTAL:</td>
              <td colSpan="6"></td>
              <td>${this.state.total.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default StockPage;
