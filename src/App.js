import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import './App.css';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const host = 'http://13.215.193.102:9000';
const endPointApi = 'http://13.215.193.102:9000/api/v1/profit-log';

const SOCKET_EVENT = {
  BID_BTCUSDT: 'bid-btcusdt',
  ASK_BTCUSDT: 'ask-btcusdt',
  BID_ETHBTC: 'bid-ethbtc',
  ASK_ETHBTC: 'ask-ethbtc',
  BID_ETHUSDT: 'bid-ethusdt',
  ASK_ETHUSDT: 'ask-ethusdt',
  PROFIT_RATE: 'profit-rate',
};

function App() {
  const [bestBidBTCUSDT, setbestBidBTCUSDT] = useState('');
  const [bestAskBTCUSDT, setbestAskBTCUSDT] = useState('');
  const [bestBidETHBTC, setbestBidETHBTC] = useState('');
  const [bestAskETHBTC, setbestAskETHBTC] = useState('');
  const [bestBidETHUSDT, setbestBidETHUSDT] = useState('');
  const [bestAskETHUSDT, setbestAskETHUSDT] = useState('');
  const [profitRate, setprofitRate] = useState([]);

  const socketRef = useRef();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(endPointApi);
      console.log('...', result.data.data);
      setbestBidBTCUSDT(result.data.data.rateBidBTCUSDT);
      setbestAskBTCUSDT(result.data.data.rateAskBTCUSDT);
      setbestBidETHBTC(result.data.data.rateBidETHBTC);
      setbestAskETHBTC(result.data.data.rateAskETHBTC);
      setbestBidETHUSDT(result.data.data.rateBidETHUSDT);
      setbestAskETHUSDT(result.data.data.rateAskETHUSDT);
      setprofitRate(result.data.data.logs);
    };

    fetchData();
  }, []);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on(SOCKET_EVENT.BID_BTCUSDT, (data) => {
      setbestBidBTCUSDT(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_BTCUSDT, (data) => {
      setbestAskBTCUSDT(data);
    });

    socketRef.current.on(SOCKET_EVENT.BID_ETHBTC, (data) => {
      setbestBidETHBTC(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_ETHBTC, (data) => {
      setbestAskETHBTC(data);
    });

    socketRef.current.on(SOCKET_EVENT.BID_ETHUSDT, (data) => {
      setbestBidETHUSDT(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_ETHUSDT, (data) => {
      setbestAskETHUSDT(data);
    });

    socketRef.current.on(SOCKET_EVENT.PROFIT_RATE, (data) => {
      console.log(data);
      setprofitRate((prevProfitRate) => {
        const newProfitRate = [data, ...prevProfitRate];
        return newProfitRate.slice(0, 10); // Select 10 element
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function formatRate(rate, decimal) {
    return Number(rate).toFixed(decimal);
  }

  return (
    <div>
      <div className="center">
        <ButtonGroup className="bt-group" aria-label="Basic example">
          <Button variant="primary">USDT</Button>
          <Button variant="light" className="rate">
            ask: {formatRate(bestAskBTCUSDT, 2)}
          </Button>
          <Button variant="light" className="rate">
            bid: {formatRate(bestBidBTCUSDT, 2)}
          </Button>
          <Button variant="success">BTC </Button>
        </ButtonGroup>
      </div>
      <div className="center">
        <ButtonGroup className="bt-group">
          <Button variant="success">BTC </Button>
          <Button variant="light" className="rate">
            ask: {formatRate(bestAskETHBTC, 6)}
          </Button>
          <Button variant="light" className="rate">
            bid: {formatRate(bestBidETHBTC, 6)}
          </Button>
          <Button variant="warning">ETH </Button>
        </ButtonGroup>
      </div>
      <div className="center">
        <ButtonGroup className="bt-group" aria-label="Basic example">
          <Button variant="warning">ETH </Button>
          <Button variant="light" className="rate">
            ask: {formatRate(bestAskETHUSDT, 3)}
          </Button>
          <Button variant="light" className="rate">
            bid: {formatRate(bestBidETHUSDT, 3)}
          </Button>
          <Button variant="primary">USDT</Button>
        </ButtonGroup>
      </div>

      <Card className="log" style={{ width: '65%', margin: '0 auto' }}>
        <Card.Header className="header__card">
          <div>UTC Time: {time.toUTCString()}</div>
          Detect triangle arbitrage opportunities - Profit Rate greater than 1
        </Card.Header>
        <ListGroup variant="flush">
          {profitRate?.map((item, index) => (
            <ListGroup.Item key={index}> {item}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
}

export default App;
