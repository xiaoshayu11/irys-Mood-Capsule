import React, { useMemo, useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import abi from '../../abi/OnChainDiary.json'
import { formatEther, zeroAddress } from 'viem'
import LeftMascot from '../components/LeftMascot'
import RightMascots from '../components/RightMascots'

const style = document.createElement('style')
style.textContent = `
  @keyframes fall {
    0% {
      transform: translateY(-100vh);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(100vh);
      opacity: 0;
    }
  }
`
document.head.appendChild(style)

const HappyMoodIcon: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <img 
    src="/images/happy.png" 
    alt="开心" 
    style={{ 
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      display: 'block',
      imageRendering: 'auto'
    }} 
  />
)

const SadMoodIcon: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <img 
    src="/images/sad.png" 
    alt="难过" 
    style={{ 
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      display: 'block',
      imageRendering: 'auto'
    }} 
  />
)

const AngryMoodIcon: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <img 
    src="/images/angry.png" 
    alt="生气" 
    style={{ 
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      display: 'block',
      imageRendering: 'auto'
    }} 
  />
)

type Props = { route: 'write' | 'mine' }

const CONTRACT_ADDRESS = "0x9C12221922Ad0AD07a83A0560a00350fee5aCcc5"

function getTodayDays(): bigint {
  return BigInt(Math.floor(Date.now() / 1000 / 86400))
}

