import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// 调试：检查环境变量
console.log('DASHSCOPE_API_KEY:', process.env.DASHSCOPE_API_KEY ? '已设置' : '未设置');
console.log('PORT:', process.env.PORT || 3001);

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
});

// 图像识别API
app.post('/api/recognize-food', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: '请提供图片数据' });
    }

    // 调用通义千问VL模型进行图像识别
    const completion = await openai.chat.completions.create({
      model: "qwen-vl-plus",
      messages: [
        {
          role: "system",
          content: `你是一个专业的营养师和食物识别专家。请分析用户上传的食物图片，并返回以下信息的JSON格式：

{
  "food": "食物名称",
  "calories": 热量数值,
  "protein": 蛋白质含量(g),
  "gi": GI值,
  "gi_explanation": "GI值简单解释",
  "suggestions": ["建议1", "建议2", "建议3"]
}

要求：
1. 准确识别食物名称
2. 估算合理的热量值（卡路里）
3. 估算蛋白质含量（克）
4. 提供GI值（血糖指数，0-100）
5. 简单解释什么是GI值
6. 提供3条营养建议

请严格按照JSON格式返回，不要包含其他文字。`
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image
              }
            },
            {
              type: "text",
              text: "请识别这张图片中的食物，并提供详细的营养信息。"
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('识别错误:', error);
    res.status(500).json({ 
      success: false,
      error: '图像识别失败，请重试' 
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
