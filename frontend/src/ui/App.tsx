import React, { useMemo, useState } from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'
import { Diary } from './Diary'
import { WalletSection } from './WalletSection'

const irysTestnet = defineChain({
  id: 1270,
  name: 'IRYS Testnet',
  nativeCurrency: { name: 'IRYS', symbol: 'IRYS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'] },
    public: { http: ['https://testnet-rpc.irys.xyz/v1/execution-rpc'] },
  },
  blockExplorers: {
    default: { name: 'IRYS Explorer', url: 'https://explorer.irys.xyz' },
  },
  testnet: true,
})

const queryClient = new QueryClient()

const config = createConfig({
  chains: [irysTestnet],
  transports: { [irysTestnet.id]: http() },
  connectors: [injected()],
})

export const App: React.FC = () => {
  const [route, setRoute] = useState<'write' | 'mine'>('write')

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div style={{ 
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%)',
          position: 'relative'
        }}>
          {/* Top navigation bar */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'transparent',
            backdropFilter: 'blur(10px)',
            border: 'none',
            padding: '20px'
          }}>
            {/* Left LOGO */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 999
            }}>
              <div style={{
                fontFamily: 'Orbitron, Arial Black, Impact, sans-serif',
                fontWeight: '900',
                fontStyle: 'italic',
                fontSize: '32px',
                letterSpacing: '3px',
                color: '#00FFD1',
                background: 'transparent',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '2px solid #00FFD1',
                textShadow: '0 0 10px rgba(0, 255, 209, 1), 0 0 20px rgba(0, 255, 209, 0.5)',
                transform: 'perspective(1000px) rotateX(5deg)',
                transition: 'all 0.3s ease'
              }}>
                IRYS
              </div>
            </div>

            {/* Center navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 999
            }}>
              <div style={{
                display: 'flex',
                gap: '16px',
                background: 'transparent',
                padding: '6px 12px',
                borderRadius: '10px',
                border: 'none'
              }}>
                <button
                  onClick={() => setRoute('write')}
                  style={{
                    background: route === 'write' ? 'linear-gradient(135deg, #00FFD1, #00B3A4)' : 'transparent',
                    color: route === 'write' ? '#000' : '#e0e0e0',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'Poppins, Inter, sans-serif',
                    boxShadow: route === 'write' ? '0 4px 20px rgba(0, 255, 209, 0.3)' : 'none',
                    backdropFilter: 'blur(10px)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (route !== 'write') {
                      (e.target as HTMLButtonElement).style.color = '#00FFD1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (route !== 'write') {
                      (e.target as HTMLButtonElement).style.color = '#aaa'
                    }
                  }}
                >
                  心语
                </button>
                <button
                  onClick={() => setRoute('mine')}
                  style={{
                    background: route === 'mine' ? 'linear-gradient(135deg, #00FFD1, #00B3A4)' : 'transparent',
                    color: route === 'mine' ? '#000' : '#e0e0e0',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '800',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'Poppins, Inter, sans-serif',
                    boxShadow: route === 'mine' ? '0 4px 20px rgba(0, 255, 209, 0.3)' : 'none',
                    backdropFilter: 'blur(10px)',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (route !== 'mine') {
                      (e.target as HTMLButtonElement).style.color = '#00FFD1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (route !== 'mine') {
                      (e.target as HTMLButtonElement).style.color = '#aaa'
                    }
                  }}
                >
                  心迹
                </button>
              </div>
            </div>
          </div>

          {/* Top right wallet area */}
          <div style={{ 
            position: 'fixed',
            top: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 1000
          }}>
            <WalletSection />
          </div>
          
          {/* Main content area */}
          <div style={{ 
            width: '100%',
            paddingTop: '100px'
          }}>
            <Diary route={route} />
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}