export const Diary: React.FC<Props> = ({ route }) => {
  const { connectors, connect, isPending: isConnPending } = useConnect()
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Mood component configuration
  const moods = [
    { 
      id: 'happy', 
      name: '开心', 
      color: '#32CD32', 
      glowColor: '#228B22', 
      bgColor: '#F0FFF0',
      component: HappyMoodIcon
    },
    { 
      id: 'sad', 
      name: '难过', 
      color: '#87CEEB', 
      glowColor: '#4682B4', 
      bgColor: '#E6F3FF',
      component: SadMoodIcon
    },
    { 
      id: 'angry', 
      name: '愤怒', 
      color: '#FF6347', 
      glowColor: '#DC143C', 
      bgColor: '#FFE6E6',
      component: AngryMoodIcon
    }
  ]

  const canSubmit = content.length > 0 && content.length <= 20 && !!CONTRACT_ADDRESS && !isUploading


  const { data: hash, isPending: isWritePending, writeContract, error: writeError, reset: resetWriteContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

  const today = getTodayDays()
  const { data: myToday } = useReadContract({
    abi: abi,
    address: (CONTRACT_ADDRESS || '') as `0x${string}`,
    functionName: 'getDiary',
    args: [address ?? zeroAddress, today],
    query: { enabled: Boolean(address && CONTRACT_ADDRESS) }
  })

  const { data: dailyCount } = useReadContract({
    abi: abi,
    address: (CONTRACT_ADDRESS || '') as `0x${string}`,
    functionName: 'getDailySubmissionCount',
    args: [address ?? zeroAddress, today],
    query: { enabled: Boolean(address && CONTRACT_ADDRESS) }
  })

  const [daysBack, setDaysBack] = useState(7)
  const dates = useMemo(() => Array.from({ length: daysBack }, (_, i) => today - BigInt(i)), [daysBack, today])

  // Handle image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size cannot exceed 5MB')
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload image to IPFS (using base64 encoding as example)
  const uploadToIPFS = async (file: File): Promise<string> => {
    setIsUploading(true)
    try {
      // In a real project, this should upload to actual IPFS service
      // Now using base64 as placeholder
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          try {
            const base64 = reader.result as string
            // Extract base64 part, remove data:image/...;base64, prefix
            const base64Data = base64.split(',')[1] || base64
            console.log('Original base64 length:', base64Data.length)
            console.log('Base64 first 50 chars:', base64Data.substring(0, 50))
            resolve(base64Data) // Should be IPFS hash in real implementation
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = () => reject(new Error('File read failed'))
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Image upload failed:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%)',
      padding: '0',
      margin: '0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Meteor shower effect */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '20px',
              background: 'linear-gradient(to bottom, transparent, #00d4ff, transparent)',
              left: `${Math.random() * 100}%`,
              animation: `fall ${3 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>



        {/* Mascots */}
      <LeftMascot customImage="/mascots/left-mascot.png" />
      <RightMascots customImages={[
        '/mascots/mascot1.png',
        '/mascots/mascot2.png',
        '/mascots/mascot3.png',
        '/mascots/mascot4.png',
        '/mascots/mascot5.png',
      ]} />

      {/* Main content area */}
      <div style={{ position: 'relative', zIndex: 2, paddingTop: '20px' }}>
      {route === 'write' && (
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '48px', 
          borderRadius: '24px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
          marginBottom: '32px',
          maxWidth: '900px',
          margin: '0 auto 32px auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '900', 
            color: '#00FFD1', 
            marginBottom: '40px',
            fontFamily: 'Poppins, Inter, sans-serif',
            textAlign: 'center',
            letterSpacing: '3px',
            lineHeight: '1.0',
            textShadow: '0 0 30px rgba(0, 255, 209, 0.8), 0 0 60px rgba(0, 255, 209, 0.4)',
            background: 'linear-gradient(135deg, #00FFD1, #00B3A4, #00FFD1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease-in-out infinite'
          }}>心情胶囊</h2>
          <textarea
            rows={4}
            placeholder="分享你的小心情... (最多 20 字)"
            value={content}
            onChange={e => {
              setContent(e.target.value.slice(0, 20))
              // 当用户开始输入时，清除之前的错误信息
              if (writeError) {
                resetWriteContract()
              }
            }}
            style={{ 
              width: '100%', 
              boxSizing: 'border-box',
              padding: '24px',
              fontSize: '20px',
              border: '2px solid rgba(0, 255, 209, 0.3)',
              borderRadius: '20px',
              fontFamily: 'Poppins, Inter, sans-serif',
              resize: 'vertical',
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              marginBottom: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(0, 255, 209, 0.2)',
              backdropFilter: 'blur(20px)',
              lineHeight: '1.6',
              fontWeight: '500',
              letterSpacing: '0.5px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
          
          {/* Mood selection area */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '15px', 
              fontWeight: '500',
              color: '#b0b0b0',
              fontSize: '15px',
              fontFamily: 'Inter, Poppins, sans-serif',
              fontStyle: 'italic',
              textAlign: 'center',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              选择心情 (可选)
            </label>
            <div style={{ 
              display: 'flex', 
              gap: '40px', 
              justifyContent: 'center',
              marginBottom: '32px',
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {moods.map((mood, index) => {
                const MoodComponent = mood.component
                const isSelected = selectedEmoji === mood.id
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedEmoji(mood.id)
                      setSelectedImage(null)
                      setImagePreview(null)
                    }}
                    style={{
                      width: '90px',
                      height: '90px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: isSelected ? '4px solid #00FFD1' : '2px solid transparent',
                      boxShadow: isSelected 
                        ? '0 0 20px rgba(0, 255, 209, 0.6), 0 4px 15px rgba(0, 255, 209, 0.3)' 
                        : 'none',
                      transform: 'scale(1)',
                      userSelect: 'none',
                      outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget as HTMLDivElement
                      if (!isSelected) {
                        target.style.transform = 'scale(1.05)'
                        target.style.boxShadow = '0 4px 15px rgba(0, 255, 209, 0.3)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget as HTMLDivElement
                      if (!isSelected) {
                        target.style.transform = 'scale(1)'
                        target.style.boxShadow = 'none'
                      }
                    }}
                    onMouseDown={(e) => {
                      const target = e.currentTarget as HTMLDivElement
                      target.style.transform = 'scale(0.95)'
                      setTimeout(() => {
                        target.style.transform = isSelected ? 'scale(1)' : 'scale(1.05)'
                      }, 100)
                    }}
                  >
                    <MoodComponent size={50} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Image upload area */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '400',
              color: '#aaa',
              fontSize: '14px',
              fontFamily: 'Source Han Sans, Noto Sans CJK SC, PingFang SC, Microsoft YaHei, sans-serif',
              fontStyle: 'italic',
              textAlign: 'center'
            }}>
              或上传自定义图片 (可选，最大5MB)
            </label>
            <div style={{
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('fileInput')?.click()}
            onMouseEnter={(e) => {
              const target = e.target as HTMLDivElement
              target.style.borderColor = '#007bff'
              target.style.backgroundColor = '#f0f8ff'
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLDivElement
              target.style.borderColor = '#e9ecef'
              target.style.backgroundColor = '#f8f9fa'
            }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
              <div style={{ 
                color: '#aaa', 
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic'
              }}>
                点击选择图片或拖拽到此处
              </div>
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            {imagePreview && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <img 
                  src={imagePreview} 
                  alt="预览" 
                  style={{ 
                    maxWidth: '150px', 
                    maxHeight: '150px', 
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 8px rgba(0,123,255,0.3)'
                  }} 
                />
                <div style={{ marginTop: '10px' }}>
                  <button
                    onClick={() => {
                      setSelectedImage(null)
                      setImagePreview(null)
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    删除图片
                  </button>
                </div>
              </div>
            )}
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '15px',
            gap: '10px'
          }}>
            <span style={{ 
              fontSize: '14px', 
              color: content.length > 15 ? '#dc3545' : '#aaa',
              fontFamily: 'Inter, sans-serif',
              fontWeight: content.length > 15 ? 'bold' : '500'
            }}>
              {content.length}/20
            </span>
            <button
              disabled={!isConnected || !canSubmit || isWritePending || isConfirming || isUploading}
              onClick={async () => {
                console.log('提交日记:', content)
                console.log('合约地址:', CONTRACT_ADDRESS)
                
                let imageHash = ''
                if (selectedEmoji) {
                  // 使用表情作为图片
                  imageHash = `emoji:${selectedEmoji}`
                  console.log('使用表情:', selectedEmoji)
                } else if (selectedImage) {
                  console.log('开始上传图片...')
                  try {
                    imageHash = await uploadToIPFS(selectedImage)
                    console.log('图片hash长度:', imageHash.length)
                    // 不再截断图片数据，保持完整
                  } catch (error) {
                    console.error('Image upload failed:', error)
                    alert('图片上传失败，将只提交文字')
                    imageHash = ''
                  }
                }
                
                console.log('调用合约参数:', [content, imageHash])
                
                try {
                  await writeContract({
                    abi: abi,
                    address: (CONTRACT_ADDRESS || '') as `0x${string}`,
                    functionName: 'writeDiary',
                    args: [content, imageHash]
                  })
                } catch (error: any) {
                  console.error('合约调用错误:', error)
                  // 错误会被 useWriteContract 的 error 状态捕获，这里不需要额外处理
                }
              }}
              style={{
                padding: '8px 16px',
                fontSize: '16px',
                fontWeight: '600',
                background: (!isConnected || !canSubmit || isWritePending || isConfirming) 
                  ? 'rgba(108, 117, 125, 0.3)' 
                  : 'linear-gradient(90deg, #00FFD1, #00B3A4)',
                color: (!isConnected || !canSubmit || isWritePending || isConfirming) ? '#aaa' : '#000',
                border: 'none',
                borderRadius: '6px',
                cursor: (!isConnected || !canSubmit || isWritePending || isConfirming) ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, Poppins, sans-serif',
                transition: 'transform 0.2s',
                boxShadow: (!isConnected || !canSubmit || isWritePending || isConfirming) 
                  ? 'none' 
                  : '0 0 6px rgba(0,255,209,0.6)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                backdropFilter: 'blur(10px)',
                width: 'auto',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                if (!(!isConnected || !canSubmit || isWritePending || isConfirming)) {
                  (e.target as HTMLButtonElement).style.transform = 'scale(1.05)'
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = 'scale(1)'
              }}
            >
              {isUploading ? '上传图片中...' : isWritePending || isConfirming ? '封存中...' : '封存'}
            </button>
          </div>
          {writeError && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              marginTop: '15px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>
                ❌ {(writeError.message && (writeError.message.includes('Daily limit reached'))) ||
                    (writeError.message && writeError.message.includes('User rejected')) ? 
                  (writeError.message.includes('Daily limit reached') ? '今日心情已达上限（5次），明天再来吧！' : '交易已取消') : 
                  '提交失败，请重试'}
              </span>
              <button
                onClick={() => resetWriteContract()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#721c24',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'Inter, sans-serif',
                  padding: '0',
                  marginLeft: '10px'
                }}
              >
                ✕
              </button>
            </div>
          )}
          {(hash as any) && (
            <React.Fragment>
            <div style={{
              backgroundColor: '#d1ecf1',
              color: '#0c5460',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              marginTop: '15px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif'
            }}>
                🔗 交易已发送：<a 
                  href={`https://explorer.irys.xyz/tx/${String(hash)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    color: '#007bff', 
                    textDecoration: 'none', 
                    fontWeight: '600',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  查看区块链
                </a>
              </div>
            </React.Fragment>
          )}
          {isConfirmed && (
            <div style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              marginTop: '15px',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif'
            }}>
              ✅ 已成功上链！
            </div>
          )}
          {myToday && Array.isArray(myToday) && myToday.length > 0 && (
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              marginTop: '15px',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Inter, sans-serif'
            }}>
              📝 今日已写 {dailyCount ? Number(dailyCount) : myToday.length} 条心情：
              <div style={{ marginTop: '8px' }}>
                {(myToday as string[]).map((entry: string, index: number) => (
                  <div key={index} style={{ marginBottom: '4px' }}>
                    {index + 1}. {entry}
                  </div>
                ))}
              </div>
            </div>
          )}
          {!CONTRACT_ADDRESS && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              marginTop: '15px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif'
            }}>
              ⚠️ 请设置 VITE_DIARY_ADDRESS 环境变量。
            </div>
          )}
        </div>
      )}

      {route === 'mine' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '48px', 
          borderRadius: '24px', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
          marginBottom: '32px',
          maxWidth: '900px',
          margin: '0 auto 32px auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            color: '#00FFD1', 
            marginBottom: '40px',
            fontFamily: 'Poppins, Inter, sans-serif',
            textAlign: 'center',
            letterSpacing: '2px',
            lineHeight: '1.1',
            textShadow: '0 0 20px rgba(0, 255, 209, 0.5)',
            background: 'linear-gradient(135deg, #00FFD1, #00B3A4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>心迹</h2>
          <DiaryList dates={dates} address={address} />
        </div>
      )}
      </div>
    </div>
  )
}

