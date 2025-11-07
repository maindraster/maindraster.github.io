---
title: 多臂老虎机
description: 本文档介绍Python类和基本的强化学习概念。
keywords: [Python类，强化学习, 入门, 教程]
---

> 多臂老虎机问题是研究**探索（explore）与利用（exploit）**技术理论的最佳环境。了解多臂老虎机的探索与利用问题，对接下来我们学习强化学习环境探索有很重要的帮助。

> 多臂老虎机问题与强化学习的一大区别在于其与环境的交互并不会改变环境，即多臂老虎机的每次交互的结果和以往的动作无关，所以可看作**无状态的强化学习**（stateless reinforcement learning）。

## 创建类

[首先我们创建了一个老虎机的类](./mab-code.ipynb#1)

!!! info "关于类"
    编写类是**面向对象编程**的一大特色。**对象**是指某个特定的东西，<u>比如我的劳斯莱斯幻影</u>。那么为了更好地让人们（编程时是计算机），你可以告诉它这是一辆豪车（编程时是定义一个类）。豪车就是一个类。你当然不能开豪车本身，你只能开属于豪车这个类中的某一具体的车，<u>比如我的劳斯莱斯幻影</u>。那么根据类来创建对象的过程被称为**实例化**，这让你能使用类的实例。

- `__init__()`是一个每次创建实例时都会自动运行一遍的方法（定义在类中的函数都叫方法）。
  - **形参self必须放第一个**，它是一个指向实例本身的引用，每个与类相关的方法都自动调用self。后面的形参可以自己设置。
  - `self.`开头的变量可供类内所有方法使用，我们还可以通过类的任何实例来访问这些变量，例如：先定义了`my_worst_car=car(Rolls-Royce,Phantom)`，假设有定义相应属性，则可以如此使用`my_worst_car.car_name`
- 关于属性值
  - 类中每一个属性都必须有初始值，哪怕是0或空字符串，比如你可以直接在`__init__()`定义`self.odometer=0`
  - 修改属性值的三种方法
    - 实例中直接修改，见上面比如`my_worst_car.car_name=tesla`
    - 通过方法修改，在类中定义一个可以传入参的方法并使用它去修改实例对应的属性，如下

```python
...
  def update_car_name(self, car_name):
    self.car_name = car_name
...
my_worst_car.update_car_name(tesla)
```

## 继承类

### 重写、实例用作属性

[然后，我们创建了Solver父类和子类](./mab-code.ipynb#2)

- 创建子类时，父类必须包含在当前文件夹中，并且在前面
- 定义子类时必须在括号内指定父类名称，这里`class EpsilonGreedy(Solver): `，**子类会继承父类的所有属性和方法**
- super()是一个特殊的函数，用于将父类和子类关联起来，这行代码表示，调用父类的初始化方法，让子类实例包含父类的所有属性；在[官网](https://hrl.boyuai.com/chapter/1/%E5%A4%9A%E8%87%82%E8%80%81%E8%99%8E%E6%9C%BA/#24-%CF%B5-%E8%B4%AA%E5%BF%83%E7%AE%97%E6%B3%95)中的`super(EpsilonGreedy, self)`是Python 2的写法，在Python 3中空着即可，完全相同
- 重写父类的方法：需要子类中定义一个和父类中方法完全同名的方法，就像这里的`run_one_step`
- 将实例用作属性
    - 当我们给类添加越来越多细节时会变得臃肿，那么就可以拆出一些小类，比如电车可以提取出一个`Battery`的类，并将一个`Battery`的实例用于电车类的属性，比如在电车类的初始化方法中写`self.battery=Battery()`
    - 于是我们可以这么用去访问我特斯拉的电池情况，`my_worst_car.battery.describe_battery()`（`describe_battery()`是`Battery`类中的一个方法）

### 多重继承

比如阿斯顿马丁这车既是属于著名电影道具（007中），又是豪车，那怎么办呢？

```python
class MovieProp:
    def __init__(self, movie_name, **kwargs):
        self.movie_name = movie_name
        super().__init__(**kwargs)  # 继续调用下一个父类
    
    def appear_in_movie(self):
        return f"出现在电影《{self.movie_name}》中"

class LuxuryCar:
    def __init__(self, price, brand, **kwargs):
        self.price = price
        self.brand = brand
        super().__init__(**kwargs)  # 继续调用下一个父类
    
    def show_luxury(self):
        return f"{self.brand}豪车，售价{self.price}万"

class AstonMartin(MovieProp, LuxuryCar):
    def __init__(self, model, movie_name, price):
        super().__init__(
            movie_name=movie_name,
            price=price,
            brand="Aston Martin"
        ) # <- 1 
        self.model = model
    
    def introduce(self):
        return f"{self.model}: {self.appear_in_movie()}, {self.show_luxury()}"
```
1处同时继承的代码也可以用下面的：
```python
    def __init__(self, model, movie_name, price):
        MovieProp.__init__(self, movie_name)
        LuxuryCar.__init__(self, price, "Aston Martin")
        self.model = model
```

## ε衰减方式存在条件

[这是官网ε-贪心算法的运行结果](./mab-code.ipynb#3)

但它并没有解释为啥选择倒数衰减，其实完全可以试试其他衰减的方法，你会发现可能并不总是有效的。

[这里提供两种不同的衰减方式的运行结果](./mab-code.ipynb#4)

| 衰减形式     | 数学形式                | 探索次数随时间增长                | 问题分析                         |
| -------- | ------------------- | ------------------------ | ---------------------------- |
| **倒数衰减** | ε(t) = 1 / t        | ∑ε(t) ≈ log(t)（发散）       | 依然能保证每个臂被探索无穷多次（充分探索）        |
| **对数衰减** | ε(t) = 1 / log(t+1) | ∑ε(t) ≈ t / log(t)（发散太快） | 前期衰减太快，后期几乎不再探索，容易陷入局部最优     |
| **指数衰减** | ε(t) = e^{-t/c}     | ∑ε(t) 收敛                 | 探索次数有限（finite），算法可能永远停在错误的臂上 |

事实上经典多臂老虎机存在收敛条件：ε(t) → 0 且 ∑ ε(t) = ∞ 

## 理解上置信算法

考虑到原来算法在探索的选择上没有章法，根据人类经验，肯定是优先探索那些没怎么探索过的，于是就有了上置信（upper confidence bound，UCB）算法，[代码运行结果在这](./mab-code.ipynb#5)

$$\mathbb{P}\{E[X] \geq \bar{x}_n + u\} \leq e^{-2nu^2}$$

简单来说我拉了拉杆n次，依据此有个预期估计$x_n$，但是总归和真实的$E[x]$有差距（也就是存在运气问题）。那么这个真实的期望值大于$x_n+u$（u是一个自己定的值）的概率会小于等于$e^{-2nu^2}$。

该算法先假设了一个确定的p，并且所有拉杆都是只有p的概率真实值大于$Q_t(A)+U_t(a)$，然后就去找所有拉杆中这个东西最大的那根拉杆。

- $Q_t(A)$就是$x_n$，我们在某一个时刻自然知道所有拉杆的$Q_t(A)$
- 已知$p \leq e^{-2nu^2}$，我们让每根拉杆都有最大的$U_t(a)$，那么取等就可以得到$U_t(a) = \sqrt{\frac{2\log t}{N_t(a)}}$

!!! info "np.argmax和np.max"
    `np.argmax`可以找到一个数组中最大的项的索引（从0开始）；`np.max`则是找其中最大的项。

## 理解汤普森算法

同样是用概率的方法，汤普森采样算法每次抽取之后就会更新对应拉杆的[Beta分布](../../theory/prob/bayes.md#beta分布的推导)，并对每个拉杆抽其可能的p，选择抽到最大p的拉杆更新。[该算法的运行结果在这](./mab-code.ipynb#6)

!!! info "np.random.beta"
    从`Beta分布`中生成一个随机样本。通俗地讲，`np.random.概率密度函数`就是把函数切成一条条，撒豆，选豆子落的多的那个横轴的`p`。
