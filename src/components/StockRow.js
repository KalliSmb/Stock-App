import React, { Component } from 'react';
import { twelve } from '../config/twelve.js';

class StockRow extends Component {
  constructor(props) {
    super(props);
    const savedData = JSON.parse(localStorage.getItem(`stock-${props.ticker}`)) || {};

    this.state = {
      name: savedData.name || '',
      currentDate: savedData.currentDate || '',
      currentTime: savedData.currentTime || '',
      currentPrice: savedData.currentPrice || '',
      changePercent: savedData.changePercent || '',
      quantity: savedData.quantity || props.initialQuantity || 0,
      purchasePrice: savedData.purchasePrice || 'N/A',
      purchaseDate: savedData.purchaseDate || 'N/A',
      purchaseTime: savedData.purchaseTime || 'N/A'
    };
  }

  componentDidMount() {
    this.fetchStockData();
  }

  fetchStockData = () => {
    const url = `${twelve.base_url}/quote?symbol=${this.props.ticker}&apikey=${twelve.api_token}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('API Data:', data);

        if (data) {
          const currentDate = new Date().toISOString().split('T')[0];
          const currentTime = new Date().toLocaleTimeString();
          const currentPrice = data.close ? parseFloat(data.close).toFixed(2) : 'N/A';
          const changePercent = data.percent_change ? parseFloat(data.percent_change).toFixed(2) : 'N/A';
          const name = data.name || 'N/A';

          this.setState({
            name: name,
            currentDate: currentDate,
            currentTime: currentTime,
            currentPrice: currentPrice,
            changePercent: changePercent
          }, this.saveDataToLocalStorage);
        } else {
          console.error('Erro: Dados não disponíveis.');
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados: ", error);
      });
  }

  saveDataToLocalStorage = () => {
    const { ticker } = this.props;
    const {
      name, currentDate, currentTime, currentPrice, changePercent,
      quantity, purchasePrice, purchaseDate, purchaseTime
    } = this.state;

    const data = {
      ticker, name, currentDate, currentTime, currentPrice, changePercent,
      quantity, purchasePrice, purchaseDate, purchaseTime
    };

    localStorage.setItem(`stock-${ticker}`, JSON.stringify(data));
  }

  render() {
    const { ticker } = this.props;
    const {
      name, currentDate, currentTime, currentPrice, changePercent,
      quantity, purchasePrice, purchaseDate, purchaseTime
    } = this.state;
    const variation = purchasePrice !== 'N/A' && currentPrice !== 'N/A' ? ((currentPrice - purchasePrice) / purchasePrice * 100).toFixed(2) : 'N/A';
    const changeClass = variation !== 'N/A' ? (variation >= 0 ? 'text-success' : 'text-danger') : '';
    const finalPrice = purchasePrice !== 'N/A' && quantity > 0 ? (purchasePrice * quantity).toFixed(2) : 'N/A';

    return (
      <tr className="stock-row">
        <td>{ticker}</td>
        <td>{name}</td>
        <td>{purchasePrice !== 'N/A' ? `$${purchasePrice}` : 'N/A'}</td>
        <td>{purchaseDate}</td>
        <td>{purchaseTime}</td>
        <td>{quantity}</td>
        <td>${currentPrice}</td>
        <td>${finalPrice}</td>
        <td className={changeClass}>{variation}%</td>
      </tr>
    );
  }
}

export default StockRow;
