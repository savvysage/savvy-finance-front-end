import React from 'react';
import {
  Mainnet,
  DAppProvider,
  ChainId,
  useEtherBalance,
  useEthers,
  Config,
} from '@usedapp/core';
import { Container } from '@mui/material';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { Header } from './components/Header';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.BSC, ChainId.BSCTestnet]
    }}>
      <ResponsiveAppBar />
      <Container maxWidth="xl">
        <Header />
      </Container>
    </DAppProvider>
  );
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
