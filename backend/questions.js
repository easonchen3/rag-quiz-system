// RAG 知识题库 - 50道简单题 + 30道难题
// easy: 简单题, hard: 难题

const questions = [
  // ==================== 简单题 (50道) ====================
  // --- 基础概念 (1-10) ---
  {
    id: 1,
    difficulty: "easy",
    question: "RAG 的全称是什么？",
    options: [
      "Retrieval-Augmented Generation",
      "Random Access Generation",
      "Recurrent Attention Gateway",
      "Reinforced Adaptive Generation"
    ],
    answer: 0
  },
  {
    id: 2,
    difficulty: "easy",
    question: "RAG 架构主要由哪两部分组成？",
    options: [
      "检索模块 + 生成模块",
      "编码器 + 解码器",
      "训练模块 + 推理模块",
      "嵌入模块 + 分类模块"
    ],
    answer: 0
  },
  {
    id: 3,
    difficulty: "easy",
    question: "RAG 技术主要解决大语言模型的什么问题？",
    options: [
      "知识截断和幻觉问题",
      "模型训练速度慢",
      "模型参数量过大",
      "推理成本过高"
    ],
    answer: 0
  },
  {
    id: 4,
    difficulty: "easy",
    question: "在 RAG 流程中，检索模块的主要作用是什么？",
    options: [
      "从知识库中找到与查询最相关的文档片段",
      "生成最终的回答文本",
      "对用户输入进行语法检查",
      "压缩模型参数"
    ],
    answer: 0
  },
  {
    id: 5,
    difficulty: "easy",
    question: "RAG 与传统的纯生成式 LLM 最大的区别是什么？",
    options: [
      "RAG 会先检索外部知识再生成回答",
      "RAG 使用更小的模型",
      "RAG 不需要训练数据",
      "RAG 只能处理英文"
    ],
    answer: 0
  },
  {
    id: 6,
    difficulty: "easy",
    question: "以下哪个是 RAG 架构的核心优势？",
    options: [
      "能够引用外部知识，减少幻觉",
      "推理速度比传统 LLM 快 10 倍",
      "不需要任何硬件资源",
      "可以完全替代模型训练"
    ],
    answer: 0
  },
  {
    id: 7,
    difficulty: "easy",
    question: "RAG 流程中，「检索」发生在哪个阶段？",
    options: [
      "生成回答之前",
      "生成回答之后",
      "生成回答的同时",
      "与生成回答无关"
    ],
    answer: 0
  },
  {
    id: 8,
    difficulty: "easy",
    question: "RAG 系统中，知识库通常以什么形式存储？",
    options: [
      "文档片段/Chunk",
      "完整的原始文档",
      "关系型数据库表",
      "CSV 文件"
    ],
    answer: 0
  },
  {
    id: 9,
    difficulty: "easy",
    question: "什么是「幻觉」(Hallucination) 问题？",
    options: [
      "模型生成看似合理但实际错误的内容",
      "模型运行时 GPU 发热",
      "模型无法理解图像",
      "模型训练时出现过拟合"
    ],
    answer: 0
  },
  {
    id: 10,
    difficulty: "easy",
    question: "RAG 能否帮助 LLM 回答训练数据截止日期之后的问题？",
    options: [
      "可以，通过检索最新的外部知识",
      "不可以，LLM 的知识无法更新",
      "只能回答训练数据内的问题",
      "需要重新训练模型才能回答"
    ],
    answer: 0
  },
  // --- 向量数据库基础 (11-20) ---
  {
    id: 11,
    difficulty: "easy",
    question: "向量数据库在 RAG 中的主要作用是什么？",
    options: [
      "存储和检索文档的向量表示",
      "存储用户登录信息",
      "管理模型训练参数",
      "渲染前端页面"
    ],
    answer: 0
  },
  {
    id: 12,
    difficulty: "easy",
    question: "以下哪个不是常见的向量数据库？",
    options: [
      "MySQL",
      "Milvus",
      "Pinecone",
      "Chroma"
    ],
    answer: 0
  },
  {
    id: 13,
    difficulty: "easy",
    question: "向量数据库中「相似度检索」通常基于什么度量？",
    options: [
      "余弦相似度或欧氏距离",
      "字符串精确匹配",
      "哈希碰撞率",
      "正则表达式匹配"
    ],
    answer: 0
  },
  {
    id: 14,
    difficulty: "easy",
    question: "Chroma 是什么？",
    options: [
      "一个开源的向量数据库",
      "一种新的编程语言",
      "一个前端框架",
      "一种加密算法"
    ],
    answer: 0
  },
  {
    id: 15,
    difficulty: "easy",
    question: "在向量检索中，Top-K 指的是什么？",
    options: [
      "返回相似度最高的 K 个结果",
      "向量维度为 K",
      "数据库中有 K 个集合",
      "需要 K 次查询"
    ],
    answer: 0
  },
  {
    id: 16,
    difficulty: "easy",
    question: "Milvus 主要应用于什么场景？",
    options: [
      "大规模向量相似度检索",
      "前端页面渲染",
      "文件系统管理",
      "网络流量监控"
    ],
    answer: 0
  },
  {
    id: 17,
    difficulty: "easy",
    question: "Pinecone 的主要特点是？",
    options: [
      "全托管的云端向量数据库服务",
      "本地文件存储系统",
      "开源的关系型数据库",
      "前端 UI 组件库"
    ],
    answer: 0
  },
  {
    id: 18,
    difficulty: "easy",
    question: "向量数据库中的「索引」主要用于什么？",
    options: [
      "加速向量相似度搜索",
      "存储原始文档内容",
      "管理用户权限",
      "生成随机向量"
    ],
    answer: 0
  },
  {
    id: 19,
    difficulty: "easy",
    question: "FAISS 是由哪个公司开源的向量检索库？",
    options: [
      "Meta (Facebook)",
      "Google",
      "Microsoft",
      "Amazon"
    ],
    answer: 0
  },
  {
    id: 20,
    difficulty: "easy",
    question: "向量检索中，ANN 是什么意思？",
    options: [
      "近似最近邻 (Approximate Nearest Neighbor)",
      "人工神经网络 (Artificial Neural Network)",
      "自动归一化 (Auto Normalization)",
      "异步通知网络 (Async Notification Network)"
    ],
    answer: 0
  },
  // --- 嵌入 (Embedding) 基础 (21-30) ---
  {
    id: 21,
    difficulty: "easy",
    question: "Embedding（嵌入）的作用是什么？",
    options: [
      "将文本转换为固定维度的向量表示",
      "压缩图片文件大小",
      "加密用户密码",
      "加速网络传输"
    ],
    answer: 0
  },
  {
    id: 22,
    difficulty: "easy",
    question: "以下哪个是常见的 Embedding 模型？",
    options: [
      "text-embedding-ada-002",
      "GPT-4-Vision",
      "Stable Diffusion",
      "Whisper"
    ],
    answer: 0
  },
  {
    id: 23,
    difficulty: "easy",
    question: "语义相似的文本，其向量表示通常有什么特征？",
    options: [
      "在向量空间中距离较近",
      "在向量空间中距离较远",
      "向量长度完全相同",
      "向量全部为零"
    ],
    answer: 0
  },
  {
    id: 24,
    difficulty: "easy",
    question: "Embedding 向量的维度通常是多少？",
    options: [
      "几百到几千维",
      "1-10 维",
      "上百万维",
      "无限维"
    ],
    answer: 0
  },
  {
    id: 25,
    difficulty: "easy",
    question: "OpenAI 的 text-embedding-ada-002 输出多少维向量？",
    options: [
      "1536 维",
      "768 维",
      "512 维",
      "4096 维"
    ],
    answer: 0
  },
  {
    id: 26,
    difficulty: "easy",
    question: "使用 Embedding 模型时，输入文本的长度是否有限制？",
    options: [
      "有，通常有最大 token 限制",
      "没有，可以输入任意长度",
      "只能输入单个单词",
      "只能输入英文"
    ],
    answer: 0
  },
  {
    id: 27,
    difficulty: "easy",
    question: "BGE Embedding 是由哪个机构开源的？",
    options: [
      "BAAI（北京智源人工智能研究院）",
      "OpenAI",
      "Google",
      "Meta"
    ],
    answer: 0
  },
  {
    id: 28,
    difficulty: "easy",
    question: "Embedding 模型通常使用什么方法来训练？",
    options: [
      "对比学习 (Contrastive Learning)",
      "监督分类",
      "强化学习",
      "决策树"
    ],
    answer: 0
  },
  {
    id: 29,
    difficulty: "easy",
    question: "多语言 Embedding 模型能做什么？",
    options: [
      "将不同语言的文本映射到同一个向量空间",
      "自动翻译所有语言",
      "只处理英文文本",
      "生成图像向量"
    ],
    answer: 0
  },
  {
    id: 30,
    difficulty: "easy",
    question: "为什么 Embedding 在 RAG 中很重要？",
    options: [
      "它实现了语义级别的检索，而非关键词匹配",
      "它让模型运行更快",
      "它减少了模型参数数量",
      "它替代了整个 LLM"
    ],
    answer: 0
  },
  // --- 文档分块 (Chunking) 基础 (31-40) ---
  {
    id: 31,
    difficulty: "easy",
    question: "在 RAG 中，「Chunking」指的是什么？",
    options: [
      "将长文档切分成较小的片段",
      "将多个文档合并为一个",
      "将图片转换为文本",
      "将音频转为文字"
    ],
    answer: 0
  },
  {
    id: 32,
    difficulty: "easy",
    question: "文档分块的常见大小是多少？",
    options: [
      "256-1024 tokens",
      "1-10 tokens",
      "10000-50000 tokens",
      "无限制"
    ],
    answer: 0
  },
  {
    id: 33,
    difficulty: "easy",
    question: "Chunk Overlap（分块重叠）的作用是什么？",
    options: [
      "避免上下文在分块边界处断裂",
      "增加存储空间使用",
      "减少向量维度",
      "加速检索速度"
    ],
    answer: 0
  },
  {
    id: 34,
    difficulty: "easy",
    question: "文档分块太小可能导致什么问题？",
    options: [
      "丢失上下文信息",
      "检索速度变慢",
      "向量维度增加",
      "存储成本降低"
    ],
    answer: 0
  },
  {
    id: 35,
    difficulty: "easy",
    question: "文档分块太大可能导致什么问题？",
    options: [
      "检索精度下降，引入噪声",
      "向量维度降低",
      "检索速度变快",
      "无需 Embedding"
    ],
    answer: 0
  },
  {
    id: 36,
    difficulty: "easy",
    question: "常见的 Chunking 策略不包括？",
    options: [
      "随机删除文本",
      "固定长度切分",
      "基于段落的切分",
      "语义切分"
    ],
    answer: 0
  },
  {
    id: 37,
    difficulty: "easy",
    question: "LangChain 中用于文本分割的模块是什么？",
    options: [
      "Text Splitters",
      "Vector Stores",
      "Chains",
      "Agents"
    ],
    answer: 0
  },
  {
    id: 38,
    difficulty: "easy",
    question: "RecursiveCharacterTextSplitter 的切分逻辑是什么？",
    options: [
      "按优先级依次尝试分隔符进行递归切分",
      "随机选择切分位置",
      "只按字符数切分",
      "只按单词切分"
    ],
    answer: 0
  },
  {
    id: 39,
    difficulty: "easy",
    question: "语义分块 (Semantic Chunking) 与固定大小分块的主要区别？",
    options: [
      "语义分块根据文本的语义边界进行切分",
      "语义分块总是产生更小的块",
      "语义分块不需要 Embedding",
      "语义分块只适用于英文"
    ],
    answer: 0
  },
  {
    id: 40,
    difficulty: "easy",
    question: "文档分块后，下一步通常是什么？",
    options: [
      "对每个分块生成 Embedding 并存入向量数据库",
      "直接输入 LLM",
      "删除原始文档",
      "进行模型训练"
    ],
    answer: 0
  },
  // --- RAG 框架与工具 (41-50) ---
  {
    id: 41,
    difficulty: "easy",
    question: "LangChain 是什么？",
    options: [
      "一个用于构建 LLM 应用的开源框架",
      "一种编程语言",
      "一个数据库系统",
      "一个前端框架"
    ],
    answer: 0
  },
  {
    id: 42,
    difficulty: "easy",
    question: "LlamaIndex 主要用于什么场景？",
    options: [
      "构建 RAG 应用的数据索引和检索",
      "训练大语言模型",
      "图像识别",
      "音频处理"
    ],
    answer: 0
  },
  {
    id: 43,
    difficulty: "easy",
    question: "以下哪个不是常见的 RAG 开发框架？",
    options: [
      "React.js",
      "LangChain",
      "LlamaIndex",
      "Haystack"
    ],
    answer: 0
  },
  {
    id: 44,
    difficulty: "easy",
    question: "LangChain 中，Agent 的概念是什么？",
    options: [
      "能够根据任务动态选择工具和行动的智能体",
      "数据库连接器",
      "前端渲染组件",
      "日志记录器"
    ],
    answer: 0
  },
  {
    id: 45,
    difficulty: "easy",
    question: "RAG 系统的典型工作流程第一步是什么？",
    options: [
      "加载和预处理文档",
      "生成最终答案",
      "部署到生产环境",
      "训练 Embedding 模型"
    ],
    answer: 0
  },
  {
    id: 46,
    difficulty: "easy",
    question: "在 LangChain 中，「Chain」的主要作用是什么？",
    options: [
      "将多个步骤串联成完整的工作流",
      "存储向量数据",
      "管理 API 密钥",
      "处理图像输入"
    ],
    answer: 0
  },
  {
    id: 47,
    difficulty: "easy",
    question: "HuggingFace 的 Sentence-Transformers 库主要用于什么？",
    options: [
      "生成文本的句子级 Embedding",
      "训练大语言模型",
      "图像分类",
      "语音识别"
    ],
    answer: 0
  },
  {
    id: 48,
    difficulty: "easy",
    question: "RAG 系统使用哪种类型的 Prompt？",
    options: [
      "包含检索到的上下文信息的 Prompt",
      "空白的 Prompt",
      "只有问题的 Prompt",
      "随机生成的 Prompt"
    ],
    answer: 0
  },
  {
    id: 49,
    difficulty: "easy",
    question: "RAG 的检索结果通常以什么形式传给 LLM？",
    options: [
      "作为 Prompt 上下文的一部分",
      "作为模型参数的一部分",
      "作为 API 请求头",
      "作为数据库查询语句"
    ],
    answer: 0
  },
  {
    id: 50,
    difficulty: "easy",
    question: "构建 RAG 应用的第一步通常是什么？",
    options: [
      "准备知识库文档并建立索引",
      "直接写 Prompt",
      "训练 LLM 模型",
      "购买 GPU 服务器"
    ],
    answer: 0
  },

  // ==================== 难题 (30道) ====================
  // --- 高级检索策略 (1-10) ---
  {
    id: 51,
    difficulty: "hard",
    question: "在 RAG 中，HyDE (Hypothetical Document Embeddings) 策略的核心思想是什么？",
    options: [
      "先让 LLM 生成假设性答案，再用该答案的 Embedding 去检索",
      "使用混合精度进行 Embedding 计算",
      "将多个文档合并为一个进行检索",
      "对检索结果进行随机扰动"
    ],
    answer: 0
  },
  {
    id: 52,
    difficulty: "hard",
    question: "Multi-Query Retrieval 策略如何提升检索效果？",
    options: [
      "从不同角度生成多个查询变体，分别检索后合并结果",
      "同时对多个数据库执行查询",
      "在一个查询中包含多个问题",
      "多次重复相同的查询取平均结果"
    ],
    answer: 0
  },
  {
    id: 53,
    difficulty: "hard",
    question: "Re-ranking（重排序）在 RAG 中的作用是什么？",
    options: [
      "对初步检索结果进行精细排序，提高最相关文档的排名",
      "重新训练 Embedding 模型",
      "重新生成所有文档的 Embedding",
      "对问题进行改写"
    ],
    answer: 0
  },
  {
    id: 54,
    difficulty: "hard",
    question: "Cross-Encoder 与 Bi-Encoder 在检索中的主要区别是什么？",
    options: [
      "Cross-Encoder 同时对查询和文档进行联合编码，精度更高但速度慢；Bi-Encoder 分别编码，速度快",
      "Cross-Encoder 只能处理英文",
      "Bi-Encoder 不生成 Embedding",
      "两者没有本质区别"
    ],
    answer: 0
  },
  {
    id: 55,
    difficulty: "hard",
    question: "Self-RAG 的核心创新点是什么？",
    options: [
      "让 LLM 在生成过程中自我评估是否需要检索，并对检索内容进行反思",
      "完全不需要外部知识库",
      "使用自监督学习训练检索器",
      "检索器与生成器使用相同的模型参数"
    ],
    answer: 0
  },
  {
    id: 56,
    difficulty: "hard",
    question: "RAPTOR 论文提出的文档索引方法是什么？",
    options: [
      "递归地对文档进行摘要聚类，构建树状层级索引",
      "使用扁平化的向量索引",
      "直接将所有文档拼接成一个长文本",
      "随机采样文档片段"
    ],
    answer: 0
  },
  {
    id: 57,
    difficulty: "hard",
    question: "在 RAG 检索中，什么是「Late Interaction」方法？",
    options: [
      "在检索的最后阶段计算查询和文档 Token 级别的交互，如 ColBERT 模型",
      "用户与系统交互延迟进行",
      "推迟 Embedding 的计算时间",
      "分批处理文档"
    ],
    answer: 0
  },
  {
    id: 58,
    difficulty: "hard",
    question: "查询重写 (Query Rewriting) 在 RAG 中的主要目的是什么？",
    options: [
      "将用户的原始查询优化为更适合检索的形式",
      "修改用户的个人信息",
      "更改数据库结构",
      "重新训练检索模型"
    ],
    answer: 0
  },
  {
    id: 59,
    difficulty: "hard",
    question: "BM25 与 Dense Retrieval 相比，在什么场景下可能更有优势？",
    options: [
      "对精确关键词匹配要求高的领域（如法律、医疗术语）",
      "对所有类型的查询都更有优势",
      "需要理解语义相似性的场景",
      "处理多语言文档时"
    ],
    answer: 0
  },
  {
    id: 60,
    difficulty: "hard",
    question: "混合检索 (Hybrid Search) 的典型做法是什么？",
    options: [
      "结合稀疏检索 (BM25) 和稠密检索 (Embedding) 的结果进行融合",
      "同时使用多个 LLM 生成答案",
      "混合使用不同的 Chunk 大小",
      "在训练和推理阶段使用不同的模型"
    ],
    answer: 0
  },
  // --- 高级分块与嵌入 (11-20) ---
  {
    id: 61,
    difficulty: "hard",
    question: "Sentence Window Retrieval 与标准分块检索的主要区别是什么？",
    options: [
      "检索时用小分块匹配，但返回时带回周围上下文的窗口",
      "只检索单个句子",
      "不使用 Embedding",
      "检索结果随机排列"
    ],
    answer: 0
  },
  {
    id: 62,
    difficulty: "hard",
    question: "Parent Document Retriever 的工作原理是什么？",
    options: [
      "先用小分块检索，再返回对应的大分块（父文档）作为上下文",
      "只检索原始文档的标题",
      "对文档进行随机抽样",
      "使用父进程检索文档"
    ],
    answer: 0
  },
  {
    id: 63,
    difficulty: "hard",
    question: "Matryoshka Embedding 的主要优势是什么？",
    options: [
      "支持灵活截断向量维度而不过多损失性能，适应不同存储需求",
      "生成更高维度的向量",
      "只能用于图像处理",
      "需要更长的训练时间"
    ],
    answer: 0
  },
  {
    id: 64,
    difficulty: "hard",
    question: "在 RAG 中，Contextual Retrieval（上下文检索）技术是如何工作的？",
    options: [
      "在 Embedding 时为每个 Chunk 添加文档级别的上下文描述前缀",
      "根据用户地理位置选择知识库",
      "在检索时随机添加噪声",
      "只使用文档标题进行检索"
    ],
    answer: 0
  },
  {
    id: 65,
    difficulty: "hard",
    question: "ColBERT 的「Late Interaction」机制具体指什么？",
    options: [
      "在检索阶段使用 MaxSim 操作计算查询和文档 Token 级相似度",
      "用户与系统的后期交互",
      "延迟加载 Embedding 模型",
      "批量处理检索请求"
    ],
    answer: 0
  },
  {
    id: 66,
    difficulty: "hard",
    question: "Multi-Vector Retrieval 相比 Single-Vector 有什么优势？",
    options: [
      "为每个文档生成多个向量表示，能捕获更细粒度的语义信息",
      "减少存储空间",
      "简化系统架构",
      "提高训练速度"
    ],
    answer: 0
  },
  {
    id: 67,
    difficulty: "hard",
    question: "Adaptive RAG 的核心思想是什么？",
    options: [
      "根据查询的复杂度动态选择检索策略",
      "使用固定的检索参数",
      "不进行检索直接生成答案",
      "每次随机选择检索方式"
    ],
    answer: 0
  },
  {
    id: 68,
    difficulty: "hard",
    question: "Graph RAG 与传统 RAG 的主要区别是什么？",
    options: [
      "Graph RAG 使用知识图谱的结构化关系来增强检索",
      "Graph RAG 只能回答图论问题",
      "Graph RAG 不需要 Embedding",
      "Graph RAG 使用 GPU 渲染图形"
    ],
    answer: 0
  },
  {
    id: 69,
    difficulty: "hard",
    question: "在 RAG 中，Fusion Retrieval（融合检索）通常指什么？",
    options: [
      "使用 Reciprocal Rank Fusion 等方法合并多个检索源的结果",
      "将检索结果直接拼接",
      "随机选择检索源",
      "只使用一个检索源"
    ],
    answer: 0
  },
  {
    id: 70,
    difficulty: "hard",
    question: "LLM-Augmented Retrieval 的含义是什么？",
    options: [
      "在检索阶段利用 LLM 的能力来增强检索效果（如查询扩展、文档理解）",
      "用 LLM 替代向量数据库",
      "用 LLM 替代 Embedding 模型",
      "完全不需要检索的 LLM 应用"
    ],
    answer: 0
  },
  // --- RAG 评估与优化 (21-30) ---
  {
    id: 71,
    difficulty: "hard",
    question: "RAGAS 框架主要用于什么？",
    options: [
      "评估 RAG 系统的性能指标（忠实度、相关性、上下文精度等）",
      "加速 RAG 系统的推理速度",
      "生成训练用的 Embedding 数据",
      "替代向量数据库"
    ],
    answer: 0
  },
  {
    id: 72,
    difficulty: "hard",
    question: "在 RAG 评估中，Faithfulness（忠实度）指的是什么？",
    options: [
      "生成的答案是否完全基于检索到的上下文，而非模型自身知识",
      "答案的语法是否正确",
      "答案的长度是否合适",
      "检索速度是否够快"
    ],
    answer: 0
  },
  {
    id: 73,
    difficulty: "hard",
    question: "RAG 评估中的 Context Recall（上下文召回率）衡量什么？",
    options: [
      "检索到的上下文覆盖了参考答案中多少信息",
      "检索速度有多快",
      "用户满意度评分",
      "系统正常运行时间"
    ],
    answer: 0
  },
  {
    id: 74,
    difficulty: "hard",
    question: "什么情况下 RAG 系统可能出现「Lost in the Middle」问题？",
    options: [
      "当检索到的上下文过长时，LLM 倾向于忽略中间部分的信息",
      "系统部署在数据中心时",
      "使用中等大小的 Chunk 时",
      "用户输入过短时"
    ],
    answer: 0
  },
  {
    id: 75,
    difficulty: "hard",
    question: "RAG 的 Context Relevance（上下文相关性）指标的评估对象是什么？",
    options: [
      "检索到的文档片段与查询的相关程度",
      "生成答案的流畅度",
      "系统的响应时间",
      "用户的满意度"
    ],
    answer: 0
  },
  {
    id: 76,
    difficulty: "hard",
    question: "在 RAG 中，如何进行 Effective Chunk Size 的调优？",
    options: [
      "通过实验评估不同 Chunk 大小对检索和生成质量的影响，找到最佳平衡点",
      "永远使用最大的 Chunk 大小",
      "永远使用最小的 Chunk 大小",
      "随机选择 Chunk 大小"
    ],
    answer: 0
  },
  {
    id: 77,
    difficulty: "hard",
    question: "RAG 系统中，Answer Correctness 评估通常需要什么？",
    options: [
      "参考答案 (Ground Truth) 作为对比基准",
      "GPU 服务器",
      "用户的个人信息",
      "实时网络连接"
    ],
    answer: 0
  },
  {
    id: 78,
    difficulty: "hard",
    question: "RAG 系统中「检索噪声」指的是什么？",
    options: [
      "检索到的不相关或低质量文档片段",
      "数据库的读写噪声",
      "模型训练时的梯度噪声",
      "网络传输中的数据丢失"
    ],
    answer: 0
  },
  {
    id: 79,
    difficulty: "hard",
    question: "在 RAG 中如何缓解检索噪声对生成质量的负面影响？",
    options: [
      "使用 Re-ranking 和过滤机制，增强 Prompt 指令对噪声的鲁棒性",
      "完全不使用检索",
      "增加噪声文档的数量",
      "减少 Chunk 大小到 1 token"
    ],
    answer: 0
  },
  {
    id: 80,
    difficulty: "hard",
    question: "RAG 系统中，如何平衡检索精度和召回率？",
    options: [
      "通过调整 Top-K、相似度阈值、混合检索权重等参数来平衡",
      "只关注精度，忽略召回率",
      "只关注召回率，忽略精度",
      "精度和召回率无法同时优化"
    ],
    answer: 0
  }
];

module.exports = questions;
