# 个人网站 - 联系页面部署

这是一个个人静态网站项目，包含 `index.html`、`about.html`、`contact.html` 等页面。

## 部署到 GitHub Pages

1. 在 GitHub 上创建一个新的仓库。
2. 将本地项目关联到该仓库：
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```
3. GitHub Action 会自动部署到 GitHub Pages。
4. 访问仓库设置中的 Pages，即可获得在线访问地址。

## 说明

- `contact.html` 已经集成 FormSubmit 表单提交：
  - `action="https://formsubmit.co/z896230@outlook.com"`
  - 发送成功后会跳回 `contact.html?success=true`
- 如果你直接在本地文件模式打开页面，FormSubmit 可能无法提交。建议通过 GitHub Pages 或其他在线托管访问。

## 本地测试

如果你想先在本地测试：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000/contact.html`。
