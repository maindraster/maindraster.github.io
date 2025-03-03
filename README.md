# 万能工科生教程

由于本网站目前依托于Vercel的SSR（Service Side Render）服务，所以需要翻墙才能访问，且对网络要求较高。以下提供本地部署的方案，只是无法进行评论。

## 部署

首先你需要下载或git clone这个仓库。
```
git clone https://github.com/maindraster/maindraster.github.io.git
```
然后进入到根目录文件夹下，执行
```
pnpm i
```
再执行以下命令，你就可以在 http://localhost:4321/ 当中查看了。
```
pnpm dev
```

## 代码修改

当然你也可以把它当作你自己的 Astro 文档或个人主页模板。以下为一些代码修改的提示。

本文包含两个 Astro 模板，一个为 [Starlight](https://starlight.astro.build/) ，一个为 [kandy](https://github.com/AndrewKuktenko/kandy.app)。直接查阅他们的文档和代码仓库对比进行修改即可。

注意：两个模板的 Tailwind CSS 存在冲突，因此有两个 tailwind config 文件，tailwind.docs.config.js用于全局，tailwind.config.mjs用于global.css（仅用于kandy页面）。

## Pull Request

欢迎 PR ！
