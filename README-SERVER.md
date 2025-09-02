# Foodie Sight 后端服务器

## 环境配置

1. 复制环境变量配置文件：
```bash
cp env.example .env
```

2. 编辑 `.env` 文件，添加你的通义千问API密钥：
```
DASHSCOPE_API_KEY=your_dashscope_api_key_here
PORT=3001
```

## 安装依赖

```bash
npm install
```

## 启动服务器

### 开发模式（自动重启）
```bash
npm run server:dev
```

### 生产模式
```bash
npm run server
```

## API接口

### 图像识别接口
- **URL**: `POST /api/recognize-food`
- **请求体**:
```json
{
  "image": "data:image/jpeg;base64,..."
}
```
- **响应**:
```json
{
  "success": true,
  "data": {
    "food": "食物名称",
    "calories": 520,
    "protein": 38,
    "gi": 45,
    "gi_explanation": "GI值简单解释",
    "suggestions": ["建议1", "建议2", "建议3"]
  }
}
```

### 健康检查接口
- **URL**: `GET /api/health`
- **响应**:
```json
{
  "status": "OK",
  "message": "服务器运行正常"
}
```

## 启动完整应用

1. 启动后端服务器：
```bash
npm run server:dev
```

2. 启动前端开发服务器：
```bash
npm run dev
```

访问 http://localhost:5173 使用应用。
