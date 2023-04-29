import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
const host = 'http://localhost:9000';

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
  // const [mess, setMess] = useState([]);
  // const [message, setMessage] = useState('');
  const [bestBidBTCUSDT, setbestBidBTCUSDT] = useState('');
  const [bestAskBTCUSDT, setbestAskBTCUSDT] = useState('');
  const [bestBidETHBTC, setbestBidETHBTC] = useState('');
  const [bestAskETHBTC, setbestAskETHBTC] = useState('');
  const [bestBidETHUSDT, setbestBidETHUSDT] = useState('');
  const [bestAskETHUSDT, setbestAskETHUSDT] = useState('');
  const [profitRate, setprofitRate] = useState('');

  const socketRef = useRef();
  // const messagesEnd = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on(SOCKET_EVENT.BID_BTCUSDT, (data) => {
      console.log(data);
      setbestBidBTCUSDT(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_BTCUSDT, (data) => {
      console.log(data);
      setbestAskBTCUSDT(data);
    });

    socketRef.current.on(SOCKET_EVENT.BID_ETHBTC, (data) => {
      console.log(data);
      setbestBidETHBTC(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_ETHBTC, (data) => {
      console.log(data);
      setbestAskETHBTC(data);
    });

    socketRef.current.on(SOCKET_EVENT.BID_ETHUSDT, (data) => {
      console.log(data);
      setbestBidETHUSDT(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_ETHUSDT, (data) => {
      console.log(data);
      setbestAskETHUSDT(data);
    });

    socketRef.current.on(SOCKET_EVENT.PROFIT_RATE, (data) => {
      console.log(data);
      setprofitRate(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div class="box-chat">
      <div class="send-box">
        <div> bestBidBTCUSDT:: {bestBidBTCUSDT}</div>
        <br />
        <br />
        <div> bestAskBTCUSDT:: {bestAskBTCUSDT}</div>
        <br />
        <br />
        <div> bestBidETHBTC:: {bestBidETHBTC}</div>
        <br />
        <br />
        <div> bestAskETHBTC:: {bestAskETHBTC}</div>
        <br />
        <br />
        <div> bestBidETHUSDT:: {bestBidETHUSDT}</div>
        <br />
        <br />
        <div> bestAskETHUSDT:: {bestAskETHUSDT}</div>

        <br />
        <br />
        <h1>Detect triangle arbitrage opportunities - Logs profit: </h1>
        <div> PROFIT:: {profitRate}</div>
      </div>
    </div>
  );
}

export default App;
