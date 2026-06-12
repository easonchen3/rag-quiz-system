const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { DatabaseSync } = require("node:sqlite");
const questions = require("./questions");

// 启动时随机化题库中所有题目的正确答案位置（避免答案集中在某个选项）
questions.forEach((q) => {
  const newAnswer = Math.floor(Math.random() * 4);
  if (newAnswer !== q.answer) {
    const tmp = q.options[q.answer];
    q.options[q.answer] = q.options[newAnswer];
    q.options[newAnswer] = tmp;
    q.answer = newAnswer;
  }
});

// 打印答案分布验证
const dist = { 0: 0, 1: 0, 2: 0, 3: 0 };
questions.forEach((q) => dist[q.answer]++);
console.log(`[RAG Quiz] 题库答案分布: A=${dist[0]} B=${dist[1]} C=${dist[2]} D=${dist[3]}`);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

// SQLite via Node.js 内置 sqlite 模块 (WAL 模式支持高并发读写)
const db = new DatabaseSync(path.join(DATA_DIR, "quiz.db"));
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA busy_timeout = 5000");

db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    answers TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    details TEXT NOT NULL,
    submitted_at TEXT NOT NULL
  )
`);

const insertStmt = db.prepare(
  "INSERT INTO results (name, employee_id, answers, score, total, details, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
);
const selectAllStmt = db.prepare("SELECT * FROM results ORDER BY id DESC");

// 随机抽取题目（选项随机打乱，正确答案位置随机）
app.get("/api/questions", (req, res) => {
  const easyQuestions = questions.filter((q) => q.difficulty === "easy");
  const mediumQuestions = questions.filter((q) => q.difficulty === "medium");
  const hardQuestions = questions.filter((q) => q.difficulty === "hard");

  const shuffledEasy = [...easyQuestions].sort(() => Math.random() - 0.5);
  const shuffledMedium = [...mediumQuestions].sort(() => Math.random() - 0.5);
  const shuffledHard = [...hardQuestions].sort(() => Math.random() - 0.5);

  const selected = [
    ...shuffledEasy.slice(0, 5),
    ...shuffledMedium.slice(0, 2),
    ...shuffledHard.slice(0, 3),
  ].sort(() => Math.random() - 0.5);

  const safeQuestions = selected.map((q) => {
    // 选项随机打乱
    const origIndices = [0, 1, 2, 3];
    const shuffledIndices = [...origIndices].sort(() => Math.random() - 0.5);
    const shuffledOptions = shuffledIndices.map((i) => q.options[i]);
    const newAnswerIndex = shuffledIndices.indexOf(q.answer);

    return {
      id: q.id,
      difficulty: q.difficulty,
      question: q.question,
      options: shuffledOptions,
      _a: newAnswerIndex, // 打乱后正确答案的位置，客户端原样回传
    };
  });

  res.json({ questions: safeQuestions, total: safeQuestions.length });
});

// 提交答案
app.post("/api/submit", (req, res) => {
  const { name, employeeId, answers } = req.body;

  if (!name || !employeeId || !answers) {
    return res.status(400).json({ error: "缺少必要信息" });
  }

  let score = 0;
  const details = [];
  const answerMap = {};

  answers.forEach((ans) => {
    const question = questions.find((q) => q.id === ans.questionId);
    if (question && typeof ans._a === "number") {
      const correct = ans.selectedOption === ans._a;
      if (correct) score++;
      details.push({
        questionId: question.id,
        question: question.question,
        options: ans.options || [],
        userAnswer: ans.selectedOption,
        correctAnswer: ans._a,
        correct,
      });
    }
    answerMap[ans.questionId] = ans.selectedOption;
  });

  const total = answers.length;
  const finalScore = Math.round((score / total) * 100);
  const submittedAt = new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });

  try {
    insertStmt.run(name, employeeId, JSON.stringify(answerMap), finalScore, total, JSON.stringify(details), submittedAt);

    res.json({
      success: true,
      score: finalScore,
      correct: score,
      total,
      details,
    });
  } catch (err) {
    console.error("保存结果失败:", err);
    res.status(500).json({ error: "保存结果失败" });
  }
});

// 查看所有结果
app.get("/api/results", (req, res) => {
  const rows = selectAllStmt.all();
  res.json(rows);
});

// 排行榜：每人取最高分，同分则取最早提交，按分数降序+时间升序
function getLeaderboard() {
  const all = selectAllStmt.all();
  const best = new Map();
  all.forEach((r) => {
    const existing = best.get(r.employee_id);
    if (!existing || r.score > existing.score || (r.score === existing.score && r.id < existing.id)) {
      best.set(r.employee_id, r);
    }
  });
  return Array.from(best.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.id - b.id;
  });
}

// 查询某人最高成绩
app.get("/api/best/:employeeId", (req, res) => {
  const rows = selectAllStmt.all().filter((r) => r.employee_id === req.params.employeeId);
  if (rows.length === 0) return res.json(null);
  const best = rows.reduce((a, b) => (b.score > a.score || (b.score === a.score && b.id < a.id) ? b : a));
  res.json(best);
});

// 排行榜 JSON
app.get("/api/leaderboard", (req, res) => {
  res.json(getLeaderboard());
});

// 排行榜 CSV 导出
app.get("/api/leaderboard/export", (req, res) => {
  const rows = getLeaderboard();
  const header = "rank,name,employee_id,score,submitted_at\n";
  const csv = rows
    .map((r, i) => `${i + 1},"${r.name}","${r.employee_id}",${r.score},"${r.submitted_at}"`)
    .join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=rag-quiz-leaderboard.csv");
  res.send("﻿" + header + csv);
});

// 清除所有结果
app.delete("/api/results", (req, res) => {
  db.exec("DELETE FROM results");
  res.json({ success: true, message: "所有结果已清除" });
});

// 健康检查
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[RAG Quiz] Server running on http://localhost:${PORT}`);
});
