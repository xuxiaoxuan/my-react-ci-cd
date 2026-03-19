# 自动化质检与部署
CI（持续集成） 就像是自动化的“质检员”，CD（持续部署） 则是自动化的“搬运工”。

由于你用的是 Mac 且有 GitHub 账号，我们直接用最主流、最省钱、实操性最强的方案：GitHub Actions + GitHub Pages。

## 第一阶段：在 GitHub 创建“阵地”

1.  登录 [GitHub](https://github.com/)。
2.  点击右上角的 **+** 号，选择 **New repository**。
3.  **Repository name**: 输入 `my-react-ci-cd`。
4.  **Public/Private**: 选 **Public**（公开仓库可以免费使用 GitHub Actions 和 Pages）。
5.  点击底部的 **Create repository**。



---

## 第二阶段：本地初始化项目 (React + ESLint)

打开你的 Mac 终端（Terminal）：

1.  **创建项目**（使用 Vite，它自带了完善的 ESLint 配置）：
    ```bash
    pnpm create vite my-react-ci-cd --template react
    cd my-react-ci-cd
    pnpm install
    ```
2.  **测试 ESLint 是否可用**：
    执行 `pnpm lint`。你会看到它正在扫描代码。如果没有报错，说明本地配置 OK。
3.  **关联远程仓库**：
    ```bash
    git init
    git add .
    git commit -m "init project"
    git branch -M main
    # 替换成你刚才创建的仓库地址
    git remote add origin https://github.com/你的用户名/my-react-ci-cd.git
    git push -u origin main
    ```

---

## 第三阶段：编写“全自动质检与部署”脚本

在你的项目根目录下，手动创建文件夹和文件：`.github/workflows/main.yml`。
![alt text](image.png)

其实它就是有些工作节点，每个节点都有自己的任务，然后配置具体的执行命令即可。即name（节点名字）和run（执行命令）。
把下面这段代码贴进去，我特意加入了 **Lint 检查**：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, master ]  # 监听主分支推送
  pull_request:
    branches: [ main, master ]  # 监听 PR 到主分支

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Lint
        # 代码风格检查，这就是一个节点名字
        # 用于检查代码是否符合 ESLint 规则
        # 例如：检查是否有未使用的的变量、是否有错误的语法等   
        run: npm run lint

      - name: 类型检查 (TypeScript)
        # 💡 这一步专门查 TS 错误，不通过就不打包
        run: npm exec tsc --noEmit

      - name: Build
        run: npm run build

  deploy:
    needs: build  # 依赖 build 任务，只有 build 成功才会执行
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')  # 只在主分支推送时部署

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Build
        run: npm run build

      # 这里添加部署步骤，例如部署到 Vercel、Netlify 等
      # 示例：部署到 GitHub Pages
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 第四阶段：触发并观察（模拟“翻车”现场）

这是最关键的一步，我们要看看 ESLint 是怎么拦截坏代码的。

1.  **修改代码制造错误**：
    打开 `src/App.jsx`，随便定义一个没用的变量，比如 `const a = 1;`（ESLint 默认会报 `no-unused-vars` 错误）。
2.  **推送到 GitHub**：
    ```bash
    git add .
    git commit -m "add a test error"
    git push
    ```
3.  **看 GitHub 反应**：
    * 回到 GitHub 仓库，点击 **Actions**。
    * 你会看到任务在跑，然后**变红了（失败）**！
    * 点击进去看详情，你会发现它卡在了 `代码风格检查 (ESLint)` 这一步。



---

## 🎓 面试官深问：为什么要这么配？

* **问：为什么把 Lint 放在单独的 Job 或者是 Step 的最前面？**
    * **答**：为了**“尽早失败（Fail Fast）”**。如果代码格式或者语法就有问题，完全没必要浪费服务器资源去跑后续的编译和部署。
* **问：`needs: build` 是什么意思？**
    * **答**：这定义了任务的**依赖关系**。它保证了部署（CD）必须建立在质量检查（CI）通过的基础上。

---

### 💡 下一步建议：

你现在已经成功搭建了“带质检”的自动化流程。

**你想试试在 CI 中加入“单元测试（Vitest）”吗？** 这样你的流水线就变成了：**检查语法 -> 跑测试用例 -> 编译打包 -> 自动上线**。这才是大厂标准的生产环境流程。