const DiaryList: React.FC<{ dates: bigint[], address?: `0x${string}` }> = ({ dates, address }) => {
  const [diaryData, setDiaryData] = useState<Array<{date: bigint, entries: string[], images: string[]}>>([])

  // 获取所有日期的日记数据
  const diaryQueries = dates.map(date => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useReadContract({
      abi: abi,
      address: (CONTRACT_ADDRESS || '') as `0x${string}`,
      functionName: 'getDiary',
      args: [address ?? zeroAddress, date],
      query: { enabled: Boolean(address && CONTRACT_ADDRESS) }
    })
  })

  // 获取所有日期的图片数据
  const imageQueries = dates.map(date => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useReadContract({
      abi: abi,
      address: (CONTRACT_ADDRESS || '') as `0x${string}`,
      functionName: 'getDiaryImage',
      args: [address ?? zeroAddress, date],
      query: { enabled: Boolean(address && CONTRACT_ADDRESS) }
    })
  })

  useEffect(() => {
    const results: Array<{date: bigint, entries: string[], images: string[]}> = []
    
    diaryQueries.forEach((query, index) => {
      if (query.data && Array.isArray(query.data) && query.data.length > 0) {
        const images = imageQueries[index]?.data as string[] || []
        results.push({ 
          date: dates[index], 
          entries: query.data,
          images: images
        })
      }
    })
    
    setDiaryData(results)
  }, [diaryQueries, imageQueries, dates])

  const isLoading = diaryQueries.some(query => query.isLoading) || imageQueries.some(query => query.isLoading)

  if (isLoading) {
    return <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      color: '#aaa',
      fontFamily: 'Source Han Sans, Noto Sans CJK SC, PingFang SC, Microsoft YaHei, sans-serif',
      fontSize: '16px',
      fontStyle: 'italic'
    }}>加载中...</div>
  }

  if (diaryData.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        color: '#aaa',
        fontStyle: 'italic',
        fontSize: '16px',
        fontFamily: 'Source Han Sans, Noto Sans CJK SC, PingFang SC, Microsoft YaHei, sans-serif'
      }}>
        还没有心情记录，去写一些小心情吧～
      </div>
    )
  }

  return (
    <div>
      {diaryData.map(({ date, entries, images }, index) => (
        <DiaryItem key={String(date)} date={date} entries={entries} images={images} />
      ))}
    </div>
  )
}

