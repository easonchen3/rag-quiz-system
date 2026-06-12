import React, { useState, useEffect, useCallback } from 'react'

const API_BASE = '/rag-quiz/api'

const idxToLetter = (i) => String.fromCharCode(65 + i)

// ===== 登录页 =====
function LoginPage({ onStart }) {
  const [name, setName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) { setError('请输入姓名'); return }
    if (!employeeId.trim()) { setError('请输入工号'); return }
    setError('')
    onStart({ name: name.trim(), employeeId: employeeId.trim() })
  }

  return (
    <div className="card">
      <h2>身份验证</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>姓名</label>
          <input
            type="text"
            placeholder="请输入姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="input-group">
          <label>工号</label>
          <input
            type="text"
            placeholder="请输入工号"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
        {error && <div className="msg-err">{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
          开始答题
        </button>
      </form>
    </div>
  )
}

// ===== 答题页 =====
function QuizPage({ user, questions, onSubmit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const currentQ = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  const selectOption = (questionId, optionIndex) => {
    if (submitting) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handleSubmit = () => {
    if (!allAnswered || submitting) return
    setSubmitting(true)
    const answerList = questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id],
      _a: q._a,
      options: q.options,
    }))
    onSubmit(answerList)
  }

  return (
    <div className="card">
      <div className="progress-wrap">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">{currentIndex + 1} / {questions.length}</span>
      </div>

      <div className="question-text">
        <span style={{ color: 'var(--text-dim)', marginRight: 6 }}>{currentIndex + 1}.</span>
        {currentQ.question}
      </div>

      <div className="options-list">
        {currentQ.options.map((opt, idx) => {
          let cls = 'option-item'
          if (answers[currentQ.id] === idx) cls += ' selected'
          return (
            <div key={idx} className={cls} onClick={() => selectOption(currentQ.id, idx)}>
              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
              <span>{opt}</span>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        {currentIndex > 0 && (
          <button className="btn btn-outline" onClick={handlePrev} style={{ flex: 1 }}>
            上一题
          </button>
        )}
        {currentIndex < questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={answers[currentQ.id] === undefined}
            style={{ flex: 1 }}
          >
            下一题
          </button>
        ) : (
          <button
            className="btn btn-submit"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            style={{ flex: 1 }}
          >
            {submitting ? '提交中...' : '提交答卷'}
          </button>
        )}
      </div>
    </div>
  )
}

// ===== 结果页 =====
function ResultPage({ user, result, onRetry }) {
  const { score, correct, total, details } = result

  const getLevel = () => {
    if (score >= 90) return { cls: 'excellent', text: '太厉害了', icon: '🏆', color: 'var(--green)' }
    if (score >= 70) return { cls: 'good', text: '表现不错', icon: '👏', color: 'var(--gold)' }
    if (score >= 60) return { cls: 'good', text: '顺利通过', icon: '👍', color: 'var(--gold)' }
    return { cls: 'fail', text: '继续加油', icon: '💪', color: 'var(--red)' }
  }

  const level = getLevel()

  return (
    <div className="result-card">
      {/* 头部 */}
      <div className="res-header">
        <div className={`res-ring ${level.cls}`}>
          <span className="res-score" style={{ color: level.color }}>{score}</span>
          <span className="res-unit">分</span>
        </div>
        <div className="res-info">
          <div className="res-name">{user.name} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>{user.employeeId}</span></div>
          <div className="res-grade" style={{ color: level.color }}>{level.icon} {level.text}</div>
          <div className="res-count">
            <span className="res-ok">答对 {correct}</span>
            <span className="res-divider">|</span>
            <span className="res-err">答错 {total - correct}</span>
          </div>
        </div>
      </div>

      {/* 题目详情 */}
      <div className="res-list">
        {details.map((d, i) => {
          const userText = (d.options && d.options[d.userAnswer]) || idxToLetter(d.userAnswer)
          const correctText = (d.options && d.options[d.correctAnswer]) || idxToLetter(d.correctAnswer)
          return (
            <div key={i} className={'res-item ' + (d.correct ? 'res-item-ok' : 'res-item-err')}>
              <div className="res-q">
                <span className="res-q-num">{i + 1}.</span>
                <span className="res-q-text">{d.question}</span>
              </div>
              <div className="res-a">
                {d.correct ? (
                  <span className="res-a-ok">正确答案：{idxToLetter(d.correctAnswer)}. {correctText}</span>
                ) : (
                  <>
                    <span className="res-a-user">你的答案：{idxToLetter(d.userAnswer)}. {userText}</span>
                    <span className="res-a-correct">正确答案：{idxToLetter(d.correctAnswer)}. {correctText}</span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 底部 */}
      <div className="res-bottom">
        <a
          href="https://mp.weixin.qq.com/s/your-activity-post"
          target="_blank"
          rel="noopener noreferrer"
          className="activity-link-card"
        >
          <span className="activity-link-icon">📢</span>
          <span className="activity-link-text">
            <span className="activity-link-title">查看活动详情</span>
            <span className="activity-link-sub">了解奖品领取方式</span>
          </span>
          <span className="activity-link-arrow">→</span>
        </a>
        <button className="btn btn-primary" onClick={onRetry}>重新答题</button>
      </div>
    </div>
  )
}

// ===== 主 App =====
export default function App() {
  const [page, setPage] = useState('loading')
  const [user, setUser] = useState(null)
  const [questions, setQuestions] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const loadQuestions = useCallback(async (skipLogin) => {
    setPage('loading')
    setError('')
    try {
      const res = await fetch(`${API_BASE}/questions`)
      if (!res.ok) throw new Error('加载失败')
      const data = await res.json()
      setQuestions(data.questions)
      setPage(skipLogin ? 'quiz' : 'login')
    } catch {
      setError('无法连接服务器，请确认后端已启动')
      setPage('error')
    }
  }, [])

  useEffect(() => { loadQuestions(false) }, [loadQuestions])

  const handleStart = (userInfo) => {
    setUser(userInfo)
    setResult(null)
    setPage('quiz')
  }

  const handleSubmit = async (answers) => {
    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, employeeId: user.employeeId, answers }),
      })
      if (!res.ok) throw new Error('提交失败')
      const data = await res.json()
      setResult(data)
      setPage('result')
    } catch {
      setError('提交失败，请重试')
    }
  }

  const handleRetry = () => {
    setResult(null)
    setQuestions([])
    loadQuestions(true)
  }

  return (
    <>
      <div className="scan-line" />
      <div className="app-container" style={{ paddingTop: page === 'result' ? 0 : 380, justifyContent: page === 'result' ? 'center' : 'flex-start', minHeight: page === 'result' ? '100vh' : 'auto' }}>
        {page !== 'result' && (
          <header className="app-header">
            <h1>【"棕"横NetAICore 智赢端午好礼-活动2】答题赢好礼</h1>
            <div className="subtitle">RETRIEVAL-AUGMENTED GENERATION · 端午安康</div>
          </header>
        )}

        {page === 'loading' && (
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-text">系统初始化中...</div>
          </div>
        )}

        {page === 'error' && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="msg-err">{error}</div>
            <button className="btn btn-primary" onClick={() => loadQuestions(false)}>重试</button>
          </div>
        )}

        {page === 'login' && <LoginPage onStart={handleStart} />}
        {page === 'quiz' && <QuizPage user={user} questions={questions} onSubmit={handleSubmit} />}
        {page === 'result' && <ResultPage user={user} result={result} onRetry={handleRetry} />}
      </div>
    </>
  )
}
