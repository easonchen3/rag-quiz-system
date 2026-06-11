// PM2 进程管理配置
module.exports = {
  apps: [
    {
      name: "rag-quiz-backend",
      script: "./backend/server.js",
      cwd: "/opt/rag-quiz",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      autorestart: true,
      max_restarts: 10,
      max_memory_restart: "256M",
      restart_delay: 3000
    }
  ]
};
