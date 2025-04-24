# 消息发送管理系统

一个用于管理和发送不同类型消息的 Web 应用。

## 功能特点

- 支持多种消息类型：
  - 卡片消息
  - 文本消息
  - 批量文本消息
- 预设接收者群组管理
- 默认发送者配置
- 友好的用户界面

## 快速部署

### 方法一：使用 Node.js 开发服务器

1. 确保已安装 Node.js (建议版本 14.0.0 或更高)

2. 克隆项目并安装依赖：
```bash
git clone [项目地址]
cd [项目目录]
npm install
```

3. 修改配置文件 `src/config/defaults.json`：
```json
{
  "sender": {
    "wxid": "您的发送者ID"
  },
  "receiver": {
    "default_wxid": "默认接收者ID",
    "groups": {
      "群组1": ["接收者1", "接收者2"],
      "群组2": ["接收者3", "接收者4"]
    }
  },
  "api": {
    "card": "http://您的服务器IP:端口/VXAPI/Msg/ShareLink",
    "text": "http://您的服务器IP:端口/VXAPI/Msg/SendTxt",
    "batch": "http://您的服务器IP:端口/VXAPI/Msg/BatchSendMsg"
  }
}
```

4. 启动开发服务器：
```bash
npm start
```

5. 访问 http://localhost:3000

### 方法二：生产环境部署

1. 构建生产版本：
```bash
npm run build
```

2. 将 `build` 目录下的文件部署到您的 Web 服务器（如 Nginx）

3. Nginx 配置示例：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 方法三：使用 Docker 部署

1. 创建 Docker 镜像：
```bash
docker build -t message-sender .
```

2. 运行容器：
```bash
docker run -d -p 80:80 message-sender
```

## 默认账号

- 用户名：admin
- 密码：admin123

首次使用请及时修改密码（在 src/config/auth.json 中修改）

## 注意事项

1. 确保 API 服务器允许跨域请求
2. 建议在生产环境中启用 HTTPS
3. 定期备份配置文件
4. 请妥善保管发送者ID和接收者ID

## 常见问题

1. 如果遇到跨域问题，请检查 API 服务器的 CORS 配置
2. 如果消息发送失败，请检查：
   - 网络连接是否正常
   - API 地址是否正确
   - 发送者ID是否有效
   - 接收者ID是否正确

## 技术支持

如有问题请联系技术支持。 