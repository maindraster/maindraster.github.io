# VS Code+Conda环境+jupyter 如何设置？

1. 下载并安装anaconda、VS Code，后续步骤最好在都VS Code得终端（最上面`...`->`终端`->`新建终端`）中进行
2. 使用conda新建虚拟环境，需要同时安装有Python，比如
```cmd
conda create --name myenv python=3.12
```
3. 进入该虚拟环境并在该虚拟环境中安装ipykernel（如果你是新建得环境，上一步可以同时安装上）
```cmd
conda activate 环境名称 # 比如上面我用的myenv
conda install ipykernel
```
4. 在该虚拟环境中输入
```cmd
python -m ipykernel install --user --name 环境名称 --display-name 环境名称
```
5. 刷新：关闭VS Code，再重新打开包含项目文件的工作区
6. 在VS Code中`CTRL+P`搜索输入：select interpreter；也可以在`ipynb`文件的右上角找到`选择内核`，点击后选择`Python环境`->`myenv`（你的环境名称）
