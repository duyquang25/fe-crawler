import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import './App.css';

const host = 'http://localhost:9000';
const endPointApi = 'http://localhost:9000/api/v1/profit-log';

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
  const [profitRate, setprofitRate] = useState('');
  const [data, setData] = useState('');

  const socketRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(endPointApi);
      console.log('...', result.data.data);
      setData(result.data.data);
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
      setprofitRate(data);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div class="box-chat">
      <div class="send-box">
        <div> bestBidBTCUSDT:: {bestBidBTCUSDT ? bestBidBTCUSDT : data.rateBidBTCUSDT}</div>
        <br />
        <br />
        <div> bestAskBTCUSDT:: {bestAskBTCUSDT ? bestAskBTCUSDT : data.rateAskETHBTC}</div>
        <br />
        <br />
        <div> bestBidETHBTC:: {bestBidETHBTC ? bestBidETHBTC : data.rateBidETHBTC}</div>
        <br />
        <br />
        <div> bestAskETHBTC:: {bestAskETHBTC ? bestAskETHBTC : data.rateAskETHBTC} </div>
        <br />
        <br />
        <div> bestBidETHUSDT:: {bestBidETHUSDT ? bestBidETHUSDT : data.rateBidETHUSDT}</div>
        <br />
        <br />
        <div> bestAskETHUSDT:: {bestAskETHUSDT ? bestAskETHUSDT : data.rateAskETHUSDT}</div>
        <br />
        <br />
        <h1>Detect triangle arbitrage opportunities - Logs</h1>
        <div> PROFIT:: {profitRate}</div>
      </div>
    </div>
  );
}

export default App;