// 根据心情ID获取对应的组件
const getMoodComponent = (moodId: string) => {
  switch (moodId) {
    case 'happy':
      return HappyMoodIcon
    case 'sad':
      return SadMoodIcon
    case 'angry':
      return AngryMoodIcon
    default:
      return null
  }
}

const DiaryItem: React.FC<{ date: bigint, entries: string[], images?: string[] }> = ({ date, entries, images = [] }) => {
  const dayStr = new Date(Number(date) * 86400 * 1000).toLocaleDateString()
  const hasEmojiImages = images.some(img => img && img.startsWith('emoji:'))
  
  return (
    <div style={{ 
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: hasEmojiImages ? 'transparent' : '#f8f9fa',
      borderRadius: '15px',
      border: hasEmojiImages ? 'none' : '1px solid #e9ecef'
    }}>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '600', 
        color: '#00FFD1',
        marginBottom: '10px',
        fontFamily: 'Source Han Sans, Noto Sans CJK SC, PingFang SC, Microsoft YaHei, sans-serif'
      }}>
        {dayStr}
      </div>
      <div style={{ marginTop: '10px' }}>
        {entries.map((entry: string, index: number) => (
          <div key={index} style={{ 
            marginBottom: '12px', 
            padding: '15px',
            backgroundColor: images[index] && images[index].startsWith('emoji:') ? 'transparent' : 'white',
            borderRadius: '10px',
            border: images[index] && images[index].startsWith('emoji:') ? 'none' : '1px solid #e9ecef',
            fontSize: '16px',
            fontFamily: 'Source Han Sans, Noto Sans CJK SC, PingFang SC, Microsoft YaHei, sans-serif',
            lineHeight: '1.5',
            color: '#ddd'
          }}>
            {entries.length > 1 && <span style={{ color: '#aaa', marginRight: '8px' }}>{index + 1}.</span>}
            {entry}
            {images[index] && (
              <div style={{ marginTop: '10px', textAlign: 'center', backgroundColor: 'transparent' }}>
                {(() => {
                  if (images[index].startsWith('emoji:')) {
                    const moodId = images[index].replace('emoji:', '')
                    const MoodComponent = getMoodComponent(moodId)
                    
                    if (MoodComponent) {
                      // 根据心情ID获取对应的背景色
                      const getMoodBgColor = (moodId: string) => {
                        switch (moodId) {
                          case 'happy': return '#F0FFF0' // 浅绿色
                          case 'sad': return '#E6F3FF' // 浅蓝色  
                          case 'angry': return '#F8F8F8' // 非常浅的灰色，几乎透明
                          default: return 'transparent'
                        }
                      }
                      
                      return (
                        <div 
                          style={{ 
                            display: 'flex',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            transform: 'scale(1)',
                            userSelect: 'none',
                            backgroundColor: getMoodBgColor(moodId),
                            borderRadius: '50%',
                            padding: '10px',
                            width: '60px',
                            height: '60px',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            const target = e.target as HTMLDivElement
                            target.style.transform = 'scale(1.2) rotate(5deg)';
                            target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            const target = e.target as HTMLDivElement
                            target.style.transform = 'scale(1) rotate(0deg)';
                            target.style.boxShadow = 'none';
                          }}
                          onClick={(e) => {
                            const target = e.target as HTMLDivElement
                            // 点击时的弹跳效果
                            target.style.transform = 'scale(0.9) rotate(-5deg)';
                            setTimeout(() => {
                              target.style.transform = 'scale(1.1) rotate(3deg)';
                              setTimeout(() => {
                                target.style.transform = 'scale(1) rotate(0deg)';
                              }, 100);
                            }, 50);
                          }}
                          onMouseMove={(e) => {
                            const target = e.target as HTMLDivElement
                            // 鼠标移动时的微妙跟随效果
                            const rect = target.getBoundingClientRect();
                            const centerX = rect.left + rect.width / 2;
                            const centerY = rect.top + rect.height / 2;
                            const deltaX = (e.clientX - centerX) / 20;
                            const deltaY = (e.clientY - centerY) / 20;
                            target.style.transform = `scale(1.1) translate(${deltaX}px, ${deltaY}px) rotate(${deltaX * 2}deg)`;
                          }}
                        >
                          <MoodComponent size={40} />
                        </div>
                      );
                    } else {
                      // 如果找不到对应的组件，显示原始emoji
                      // 根据心情ID获取对应的背景色
                      const getMoodBgColor = (moodId: string) => {
                        switch (moodId) {
                          case 'happy': return '#F0FFF0' // 浅绿色
                          case 'sad': return '#E6F3FF' // 浅蓝色  
                          case 'angry': return '#F8F8F8' // 非常浅的灰色，几乎透明
                          default: return '#f0f8ff'
                        }
                      }
                      
                      return (
                        <div 
                          style={{ 
                            fontSize: '40px', 
                            display: 'flex',
                            padding: '10px',
                            backgroundColor: getMoodBgColor(moodId),
                            borderRadius: '50%',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                            transform: 'scale(1)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            userSelect: 'none',
                            width: '60px',
                            height: '60px',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {images[index].replace('emoji:', '')}
                        </div>
                      );
                    }
                  } else {
                    // 对于所有图片数据，统一显示"图片已上传链上"
                    return (
                      <div style={{ 
                        padding: '15px',
                        backgroundColor: '#e8f5e8',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '16px',
                        color: '#155724',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600',
                        display: 'inline-block',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        📷 图片已上传
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}



