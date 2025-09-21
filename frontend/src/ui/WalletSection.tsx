import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const WalletSection: React.FC = () => {
  const { connectors, connect, isPending: isConnPending } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <button 
        onClick={() => {
          const okxConnector = connectors.find(c => c.name.includes('OKX') || c.name.includes('okx'))
          if (okxConnector) {
            connect({ connector: okxConnector })
          } else {
            alert('请安装OKX钱包')
          }
        }} 
        disabled={isConnPending}
        style={{ 
          padding: '12px 24px', 
          fontSize: '16px', 
          fontWeight: '600',
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '10px',
          cursor: isConnPending ? 'not-allowed' : 'pointer',
          fontFamily: 'Arial, sans-serif',
          transition: 'all 0.3s ease',
          boxShadow: '0 3px 6px rgba(0,123,255,0.3)',
          opacity: isConnPending ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isConnPending) {
            e.target.style.backgroundColor = '#0056b3'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 5px 10px rgba(0,123,255,0.4)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isConnPending) {
            e.target.style.backgroundColor = '#007bff'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 3px 6px rgba(0,123,255,0.3)'
          }
        }}
      >
        {isConnPending ? '连接中...' : '连接钱包'}
      </button>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px',
      backgroundColor: 'white',
      padding: '10px 15px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px' 
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: '#28a745',
          borderRadius: '50%'
        }}></div>
        <span style={{ 
          fontSize: '16px', 
          color: '#333',
          fontWeight: '500',
          fontFamily: 'Arial, sans-serif'
        }}>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
      <button 
        onClick={() => disconnect()}
        style={{ 
          padding: '8px 16px', 
          fontSize: '14px', 
          fontWeight: '600',
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 4px rgba(220,53,69,0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#c82333'
          e.target.style.transform = 'translateY(-1px)'
          e.target.style.boxShadow = '0 4px 8px rgba(220,53,69,0.4)'
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#dc3545'
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 2px 4px rgba(220,53,69,0.3)'
        }}
      >
        断开
      </button>
    </div>
  )
}
