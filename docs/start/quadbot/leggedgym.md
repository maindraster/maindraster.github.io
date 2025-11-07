---
title: Legged Gym解读
description: 本文档介绍如何使用Legged Gym。
keywords: [Issac Gym，强化学习, 入门, 教程]
---

# Legged Gym 解读

## 概览

首先对整个仓库粗略看一下，标记几个比较核心的文件

- legged_gym
  - envs
    - 各类robots的Config
    - __init__.py
  - scripts
  - tests
  - utils
  - __init__.py
- licenses
- resources
  - actuator_nets
  - robots

!!! info "__init__.py的作用"
    该文件用于告诉Python，这个文件夹是个包而不是一个单纯的文件夹，这就意味着你可以使用诸如以下语句去在其他地方导入：
    ```python
    import envs
    ```

## legged_gym

### envs

### scripts

### utils

#### 

## Resources

`resources`里面的`actuator_nets`貌似用来sim-2-real的，没啥用（搜都搜不到哪里用了），`robots`里面是你自己机器人的模型文件（`meshes`是具体机器人部分的模型，`urdf`文件解释机器人各个模块怎么连接的）。

