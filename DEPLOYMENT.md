# 部署到 GitHub Pages

本指南将帮助您将本地修改的代码推送到 GitHub 仓库，并通过 GitHub Pages 部署网站。

## 准备工作

1. **确保您已安装 Git**
   - 检查 Git 是否已安装：`git --version`
   - 如果未安装，请从 [Git 官网](https://git-scm.com/downloads) 下载并安装

2. **确保您已拥有 GitHub 账号**
   - 如果没有，请在 [GitHub](https://github.com/) 注册账号

3. **创建 GitHub 仓库**
   - 在 GitHub 上创建一个新仓库，用于存储您的项目
   - 推荐命名为 `network-security-learning-platform` 或其他有意义的名称

## 本地 Git 配置

### 1. 初始化 Git 仓库（如果尚未初始化）

在项目根目录中执行以下命令：

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. 添加远程仓库

将您的本地仓库与 GitHub 远程仓库关联：

```bash
git remote add origin https://github.com/[您的GitHub用户名]/[仓库名称].git
```

### 3. 推送本地代码到 GitHub

将本地代码推送到 GitHub 远程仓库的 main 分支：

```bash
git push -u origin main
```

## 配置 GitHub Pages

### 1. 在 GitHub 上设置 GitHub Pages

1. 登录到 GitHub，进入您的仓库
2. 点击 "Settings" 选项卡
3. 在左侧导航栏中点击 "Pages"
4. 在 "Source" 部分，选择您要部署的分支（推荐选择 `main`）
5. 在 "Branch" 下拉菜单中选择 `main`，然后选择根目录 `/`
6. 点击 "Save" 按钮

### 2. 等待部署完成

GitHub Pages 会自动开始部署您的网站。部署完成后，您将在 GitHub Pages 设置页面看到部署状态和网站 URL。

### 3. 访问您的网站

部署完成后，您可以通过以下 URL 访问您的网站：

```
https://[您的GitHub用户名].github.io/[仓库名称]/
```

## 更新代码

当您在本地修改代码后，使用以下命令将更改推送到 GitHub 仓库：

```bash
git add .
git commit -m "描述您的更改"
git push
```

GitHub Pages 会自动重新部署您的网站，通常需要几分钟时间。

## 注意事项

1. **确保所有文件都已添加到 Git**
   - 使用 `git status` 命令查看未添加的文件
   - 使用 `git add [文件名]` 或 `git add .` 添加所有文件

2. **确保使用正确的远程仓库 URL**
   - 使用 `git remote -v` 命令查看远程仓库 URL
   - 如果 URL 不正确，可以使用 `git remote set-url origin [新URL]` 命令更新

3. **确保 GitHub Pages 已正确配置**
   - 检查 GitHub Pages 设置，确保分支和目录选择正确
   - 检查部署状态，确保没有部署错误

4. **等待部署完成**
   - GitHub Pages 部署可能需要几分钟时间
   - 如果部署失败，请查看 GitHub Actions 日志以获取错误信息

## 常见问题

### Q: 网站无法访问怎么办？
A: 检查 GitHub Pages 设置是否正确，查看部署状态和日志，确保没有部署错误。

### Q: 为什么更改没有反映在网站上？
A: 等待几分钟，GitHub Pages 可能正在重新部署。如果长时间没有更新，请检查本地代码是否已正确推送到 GitHub。

### Q: 如何自定义域名？
A: 在 GitHub Pages 设置页面，您可以添加自定义域名。需要在您的域名注册商处配置 DNS 记录。

## 本地测试

在将代码推送到 GitHub 之前，您可以在本地测试网站：

```bash
# 使用 Python HTTP 服务器
python -m http.server 8000

# 或使用 Node.js http-server
npx http-server -p 8000
```

然后在浏览器中访问 `http://localhost:8000` 查看网站效果。

---

通过以上步骤，您可以将本地修改的代码推送到 GitHub 仓库，并通过 GitHub Pages 部署您的网站。祝您使用愉快！