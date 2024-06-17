import React, { Component } from 'react';
import { twelve } from '../config/twelve.js';

class StockRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      date: '',
      time: '',
      price: '',
      changePercent: ''
    };
  }

  componentDidMount() {
    const url = `${twelve.base_url}/quote?symbol=${this.props.ticker}&apikey=${twelve.api_token}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('API Data:', data);

        if (data) {
          const date = data.datetime || new Date().toISOString().split('T')[0];
          const currentTime = new Date();
          const time = currentTime.toLocaleTimeString();
          const price = data.close ? parseFloat(data.close).toFixed(2) : 'N/A';
          const changePercent = data.percent_change ? parseFloat(data.percent_change).toFixed(2) : 'N/A';
          const name = data.name || 'N/A';

          this.setState({
            name: name,
            date: date,
            time: time,
            price: price,
            changePercent: changePercent
          });
        } else {
          console.error('Erro: Dados não disponíveis.');
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados: ", error);
      });
  }

  render() {
    const { ticker } = this.props;
    const { name, date, time, price, changePercent } = this.state;
    const changeClass = changePercent > 0 ? 'text-success' : 'text-danger';

    return (
      <tr>
        <td>{ticker}</td>
        <td>{name}</td>
        <td>{date}</td>
        <td>{time}</td>
        <td>${price}</td>
        <td className={changeClass}>{changePercent}%</td>
      </tr>
    );
  }
}

export default StockRow;
