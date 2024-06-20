---
title: "주식 예측을 위한 심층 강화학습"
description: ""
coverImage: "/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_0.png"
date: 2024-06-19 19:04
ogImage: 
  url: /assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_0.png
tag: Tech
originalTitle: "Forecasting Stock Using Deep Reinforcement Learning"
link: "https://medium.com/@mrconnor/forecasting-stock-using-deep-reinforcement-learning-939eda179b27"
---


깊은 강화 학습은 딥 러닝의 능력과 강화 학습의 강점을 결합합니다. 딥 러닝은 raw 데이터로부터 복잡한 표현을 학습하는 데 뛰어나며, 강화 학습은 에이전트가 시행착오를 통해 주어진 환경에서 최적의 조치를 학습할 수 있게 합니다. DRL을 통해 연구자와 투자자들은 역사적 데이터를 분석하고 복잡한 시장 역학을 이해하여 주식 매수, 매도 또는 보유에 대한 판단을 내릴 수 있는 모델을 개발할 수 있습니다.

## 코딩을 시작해봅시다!

```python
# 이 Python 3 환경에는 많은 유용한 분석 라이브러리가 설치되어 있습니다
# kaggle/python 도커 이미지로 정의됩니다: https://github.com/kaggle/docker-python
# 예를 들어, 몇 가지 유용한 패키지를 로드하는 방법을 보여드리겠습니다 
```

```python
import numpy as np # 선형 대수
import pandas as pd # 데이터 처리, CSV 파일 입력 및 출력 (예: pd.read_csv)
# 입력 데이터는 "../input/" 디렉토리에 있습니다.
# 예를 들어, 실행하면 (실행 단축키를 누르거나 Shift+Enter를 누릅니다) input 디렉토리의 파일을 나열합니다
from subprocess import check_output
#print(check_output(["ls", "../input"]).decode("utf8"))
# 현재 디렉토리에 기록된 결과는 출력으로 저장됩니다.
import time
import copy
import numpy as np
import chainer
import chainer.functions as F
import chainer.links as L
from plotly import tools
from plotly.graph_objs import *
from plotly.offline import init_notebook_mode, iplot, iplot_mpl
from tqdm import tqdm_notebook as tqdm
init_notebook_mode()
```

<div class="content-ad"></div>

파이썬 코드에는 데이터 분석 및 처리를 위한 여러 패키지 가져 오기 및 환경 설정이 포함되어 있습니다. 선형 대수 연산 및 데이터 처리를 위해 코드는 NumPy 및 Pandas 라이브러리를 가져옵니다. 또한 신경망을 정의하고 훈련하기 위한 심층 학습 프레임워크 인 Chainer를 가져옵니다. 또한 시각화 및 진행률 표시 막대를 위해 각각 plotly 및 tqdm 라이브러리를 가져옵니다.

주석 처리된 코드에서 이것은 사전 설치된 분석 라이브러리가 포함된 Python 3 환경임을 설명합니다. 이 기사는 또한 Kaggle/docker-python 이미지를 사용하여 지정된 디렉토리에서 입력 데이터 파일을로드하는 방법을 설명합니다. 또한 코드는 오프라인 시각화를위한 plotly를 설정하고 Jupyter 노트북 내에서 시각화를 표시하기위한 노트북 모드를 사용합니다.

```js
# Kaggle 데이터 세트에서 "huge stock market"라는 데이터 가져 오기
```

```js
try:
    data = pd.read_csv('../input/Data/Stocks/goog.us.txt')
    data['Date'] = pd.to_datetime(data['Date'])
    data = data.set_index('Date')
except (FileNotFoundError):
    import datetime
    import pandas_datareader as pdr
    from pandas import Series, DataFrame
    start = datetime.datetime(2010, 1, 1)
    end = datetime.datetime(2017, 1, 11)
    data = pdr.get_data_yahoo("AAPL", start, end)
print(data.index.min(), data.index.max())
split_index = int(len(data)/2)
date_split = data.index[split_index]
train = data[:split_index]
test = data[split_index:]
#date_split = '2016-01-01'
#train = data[:date_split]
#test = data[date_split:]
print(len(data), len(train), len(test))
display(data)
```

<div class="content-ad"></div>


![Forecasting Stock Using Deep Reinforcement Learning - 0](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_0.png)

![Forecasting Stock Using Deep Reinforcement Learning - 1](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_1.png)

이 코드는 Python으로 작성된 'huge stock market'이라는 Kaggle 데이터 세트에서 데이터를 가져옵니다. 초기에 코드는 데이터 세트 내 'goog.us.txt'라는 CSV 파일에서 데이터를 읽습니다. 코드는 CSV 파일을 읽은 후 'Date' 열을 Pandas 라이브러리를 사용하여 Pandas datetime 객체로 변환합니다. 데이터는 'Date' 열로 인덱싱됩니다. 'AAPL' 주식에 대한 데이터는 지정된 파일이 발견되지 않을 경우 Pandas DataReader를 사용하여 Yahoo Finance로부터 얻습니다.

그런 다음 코드는 가져온 데이터의 최소 날짜와 최대 날짜를 표시합니다. Pandas의 슬라이싱 기능을 사용하여 데이터를 교육 및 테스트 두 부분으로 분할합니다. 분할 인덱스는 데이터의 길이의 절반으로 계산되고 해당 날짜가 'date_split'으로 저장됩니다. 'train' 변수에는 분할 인덱스까지의 데이터가 포함되고, 'test' 변수에는 분할 인덱스 이후의 데이터가 포함됩니다.


<div class="content-ad"></div>

그럼 코드는 전체 데이터 세트, 훈련 세트 및 테스트 세트의 길이를 출력합니다. 'display' 함수를 사용하여 코드는 Jupyter 노트북에서 가져온 데이터를 표시합니다.

코드에는 주어진 날짜가 아닌 분할 인덱스를 기반으로 데이터를 분할하는 주석 처리된 행이 포함되어 있습니다.

```js
def plot_train_test(train, test, date_split):
    
    data = [
        Candlestick(x=train.index, open=train['Open'], high=train['High'], low=train['Low'], close=train['Close'], name='train'),
        Candlestick(x=test.index, open=test['Open'], high=test['High'], low=test['Low'], close=test['Close'], name='test')
    ]
    layout = {
         'shapes': [
             {'x0': date_split, 'x1': date_split, 'y0': 0, 'y1': 1, 'xref': 'x', 'yref': 'paper', 'line': {'color': 'rgb(0,0,0)', 'width': 1}
         ],
        'annotations': [
            {'x': date_split, 'y': 1.0, 'xref': 'x', 'yref': 'paper', 'showarrow': False, 'xanchor': 'left', 'text': ' test data'},
            {'x': date_split, 'y': 1.0, 'xref': 'x', 'yref': 'paper', 'showarrow': False, 'xanchor': 'right', 'text': 'train data '}
        ]
    }
    figure = Figure(data=data, layout=layout)
    iplot(figure)
```

이 코드는 Plotly라는 Python 그래프 라이브러리를 사용하여 상호 작용형 캔들스틱 차트를 만드는 plot_train_test라는 함수를 정의합니다. 지정된 날짜를 기준으로 차트는 주식 데이터를 훈련 세트와 테스트 세트로 분할합니다. 입력 매개변수에는 train, test 및 date_split이 포함됩니다.

<div class="content-ad"></div>

함수의 첫 부분은 훈련 데이터 세트와 테스트 데이터 세트 각각에 대한 Candlestick 객체를 생성합니다. 각 객체에는 해당 데이터 세트의 인덱스(데이터의 x축 역할)와 주식 가격의 Open, High, Low, Close 값을 나타내는 캔들스틱이 포함됩니다. 데이터 세트를 레이블하려면 name 속성이 'train' 또는 'test'로 설정됩니다.

다음으로 차트의 모양을 사용자 정의하기 위해 레이아웃 딕셔너리를 정의합니다. Shapes 키는 훈련 데이터와 테스트 데이터를 분리하는 수직선을 나타내는 단일 딕셔너리가 포함됩니다. 선의 좌표는 'x0', 'x1', 'y0', 'y1'로 정의되며, 'xref' 및 'yref'는 각각 'x' 및 'paper'로 설정됩니다. 'line' 키를 사용하여 선의 색상과 너비를 지정할 수 있습니다.

Annotations 키에는 각각 분리 선 위에 위치한 텍스트 레이블을 나타내는 두 개의 딕셔너리가 포함됩니다. 'Test data'는 선의 왼쪽에 고정되고, 'train data'는 오른쪽에 고정됩니다. 두 레이블 모두 'showarrow' 키가 False로 설정되어 있어 텍스트를 가리키는 화살표를 방지합니다.

이전에 정의된 데이터 및 레이아웃 객체를 사용하여 Figure 객체를 생성합니다. Figure 객체를 인수로 사용하여 iplot() 함수를 사용하면 훈련 및 테스트 데이터 세트가 수직선으로 분리된 대화형 캔들스틱 차트가 표시됩니다.

<div class="content-ad"></div>

```js
plot_train_test(train, test, date_split)
```

![Stock Forecasting](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_2.png)

위 코드는 "plot_train_test"라는 사용자 정의 함수를 호출하는 것으로 보입니다. 이 함수의 세 가지 인수는 'train', 'test', 'date_split'입니다. 'train'과 'test'는 각각 훈련 및 테스트 데이터를 포함하는 Pandas 데이터프레임입니다. 'date_split'은 데이터가 훈련 및 테스트로 분리된 날짜를 나타냅니다.

'plot_train_test' 함수는 훈련 및 테스트 데이터를 시각화하는 플롯을 생성합니다. 코드가 가져온 주식 시장 데이터를 플롯하여 Jupyter 노트북에 표시하는 데 이 함수를 사용할 수 있습니다. 이 함수의 구현이 제공되지 않았으므로 플롯을 생성하는 방법에 대한 자세한 내용을 제공하기 어렵습니다.

<div class="content-ad"></div>

```js
import matplotlib.pyplot as plt
```

```js
data['Close'].plot(figsize=(23,8))
plt.legend()
plt.show()
```

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_3.png" />

Matplotlib 라이브러리를 사용하여 이 Python 코드는 가져온 주식 시장 데이터의 'Close' 가격을 그립니다. 먼저 코드는 Matplotlib 라이브러리에서 'pyplot' 모듈을 가져오고 'plt'로 이름을 바꿉니다.

<div class="content-ad"></div>

Pandas 색인(indexing)을 사용하여 코드는 import된 데이터의 'Close' 열에 액세스하고, Pandas 데이터프레임의 'plot' 메서드를 사용하여 그래프를 그립니다. 'figsize' 매개변수는 그래프의 크기를 가로 23인치, 세로 8인치로 설정합니다. 이렇게 하면 크고 명확한 쉽게 볼 수 있는 그래프가 만들어집니다.

그런 다음 'pyplot' 모듈의 'legend' 메서드를 사용하여 그래프에 범례를 추가합니다. 동일한 그림에 여러 데이터 시리즈가 표시될 때, 범례는 플롯에 대한 추가 정보를 제공합니다.

마지막으로 'pyplot' 모듈의 'show' 메서드를 사용하여 그래프를 표시합니다. 별도의 창에 그래프가 표시되며 사용자가 이를 닫을 수 있습니다. 시간이 지남에 따른 'Close' 가격의 그래프는 주식 시장의 행동에 대한 통찰을 제공합니다.

```python
class Environment:
    
    def __init__(self, data, history_t=90):
        self.data = data
        self.history_t = history_t
        self.reset()
        
    def reset(self):
        self.t = 0
        self.done = False
        self.profits = 0
        self.positions = []
        self.position_value = 0
        self.history = [0 for _ in range(self.history_t)]
        return [self.position_value] + self.history # obs
    
    def step(self, act):
        reward = 0
        
        # act = 0: stay, 1: buy, 2: sell
        if act == 1:
            self.positions.append(self.data.iloc[self.t, :]['Close'])
        elif act == 2: # sell
            if len(self.positions) == 0:
                reward = -1
            else:
                profits = 0
                for p in self.positions:
                    profits += (self.data.iloc[self.t, :]['Close'] - p)
                reward += profits
                self.profits += profits
                self.positions = []
        
        # set next time
        self.t += 1
        self.position_value = 0
        for p in self.positions:
            self.position_value += (self.data.iloc[self.t, :]['Close'] - p)
        self.history.pop(0)
        self.history.append(self.data.iloc[self.t, :]['Close'] - self.data.iloc[(self.t-1), :]['Close'])
        
        # clipping reward
        if reward > 0:
            reward = 1
        elif reward < 0:
            reward = -1
        
        return [self.position_value] + self.history, reward, self.done, self.profits # obs, reward, done, profits
```

<div class="content-ad"></div>

제공된 코드에서 에이전트는 단순한 거래 환경을 시뮬레이션하는 Environment라는 클래스와 상호 작용할 수 있습니다. 먼저 시장 주식 가격 데이터를 활용하여 데이터에 기반해 주식을 매수하거나 매도하거나 보유할지를 결정할 수 있습니다.

__init__() 함수는 두 개의 인자를 받습니다. 데이터는 주식 가격 데이터를 나타내고, history_t는 환경이 유지해야 하는 시간 단계를 정의합니다. 데이터와 history_t 값을 설정하고 reset()을 호출하면 클래스가 초기화됩니다.

Reset() 함수는 환경의 내부 상태 변수를 초기화하거나 재설정합니다. 현재 시간 단계 (self.t), 완료 플래그, 총 이익, 보유 중인 포지션, 포지션 가치 및 가격 이력을 초기화합니다. 포지션 가치와 가격 이력으로 이루어진 관측값이 해당 메서드에 의해 반환됩니다.

step() 메서드를 사용하여 환경의 상태를 행위 (act)에 기반해 업데이트할 수 있습니다. 행위는 정수로 나타낼 수 있으며, 0은 보유, 1은 매수, 2는 매도를 의미합니다. 에이전트가 매수하기로 결정하면 주식의 현재 종가가 포지션 목록에 추가됩니다. 에이전트가 판매하기로 결정하면 해당 메서드는 각 오픈 포지션에 대해 이익 또는 손실을 계산하고 수익 변수를 업데이트합니다. 그런 다음, 모든 오픈 포지션이 종료됩니다. 판매 행위 중 발생한 이익 또는 손실에 따라 보상이 -1, 0 또는 1로 클리핑됩니다.

<div class="content-ad"></div>

위치가 업데이트되면 메서드는 현재 시간 단계를 증가시키고 위치 값을 다시 계산합니다. 또한 가격 기록은 가장 오래된 데이터 포인트를 제거하고 현재 및 이전 종가 사이의 차이를 추가하여 업데이트됩니다. 업데이트된 관측, 보상, 완료 플래그 및 총 이익 외에도 메서드는 업데이트된 관측과 보상을 반환합니다.

환경 클래스를 사용하여 주식 가격 데이터를 기반으로 학습하고 결정을 내릴 수 있는 에이전트를 만들 수 있습니다. 환경 클래스는 주식 거래 환경을 시뮬레이션합니다. 통제된 환경에서 강화 학습 에이전트는 거래 전략을 개발하는 데 훈련될 수 있습니다.

```python
env = Environment(train)
print(env.reset())
for _ in range(3):
    pact = np.random.randint(3)
    print(env.step(pact))
```

![Stock Image](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_4.png)

<div class="content-ad"></div>

이 Python 코드는 "Environment"이라는 사용자 정의 클래스를 사용하여 환경을 모의하는 방법을 보여줍니다. 이 코드는 'train' 변수를 인수로 사용하여 Environment 클래스의 인스턴스를 생성합니다. 환경을 초기화하기 위해 'train' 변수에는 훈련 데이터를 포함한 Pandas 데이터프레임이 들어 있습니다.

그런 다음 코드는 환경의 'reset' 메서드를 호출하는데, 이는 환경을 초기 상태로 재설정한 후의 환경 관측값을 반환합니다. 'print' 함수를 사용하여 관측값을 출력합니다.

그런 다음 코드는 세 번 반복하는 루프에 들어갑니다. 루프 내에서 NumPy의 randomint 함수를 사용하여 0부터 2 사이의 랜덤한 액션을 선택합니다. 이 랜덤 액션을 환경의 'step' 메서드에 전달하고, 이는 단일 액션을 취하고 환경의 상태를 업데이트합니다. 'print' 함수를 사용하여 'step' 메서드가 환경의 새로운 상태와 보상 값을 반환합니다.

이 코드는 'Environment' 클래스를 사용하여 환경을 모의하고 'reset' 및 'step' 메서드를 사용하여 상호 작용하는 방법을 보여줍니다. 코드의 세부 사항과 'Environment' 클래스의 성질, 그리고 액션 및 보상의 세부 내용이 제공되지 않았기 때문에 코드의 기능에 대한 더 자세한 설명은 어렵습니다.

<div class="content-ad"></div>

```js
# DQN
```

```js
def train_dqn(env, epoch_num=50):
    class Q_Network(chainer.Chain):
        def __init__(self, input_size, hidden_size, output_size):
            super(Q_Network, self).__init__(
                fc1 = L.Linear(input_size, hidden_size),
                fc2 = L.Linear(hidden_size, hidden_size),
                fc3 = L.Linear(hidden_size, output_size)
            )
        def __call__(self, x):
            h = F.relu(self.fc1(x))
            h = F.relu(self.fc2(h))
            y = self.fc3(h)
            return y
        def reset(self):
            self.zerograds()
    Q = Q_Network(input_size=env.history_t+1, hidden_size=100, output_size=3)
    Q_ast = copy.deepcopy(Q)
    optimizer = chainer.optimizers.Adam()
    optimizer.setup(Q)
    step_max = len(env.data)-1
    memory_size = 200
    batch_size = 20
    epsilon = 1.0
    epsilon_decrease = 1e-3
    epsilon_min = 0.1
    start_reduce_epsilon = 200
    train_freq = 10
    update_q_freq = 20
    gamma = 0.97
    show_log_freq = 5
    memory = []
    total_step = 0
    total_rewards = []
    total_losses = []
    start = time.time()
    for epoch in range(epoch_num):
        pobs = env.reset()
        step = 0
        done = False
        total_reward = 0
        total_loss = 0
        while not done and step < step_max:
            # select act
            pact = np.random.randint(3)
            if np.random.rand() > epsilon:
                pact = Q(np.array(pobs, dtype=np.float32).reshape(1, -1))
                pact = np.argmax(pact.data)
            # act
            obs, reward, done, profit = env.step(pact)
            # add memory
            memory.append((pobs, pact, reward, obs, done))
            if len(memory) > memory_size:
                memory.pop(0)
            # train or update q
            if len(memory) == memory_size:
                if total_step % train_freq == 0:
                    shuffled_memory = np.random.permutation(memory)
                    memory_idx = range(len(shuffled_memory))
                    for i in memory_idx[::batch_size]:
                        batch = np.array(shuffled_memory[i:i+batch_size])
                        b_pobs = np.array(batch[:, 0].tolist(), dtype=np.float32).reshape(batch_size, -1)
                        b_pact = np.array(batch[:, 1].tolist(), dtype=np.int32)
                        b_reward = np.array(batch[:, 2].tolist(), dtype=np.int32)
                        b_obs = np.array(batch[:, 3].tolist(), dtype=np.float32).reshape(batch_size, -1)
                        b_done = np.array(batch[:, 4].tolist(), dtype=np.bool)
                        q = Q(b_pobs)
                        maxq = np.max(Q_ast(b_obs).data, axis=1)
                        target = copy.deepcopy(q.data)
                        for j in range(batch_size):
                            target[j, b_pact[j]] = b_reward[j]+gamma*maxq[j]*(not b_done[j])
                        Q.reset()
                        loss = F.mean_squared_error(q, target)
                        total_loss += loss.data
                        loss.backward()
                        optimizer.update()
                if total_step % update_q_freq == 0:
                    Q_ast = copy.deepcopy(Q)
            # epsilon
            if epsilon > epsilon_min and total_step > start_reduce_epsilon:
                epsilon -= epsilon_decrease
            # next step
            total_reward += reward
            pobs = obs
            step += 1
            total_step += 1
        total_rewards.append(total_reward)
        total_losses.append(total_loss)
        if (epoch+1) % show_log_freq == 0:
            log_reward = sum(total_rewards[((epoch+1)-show_log_freq):])/show_log_freq
            log_loss = sum(total_losses[((epoch+1)-show_log_freq):])/show_log_freq
            elapsed_time = time.time()-start
            print('\t'.join(map(str, [epoch+1, epsilon, total_step, log_reward, log_loss, elapsed_time])))
            start = time.time()
            
    return Q, total_losses, total_rewards
```

이 코드는 간단한 주식 거래 환경을 위해 Deep Q-Network(DQN)을 훈련하는 train_dqn() 함수를 정의합니다. 이 함수는 두 개의 매개변수를 사용합니다: 거래 환경을 나타내는 env 매개변수와 몇 번의 에포크를 훈련할지를 지정하는 epoch_num 매개변수입니다.

코드는 Chainer의 Chain 클래스의 하위 클래스인 Q_Network 클래스를 정의합니다. Q-Network에는 첫 번째 두 레이어에 ReLU 활성화 함수가 있는 세 개의 완전 연결 레이어가 있습니다. 모델 그래디언트는 reset() 메서드에 의해 초기화됩니다.

<div class="content-ad"></div>

이후에 Q-Network의 두 인스턴스, Q와 Q_ast가 생성되며, 모델의 매개변수를 업데이트하는 Adam 옵티마이저가 함께 생성됩니다. DQN 학습을 위해 메모리 크기, 배치 크기, 엡실론, 감마 및 업데이트 빈도를 포함한 여러 하이퍼파라미터가 정의됩니다.

트레이닝 중 모델의 성능을 추적하기 위해 총 보상 및 총 손실 목록이 메모리 목록에 생성됩니다. 각 에포크의 시작 시에 환경이 재설정되고 일부 변수가 초기화됩니다.

에이전트는 현재 상태 및 엡실론 탐색 전략에 기반하여 '보유', '구매' 또는 '판매' 중 하나의 행동을 선택합니다. 그런 다음 에이전트는 환경에서 행동을 수행하고 보상을받으며 새로운 상태를 관찰합니다. 메모리에는 경험 튜플(이전 상태, 행동, 보상, 새로운 상태 및 종료 플래그)이 저장됩니다.

DQN을 훈련하기 위해 메모리가 가득 찼을 때 메모리에서 일괄 경험을 샘플링합니다. Q_ast 네트워크와 벨만 방정식을 사용하여 대상 Q값을 계산합니다. 손실은 예측된 Q값과 대상 Q값 사이의 평균 제곱 오차로 계산됩니다. 그라디언트가 계산되고 옵티마이저가 모델의 매개변수를 업데이트합니다.

<div class="content-ad"></div>

타겟 네트워크 Q_ast는 메인 네트워크 Q의 가중치로 주기적으로 업데이트됩니다. 에이전트가 학습함에 따라 엡실론 값이 선형적으로 감소하여 더 많은 이용을 촉진합니다. 매 에포크마다 총 보상과 손실이 누적되고 결과가 기록됩니다.

훈련을 마치면 train_dqn()은 훈련된 Q-네트워크, 총 손실 및 총 보상을 반환합니다. DQN 모델은 입력 주식 가격 데이터와 시뮬레이션된 거래 환경을 기반으로 거래 전략을 개발하는 데 사용할 수 있습니다.

```js
dqn, total_losses, total_rewards = train_dqn(Environment(train), epoch_num=25)
```

![Stock Forecasting](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_5.png)

<div class="content-ad"></div>

Deep Q-Network (DQN) 알고리즘을 사용하여 이 Python 코드는 깊은 강화학습 모델을 훈련합니다. ‘train_dqn’은 ‘Environment’ 클래스의 인스턴스와 ‘epoch_num’ 매개변수 값 25를 인수로 받습니다. 이 함수는 지정된 환경의 훈련 데이터를 사용하여 25개의 에포크 동안 DQN 모델을 훈련시키고, 훈련된 DQN 모델, 총 손실 및 총 보상을 반환합니다.

‘dqn’은 ‘train_dqn’에 의해 반환된 훈련된 DQN 모델을 받습니다. 환경의 상태에 따라, 이 모델은 결정 순서에 따른 누적 보상을 극대화하기 위해 훈련되었을 것으로 예상됩니다.

총 손실 값은 각 훈련 에포크마다 'total_losses' 변수에 저장됩니다. 훈련 중에 손실 값을 최소화함으로써 예측된 Q값과 실제 Q값 사이의 차이를 최소화하여 모델의 정확도를 향상시킵니다.

‘total_rewards’ 변수는 각 훈련 에포크에서의 총 보상 값 목록을 받습니다. 보상 값은 모델이 일련의 작업에서 얻은 누적 보상을 나타내며, 성능을 평가하는 데 사용됩니다.

<div class="content-ad"></div>

총 손실 및 보상값을 나타내는 그래프를 그려주는 "plot_loss_reward"라는 사용자 정의 함수를 Python으로 작성한 코드입니다. 'total_losses'와 'total_rewards'는 각 훈련 에포크별 총 손실 값과 총 보상 값의 리스트입니다.Markdown의 표를 변경한 형식이에요.

<div class="content-ad"></div>

먼저, 이 함수는 Plotly 라이브러리의 ‘make_subplots’ 함수를 사용하여 두 개의 서브플롯이 있는 그림을 생성합니다. 두 서브플롯은 'loss'와 'reward'라는 제목이 달린 행 하나에 배치됩니다. 그림에서 그리드 라인을 숨기기 위해 'print_grid' 매개변수가 False로 설정됩니다.

다음으로, 이 함수는 'append_trace' 메서드를 사용하여 그림에 두 개의 트레이스를 추가합니다. 첫 번째 트레이스는 'total_losses' 값들의 스카이블루로 색칠된 산점도 플롯입니다. 두 번째 트레이스는 주황색 선으로 'total_rewards' 값들의 산점도 플롯을 보여줍니다.

서브플롯의 x축 제목은 'epoch'로 설정되며, 'layout' 객체의 'update' 메서드를 사용하여 그림의 높이와 너비를 각각 400픽셀과 900픽셀로 설정합니다. 그림에서 범례를 숨기기 위해 'showlegend' 매개변수가 False로 설정됩니다.

Jupyter 노트북에서 그림을 표시하려면 Plotly 라이브러리에서 'iplot' 함수를 사용합니다. 훈련 epoch 동안, 이 플롯은 손실과 보상 값의 추이를 보여주어 DQN 모델의 성능에 대한 통찰을 제공합니다.

<div class="content-ad"></div>

```js
plot_loss_reward(total_losses, total_rewards)
```

![이미지](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_6.png)

이 코드는 "plot_loss_reward"라는 사용자 정의 함수를 호출합니다. 'total_losses'와 'total_rewards'라는 두 인자를 허용합니다. 이는 각 훈련 에폭마다 총 손실 값과 총 보상 값의 목록입니다.

Plot_loss_reward는 훈련 에폭을 통해 손실 및 보상 값의 추세를 시각화하는 플롯을 생성합니다. 주식 시장 예측에 사용되는 DQN 모델의 훈련 중에는 코드가 이 함수를 사용하여 손실 및 보상 값을 플롯합니다.

<div class="content-ad"></div>

```js
def plot_train_test_by_q(train_env, test_env, Q, algorithm_name):
    
    # train
    pobs = train_env.reset()
    train_acts = []
    train_rewards = []
    train_ongoing_profits = []

```

```js
    for _ in range(len(train_env.data)-1):
        
        pact = Q(np.array(pobs, dtype=np.float32).reshape(1, -1))
        pact = np.argmax(pact.data)
        train_acts.append(pact)
            
        obs, reward, done, profit = train_env.step(pact)
        train_rewards.append(reward)
        train_ongoing_profits.append(profit)
        pobs = obs
        
    train_profits = train_env.profits
    
    # test
    pobs = test_env.reset()
    test_acts = []
    test_rewards = []
    test_ongoing_profits = []
    for _ in range(len(test_env.data)-1):
    
        pact = Q(np.array(pobs, dtype=np.float32).reshape(1, -1))
        pact = np.argmax(pact.data)
        test_acts.append(pact)
            
        obs, reward, done, profit = test_env.step(pact)
        test_rewards.append(reward)
        test_ongoing_profits.append(profit)
        pobs = obs
        
    test_profits = test_env.profits
    
    # plot
    train_copy = train_env.data.copy()
    test_copy = test_env.data.copy()
    train_copy['act'] = train_acts + [np.nan]
    train_copy['reward'] = train_rewards + [np.nan]
    test_copy['act'] = test_acts + [np.nan]
    test_copy['reward'] = test_rewards + [np.nan]
    train0 = train_copy[train_copy['act'] == 0]
    train1 = train_copy[train_copy['act'] == 1]
    train2 = train_copy[train_copy['act'] == 2]
    test0 = test_copy[test_copy['act'] == 0]
    test1 = test_copy[test_copy['act'] == 1]
    test2 = test_copy[test_copy['act'] == 2]
    act_color0, act_color1, act_color2 = 'gray', 'cyan', 'magenta'
    data = [
        Candlestick(x=train0.index, open=train0['Open'], high=train0['High'], low=train0['Low'], close=train0['Close'], increasing=dict(line=dict(color=act_color0)), decreasing=dict(line=dict(color=act_color0))),
        Candlestick(x=train1.index, open=train1['Open'], high=train1['High'], low=train1['Low'], close=train1['Close'], increasing=dict(line=dict(color=act_color1)), decreasing=dict(line=dict(color=act_color1))),
        Candlestick(x=train2.index, open=train2['Open'], high=train2['High'], low=train2['Low'], close=train2['Close'], increasing=dict(line=dict(color=act_color2)), decreasing=dict(line=dict(color=act_color2))),
        Candlestick(x=test0.index, open=test0['Open'], high=test0['High'], low=test0['Low'], close=test0['Close'], increasing=dict(line=dict(color=act_color0)), decreasing=dict(line=dict(color=act_color0))),
        Candlestick(x=test1.index, open=test1['Open'], high=test1['High'], low=test1['Low'], close=test1['Close'], increasing=dict(line=dict(color=act_color1)), decreasing=dict(line=dict(color=act_color1))),
        Candlestick(x=test2.index, open=test2['Open'], high=test2['High'], low=test2['Low'], close=test2['Close'], increasing=dict(line=dict(color=act_color2)), decreasing=dict(line=dict(color=act_color2)))
    ]
    title = '{}: train s-reward {}, profits {}, test s-reward {}, profits {}'.format(
        algorithm_name,
        int(sum(train_rewards)),
        int(train_profits),
        int(sum(test_rewards)),
        int(test_profits)
    )
    layout = {
        'title': title,
        'showlegend': False,
         'shapes': [
             {'x0': date_split, 'x1': date_split, 'y0': 0, 'y1': 1, 'xref': 'x', 'yref': 'paper', 'line': {'color': 'rgb(0,0,0)', 'width': 1}
         ],
        'annotations': [
            {'x': date_split, 'y': 1.0, 'xref': 'x', 'yref': 'paper', 'showarrow': False, 'xanchor': 'left', 'text': ' test data'},
            {'x': date_split, 'y': 1.0, 'xref': 'x', 'yref': 'paper', 'showarrow': False, 'xanchor': 'right', 'text': 'train data '}
        ]
    }
    figure = Figure(data=data, layout=layout)
    iplot(figure)
    
    return train_ongoing_profits, test_ongoing_profits
```

plot_train_test_by_q()는 훈련된 DQN 모델의 거래 행동과 성능을 훈련 및 테스트 데이터 세트에서 시각화합니다. 이 알고리즘은 train_env와 test_env(훈련 및 테스트 환경), Q(훈련된 Q-Network), algorithm_name(알고리즘 이름) 네 가지 인수를 사용합니다.

훈련된 Q-Network를 사용하여 함수는 환경을 초기화하고 훈련 및 테스트 데이터를 반복합니다. 두 데이터 세트 모두에서 조치, 보상 및 지속적인 이윤을 누적합니다.

<div class="content-ad"></div>

다음 단계에서 함수는 훈련 및 테스트 데이터의 사본을 생성하고, 행동과 보상을 새 열로 추가합니다. 훈련 및 테스트 데이터 모두는 이후 행동(0: stay, 1: buy, 2: sell)에 따라 분할됩니다.

훈련 또는 테스트 데이터 및 행동의 각 조합에 대해 함수는 서로 다른 색상으로 다른 행동을 나타내는 캔들스틱 플롯 목록을 만듭니다. 플롯 제목에는 훈련 및 테스트 데이터뿐만 아니라 총 보상과 이익도 포함됩니다.

플롯은 훈련 및 테스트 데이터를 구분하는 수직선이 설정되고, 훈련 및 테스트 데이터 섹션을 나타내는 주석이 포함됩니다. 데이터와 레이아웃이 생성된 후 iplot()을 사용하여 플롯을 표시합니다.

알고리즘 성능의 분석이나 비교를 위해, 함수는 훈련 및 테스트 데이터 모두에 대한 지속적인 이익을 반환합니다.

<div class="content-ad"></div>

```js
train_profits, test_profits = plot_train_test_by_q(Environment(train), Environment(test), dqn, 'DQN')
```

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_7.png" />

파이썬을 사용하여, 이 코드는 훈련된 DQN 모델의 성능을 훈련 및 테스트 데이터로 평가합니다. 'plot_train_test_by_q' 함수는 'Environment' 클래스의 인스턴스(훈련 데이터용과 테스트 데이터용)와 훈련된 DQN 모델 'dqn'을 인자로 전달받아 호출됩니다. 모델의 예측 결과를 기반으로, plot_train_test_by_q 함수는 훈련 및 테스트 데이터에서 얻은 수익을 반환합니다.

DQN 모델의 예측에 따라, 'train_profits' 변수에는 훈련 데이터에서 얻은 수익이 저장되고, 'test_profits'에는 DQN 모델의 예측에 따라 얻은 테스트 데이터 수익이 저장됩니다.

<div class="content-ad"></div>

훈련된 DQN 모델을 훈련 및 테스트 데이터에 대해 평가하고 각 데이터셋에서 얻은 이익을 계산하는 코드입니다. 이 평가는 DQN 모델의 정확성과 효과를 결정하는 데 유용할 수 있습니다.

```js
plt.figure(figsize=(23,8))
plt.plot(data.index,((data['Close']-data['Close'][0])/data['Close'][-1]), label='buy and hold')
plt.plot(train.index, ([0] + train_profits)/data['Close'][-1], label='rl (train)')
plt.plot(test.index, (([0] + test_profits) + train_profits[-1])/data['Close'][-1], label='rl (test)')
plt.ylabel('relative gain')
plt.legend()
plt.show()
```

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_8.png" />

Python 코드는 주식 시장 예측을 위한 DQN 모델의 성능을 '매수 및 보유' 전략과 비교하는 플롯을 생성합니다. Matplotlib의 'plt' 모듈을 사용하여 플롯을 생성합니다.

<div class="content-ad"></div>

Matplotlib 라이브러리의 'figure' 함수를 사용하여 플롯의 크기를 설정하는 코드입니다. 'figsize' 매개변수를 인수로 취합니다. 마지막에 플롯의 크기는 폭 23인치, 높이 8인치입니다.

Matplotlib의 plot 함수를 사용하여 '매수 보유' 전략을 플롯하는 코드입니다. 플롯의 x 축은 가져온 데이터의 인덱스를 나타내며, y 축은 주식을 매수하여 보유한 결과로 얻은 이익의 상대적 증가량을 나타냅니다. 이 플롯에는 '매수 보유'라는 레이블이 지정됩니다.

DQN 모델을 사용하여 훈련 데이터에서 얻은 이익을 플롯하는 코드입니다. 이 플롯의 x 축은 훈련 데이터의 인덱스를 나타내며, y 축은 DQN 모델의 예측으로부터 얻은 이익의 상대적 증가량을 나타냅니다. 상대적 이득은 이익을 가져온 데이터의 마지막 종가로 나누어 계산됩니다. 이 플롯의 레이블은 'rl(train)'로 설정됩니다.

DQN 모델을 사용하여 테스트 데이터에서 얻은 이익을 플롯하는 코드입니다. x 축은 테스트 데이터의 인덱스를 나타내며, y 축은 DQN 모델의 예측으로부터 얻은 상대적인 수익 증가를 나타냅니다. 상대적 이득은 훈련 이익을 추가하고 가져온 데이터의 마지막 종가로 나누어 계산됩니다. 이 플롯의 레이블은 'rl(test)'로 지정됩니다.

<div class="content-ad"></div>

맷플롯립의 'ylabel' 함수는 플롯의 y-축 레이블을 '상대 이익'으로 설정합니다. 맷플롯립의 'legend' 함수는 플롯 범례에 그려진 세 개의 선의 레이블을 표시합니다.

플롯은 맷플롯립 라이브러리의 'show' 함수를 사용하여 표시됩니다. 훈련 및 테스트 데이터 모두에서 플롯은 '매수 및 보유' 전략 및 DQN 모델의 예측으로부터의 상대적 이익 획득을 보여줍니다. DQN 모델을 '매수 및 보유'와 같은 간단한 전략과 비교함으로써 효과를 파악할 수 있습니다.

```js
# 더블 DQN
```

```js
def train_ddqn(env, epoch_num=50):
    class Q_Network(chainer.Chain):
        def __init__(self, input_size, hidden_size, output_size):
            super(Q_Network, self).__init__(
                fc1 = L.Linear(input_size, hidden_size),
                fc2 = L.Linear(hidden_size, hidden_size),
                fc3 = L.Linear(hidden_size, output_size)
            )
        def __call__(self, x):
            h = F.relu(self.fc1(x))
            h = F.relu(self.fc2(h))
            y = self.fc3(h)
            return y
        def reset(self):
            self.zerograds()
    Q = Q_Network(input_size=env.history_t+1, hidden_size=100, output_size=3)
    Q_ast = copy.deepcopy(Q)
    optimizer = chainer.optimizers.Adam()
    optimizer.setup(Q)
    step_max = len(env.data)-1
    memory_size = 200
    batch_size = 50
    epsilon = 1.0
    epsilon_decrease = 1e-3
    epsilon_min = 0.1
    start_reduce_epsilon = 200
    train_freq = 10
    update_q_freq = 20
    gamma = 0.97
    show_log_freq = 5
    memory = []
    total_step = 0
    total_rewards = []
    total_losses = []
    start = time.time()
    for epoch in range(epoch_num):
        pobs = env.reset()
        step = 0
        done = False
        total_reward = 0
        total_loss = 0
        while not done and step < step_max:
            # select act
            pact = np.random.randint(3)
            if np.random.rand() > epsilon:
                pact = Q(np.array(pobs, dtype=np.float32).reshape(1, -1))
                pact = np.argmax(pact.data)
            # act
            obs, reward, done, profit = env.step(pact)
            # add memory
            memory.append((pobs, pact, reward, obs, done))
            if len(memory) > memory_size:
                memory.pop(0)
            # train or update q
            if len(memory) == memory_size:
                if total_step % train_freq == 0:
                    shuffled_memory = np.random.permutation(memory)
                    memory_idx = range(len(shuffled_memory))
                    for i in memory_idx[::batch_size]:
                        batch = np.array(shuffled_memory[i:i+batch_size])
                        b_pobs = np.array(batch[:, 0].tolist(), dtype=np.float32).reshape(batch_size, -1)
                        b_pact = np.array(batch[:, 1].tolist(), dtype=np.int32)
                        b_reward = np.array(batch[:, 2].tolist(), dtype=np.int32)
                        b_obs = np.array(batch[:, 3].tolist(), dtype=np.float32).reshape(batch_size, -1)
                        b_done = np.array(batch[:, 4].tolist(), dtype=np.bool)
                        q = Q(b_pobs)
                        """ <<< DQN -> Double DQN
                        maxq = np.max(Q_ast(b_obs).data, axis=1)
                        === """
                        indices = np.argmax(q.data, axis=1)
                        maxqs = Q_ast(b_obs).data
                        """ >>> """
                        target = copy.deepcopy(q.data)
                        for j in range(batch_size):
                            """ <<< DQN -> Double DQN
                            target[j, b_pact[j]] = b_reward[j]+gamma*maxq[j]*(not b_done[j])
                            === """
                            target[j, b_pact[j]] = b_reward[j]+gamma*maxqs[j, indices[j]]*(not b_done[j])
                            """ >>> """
                        Q.reset()
                        loss = F.mean_squared_error(q, target)
                        total_loss += loss.data
                        loss.backward()
                        optimizer.update()
                if total_step % update_q_freq == 0:
                    Q_ast = copy.deepcopy(Q)
            # epsilon
            if epsilon > epsilon_min and total_step > start_reduce_epsilon:
                epsilon -= epsilon_decrease
            # next step
            total_reward += reward
            pobs = obs
            step += 1
            total_step += 1
        total_rewards.append(total_reward)
        total_losses.append(total_loss)
        if (epoch+1) % show_log_freq == 0:
            log_reward = sum(total_rewards[((epoch+1)-show_log_freq):])/show_log_freq
            log_loss = sum(total_losses[((epoch+1)-show_log_freq):])/show_log_freq
            elapsed_time = time.time()-start
            print('\t'.join(map(str, [epoch+1, epsilon, total_step, log_reward, log_loss, elapsed_time])))
            start = time.time()
            
    return Q, total_losses, total_rewards
```

<div class="content-ad"></div>

제공된 코드는 거래 환경을 해결하기 위해 더블 딥 Q-네트워크(DDQN)를 훈련하는 train_ddqn() 함수를 정의합니다. 기본값이 50인 선택적인 epoch_num 매개변수는 훈련 에포크의 수와 환경 env를 나타냅니다.

Q_Network는 chainer.Chain의 하위 클래스로 정의되며, Chainer에 특화된 신경망 모델입니다. __call__ 메서드는 첫 두 레이어에 ReLU 활성화 함수를 적용하고 세 번째 레이어의 출력을 반환합니다.

훈련 함수는 Q-네트워크 Q와 대상 네트워크 Q_ast를 초기화하고 옵티마이저를 설정하며, 메모리 크기, 배치 크기 및 엡실론과 같은 학습 프로세스의 하이퍼파라미터를 정의합니다.

훈련 과정에서 함수는 여러 에포크를 반복합니다. 각 에포크에서 다음 단계가 수행됩니다:

<div class="content-ad"></div>

- 환경을 초기화하고 초기 관측값을 얻는 것은 첫 단계입니다.
- 현재 엡실론 탐욕 전략에 따라, 에이전트가 어떤 행동을 취할지 결정합니다.
- 에이전트는 환경에서 행동을 수행하고 결과적인 관측값, 보상 및 완료 플래그를 수집합니다.
- 경험 튜플 (상태, 행동, 보상, 다음 상태, 완료)은 메모리 버퍼에 저장됩니다.
- 메모리 버퍼가 가득 차면, 에이전트는 미니 배치를 샘플링하고 더블 DQN 업데이트 규칙을 사용하여 가중치를 업데이트합니다.
- 주요 Q-네트워크의 가중치는 주기적으로 타겟 네트워크 Q_ast에 업데이트됩니다.
- 엡실론이 최솟값에 도달할 때까지 선형적으로 감소됩니다.
- 에이전트는 총 보상, 현재 상태 및 단계 수를 업데이트하면서 다음 단계로 이동합니다.

훈련 과정이 완료되면 함수는 훈련된 Q-네트워크, 총 손실 및 각 에포크별 총 보상을 반환합니다. 훈련된 DDQN 모델은 테스트 환경에서 에이전트의 성능을 평가하거나 실제 주식 거래 시나리오에서 예측을 수행하는 데 사용할 수 있습니다.

```js
ddqn, total_losses, total_rewards = train_ddqn(Environment(train), epoch_num=50)
```

![Stock Forecasting](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_9.png)

<div class="content-ad"></div>

이 Python 코드는 Double Deep Q-Network (DDQN) 알고리즘을 사용하여 강화 학습 모델을 훈련합니다. 'Environment' 인스턴스가 'train_ddqn' 함수에 전달되며 'epoch_num' 매개변수 값으로 50이 전달됩니다. 'train_ddqn' 함수는 지정된 환경에서 제공된 훈련 데이터를 사용하여 50개의 에포크 동안 DDQN 모델을 훈련하고, 훈련된 모델, 총 손실 및 총 보상을 반환합니다.

'train_ddqn' 함수에서 반환된 훈련 된 DDQN 모델은 'ddqn' 변수에 저장됩니다. 이 모델은 환경의 상태를 기반으로 결정을 내리고 연속적인 작업을 통해 누적 보상을 극대화하도록 훈련될 가능성이 높습니다.

총 손실 값은 각 훈련 에포크마다 'total_losses' 변수에 저장됩니다. 훈련 중에 손실 값은 예측된 Q-값과 실제 Q-값 간의 차이를 최소화하여 모델의 정확도를 향상시키기 위해 최소화됩니다.

'total_rewards' 변수는 각 훈련 에포크마다 총 보상 값 목록을 수신합니다. 보상 값은 모델이 연속적인 작업을 통해 획득한 누적 보상을 나타내며 모델의 성능을 평가하는 데 사용됩니다.

<div class="content-ad"></div>

이 코드는 지정된 환경에서 훈련 데이터를 사용하여 DDQN 모델을 훈련하고 'train_ddqn' 함수를 사용하여 훈련된 모델과 각 훈련 에포크별 총 손실 및 보상을 얻습니다. 주식 시장 예측이나 DDQN 모델을 사용하여 강화 학습이 필요한 다른 의사 결정 작업을 수행할 수 있습니다.

```js
plot_loss_reward(total_losses, total_rewards)
```

![stock_prediction_graph](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_10.png)

이는 "plot_loss_reward"라는 사용자 정의 함수를 호출합니다. 이 함수는 총 손실 값 및 각 훈련 에포크별 총 보상 값의 목록인 'total_losses'와 'total_rewards'라는 두 인수를 받습니다.

<div class="content-ad"></div>

plot_loss_reward 함수는 손실 및 보상 값의 추세를 시각화하는 플롯을 생성합니다. DDQN 모델을 훈련하는 동안, 이 함수는 손실 및 보상 값의 그래픽을 생성합니다.

이 함수의 구현 내용이 제공되지 않았기 때문에 플롯이 어떻게 표시되는지 또는 무엇을 표시하는지에 대한 자세한 내용을 제공하기 어렵습니다. 그러나 함수는 아마도 Plotly 또는 Matplotlib과 같은 그래픽 라이브러리를 사용하여 각 훈련 에포크에 걸쳐 손실 및 보상 값이 표시되는 플롯을 생성할 것으로 예상됩니다. DDQN 모델의 성능을 파악하는 데 도움이 될 수 있습니다.

```js
train_profits, test_profits = plot_train_test_by_q(Environment(train), Environment(test), ddqn, 'Double DQN')
```

![그림](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_11.png)

<div class="content-ad"></div>

파이썬으로 작성된 코드는 훈련된 더블 딥 Q-네트워크(DDQN) 모델의 성능을 훈련 및 테스트 데이터에서 평가합니다. plot_train_test_by_q 함수에는 세 가지 인수가 전달됩니다: 훈련 데이터용 'Environment' 클래스의 인스턴스, 테스트 데이터용 'Environment' 클래스의 인스턴스, 그리고 훈련된 DDQN 모델입니다. plot_train_test_by_q 함수는 DDQN 모델을 테스트 데이터에 대해 평가하고 모델 예측에 따른 이익을 반환합니다.

DDQN 모델 예측의 결과로 'train_profits'는 훈련 데이터에서 얻은 이익을 받습니다. DDQN 모델 예측에 따라 'test_profits' 변수는 테스트 데이터에서 얻은 이익을 받습니다.

이 코드는 훈련 및 테스트 데이터에서 훈련된 DDQN 모델의 성능을 평가하고 각 데이터셋에 대한 이익을 얻습니다. 주식 시장 예측이나 강화 학습을 필요로 하는 기타 의사 결정 작업에는 이 평가 결과가 유용할 수 있습니다.

```js
plt.figure(figsize=(23,8))
plt.plot(data.index,((data['Close']-data['Close'][0])/data['Close'][-1]), label='buy and hold')
plt.plot(train.index, ([0] + train_profits)/data['Close'][-1], label='rl (train)')
plt.plot(test.index, (([0] + test_profits) + train_profits[-1])/data['Close'][-1], label='rl (test)')
plt.ylabel('relative gain')
plt.legend()
plt.show()
```

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_12.png)

이 코드는 Python으로 작성되었으며 주식 시장 예측을 위해 DDQN 모델과 '매수 및 보유' 전략의 성능을 비교하는 플롯을 생성하는 데 사용됩니다. Matplotlib 라이브러리의 'plt' 모듈을 사용하여 플롯을 생성합니다.

코드는 먼저 Matplotlib 라이브러리의 'figure' 함수를 사용하여 플롯의 크기를 설정하며 'figsize' 매개변수를 인수로 취합니다. 결과 플롯은 너비 23인치, 높이 8인치입니다.

그런 다음 코드는 Matplotlib 라이브러리의 'plot' 함수를 사용하여 '매수 및 보유' 전략을 플롯합니다. 플롯의 x 축은 가져온 데이터의 색인으로 설정되고 y 축은 주식을 사고 보유함으로써 얻는 이윤의 상대적 이득을 나타냅니다. 이 플롯의 레이블은 '매수 및 보유'로 설정됩니다.


<div class="content-ad"></div>

다음으로, 코드는 DDQN 모델을 사용하여 훈련 데이터에서 얻은 이익을 플롯합니다. 이 그래프의 x축은 훈련 데이터의 인덱스로 설정되고, y축은 DDQN 모델의 예측에 따른 이익 상대적인 이득을 나타냅니다. 이익은 가져온 데이터의 마지막 종가로 나누어 상대적인 이득을 얻기 위해 조정됩니다. 이 그래프의 레이블은 'rl (train)'로 설정됩니다.

그 다음, 코드는 DDQN 모델을 사용하여 테스트 데이터에서 얻은 이익을 플롯합니다. 이 그래프의 x축은 테스트 데이터의 인덱스로 설정되고, y축은 DDQN 모델의 예측에 따른 이익 상대적인 이득을 나타냅니다. 이익은 훈련 이익을 더한 다음 가져온 데이터의 마지막 종가로 나누어 상대적인 이득을 얻기 위해 조정됩니다. 이 그래프의 레이블은 'rl (test)'로 설정됩니다.

플롯의 y축 레이블은 Matplotlib 라이브러리의 'ylabel' 함수를 사용하여 '상대적인 이익'으로 설정됩니다. 플롯 범례는 Matplotlib 라이브러리의 'legend' 함수를 사용하여 표시되며, 플롯된 세 가지 선의 레이블을 보여줍니다.

마지막으로, Matplotlib 라이브러리의 'show' 함수를 사용하여 플롯이 표시됩니다. 결과 그래프는 '매수 및 보유' 전략과 DDQN 모델의 예측으로 얻은 이익의 상대적인 이득을 훈련 및 테스트 데이터 모두에서 보여줍니다. 이를 통해 DDQN 모델의 효과를 '매수 및 보유'와 같은 간단한 전략과 비교하는 통찰력을 제공합니다.

<div class="content-ad"></div>

```js
# 경쟁 두 번째 배럴 DQN
```

```js
def train_dddqn(env, epoch_num=50):
    """ <<< 더블 DQN -> Dueling Double DQN
    class Q_Network(chainer.Chain):
        def __init__(self, input_size, hidden_size, output_size):
            super(Q_Network, self).__init__(
                fc1 = L.Linear(input_size, hidden_size),
                fc2 = L.Linear(hidden_size, hidden_size),
                fc3 = L.Linear(hidden_size, output_size)
            )
        def __call__(self, x):
            h = F.relu(self.fc1(x))
            h = F.relu(self.fc2(h))
            y = self.fc3(h)
            return y
        def reset(self):
            self.zerograds()
    === """
    class Q_Network(chainer.Chain):
        def __init__(self, input_size, hidden_size, output_size):
            super(Q_Network, self).__init__(
                fc1 = L.Linear(input_size, hidden_size),
                fc2 = L.Linear(hidden_size, hidden_size),
                fc3 = L.Linear(hidden_size, hidden_size//2),
                fc4 = L.Linear(hidden_size, hidden_size//2),
                state_value = L.Linear(hidden_size//2, 1),
                advantage_value = L.Linear(hidden_size//2, output_size)
            )
            self.input_size = input_size
            self.hidden_size = hidden_size
            self.output_size = output_size
        def __call__(self, x):
            h = F.relu(self.fc1(x))
            h = F.relu(self.fc2(h))
            hs = F.relu(self.fc3(h))
            ha = F.relu(self.fc4(h))
            state_value = self.state_value(hs)
            advantage_value = self.advantage_value(ha)
            advantage_mean = (F.sum(advantage_value, axis=1)/float(self.output_size)).reshape(-1, 1)
            q_value = F.concat([state_value for _ in range(self.output_size)], axis=1) + (advantage_value - F.concat([advantage_mean for _ in range(self.output_size)], axis=1))
            return q_value
        def reset(self):
            self.zerograds()
    """ >>> """
    Q = Q_Network(input_size=env.history_t+1, hidden_size=100, output_size=3)
    Q_ast = copy.deepcopy(Q)
    optimizer = chainer.optimizers.Adam()
    optimizer.setup(Q)
    step_max = len(env.data)-1
    memory_size = 200
    batch_size = 50
    epsilon = 1.0
    epsilon_decrease = 1e-3
    epsilon_min = 0.1
    start_reduce_epsilon = 200
    train_freq = 10
    update_q_freq = 20
    gamma = 0.97
    show_log_freq = 5
    memory = []
    total_step = 0
    total_rewards = []
    total_losses = []
    start = time.time()
    for epoch in range(epoch_num):
        pobs = env.reset()
        step = 0
        done = False
        total_reward = 0
        total_loss = 0
        while not done and step < step_max:
            # select act
            pact = np.random.randint(3)
            if np.random.rand() > epsilon:
                pact = Q(np.array(pobs, dtype=np.float32).reshape(1, -1))
                pact = np.argmax(pact.data)
            # act
            obs, reward, done, profit = env.step(pact)
            # add memory
            memory.append((pobs, pact, reward, obs, done))
            if len(memory) > memory_size:
                memory.pop(0)
            # train or update q
            if len(memory) == memory_size:
                if total_step % train_freq == 0:
                    shuffled_memory = np.random.permutation(memory)
                    memory_idx = range(len(shuffled_memory))
                    for i in memory_idx[::batch_size]:
                        batch = np.array(shuffled_memory[i:i+batch_size])
                        b_pobs = np.array(batch[:, 0].tolist(), dtype=np.float32).reshape(batch_size, -1)
                        b_pact = np.array(batch[:, 1].tolist(), dtype=np.int32)
                        b_reward = np.array(batch[:, 2].tolist(), dtype=np.int32)
                        b_obs = np.array(batch[:, 3].tolist(), dtype=np.float32).reshape(batch_size, -1)
                        b_done = np.array(batch[:, 4].tolist(), dtype=np.bool)
                        q = Q(b_pobs)
                        """ <<< DQN -> Double DQN
                        maxq = np.max(Q_ast(b_obs).data, axis=1)
                        === """
                        indices = np.argmax(q.data, axis=1)
                        maxqs = Q_ast(b_obs).data
                        """ >>> """
                        target = copy.deepcopy(q.data)
                        for j in range(batch_size):
                            """ <<< DQN -> Double DQN
                            target[j, b_pact[j]] = b_reward[j]+gamma*maxq[j]*(not b_done[j])
                            === """
                            target[j, b_pact[j]] = b_reward[j]+gamma*maxqs[j, indices[j]]*(not b_done[j])
                            """ >>> """
                        Q.reset()
                        loss = F.mean_squared_error(q, target)
                        total_loss += loss.data
                        loss.backward()
                        optimizer.update()
                if total_step % update_q_freq == 0:
                    Q_ast = copy.deepcopy(Q)
            # epsilon
            if epsilon > epsilon_min and total_step > start_reduce_epsilon:
                epsilon -= epsilon_decrease
            # next step
            total_reward += reward
            pobs = obs
            step += 1
            total_step += 1
        total_rewards.append(total_reward)
        total_losses.append(total_loss)
        if (epoch+1) % show_log_freq == 0:
            log_reward = sum(total_rewards[((epoch+1)-show_log_freq):])/show_log_freq
            log_loss = sum(total_losses[((epoch+1)-show_log_freq):])/show_log_freq
            elapsed_time = time.time()-start
            print('\t'.join(map(str, [epoch+1, epsilon, total_step, log_reward, log_loss, elapsed_time])))
            start = time.time()
            
    return Q, total_losses, total_rewards
```

제공된 코드는 트레이딩 환경을 해결하기 위해 Dueling Double Deep Q-Network (Dueling DDQN)을 훈련하는 train_dddqn() 함수를 정의합니다. 이 함수는 환경 env를 인수로 받고 선택적인 epoch_num 매개변수를 취하며 기본값은 50입니다. epoch_num은 훈련 에포크 수를 나타냅니다.

이 코드와 이전의 더블 DQN 구현 간의 주요 차이점은 Q_Network 클래스의 정의입니다. Dueling DDQN은 Q-Network 아키텍처를 수정하여 상태 가치를 추정하는 스트림과 각 작업의 어드밴티지 값을 추정하는 또 다른 스트림을 포함합니다. 두 스트림이 결합되어 최종 Q-값을 계산합니다.

<div class="content-ad"></div>

Q_Network 클래스는 chainer.Chain의 하위 클래스이며, 다섯 개의 완전 연결 레이어 (Linear 레이어)를 포함하고 있어요. __call__ 메서드에서 처음 두 개 레이어는 두 스트림 간에 공유되며, 그 다음에는 두 개의 별도 스트림으로 분리돼요. 상태 값 스트림은 추가 Linear 레이어 (state_value)를 가지고 있어요. 이 레이어는 단일 값 출력하고, 이에 반해 어드밴티지 값 스트림은 각 행동에 대한 값을 출력하기 위한 추가 Linear 레이어 (advantage_value)를 가지고 있어요. 최종 Q-값은 상태 값과 어드밴티지 값의 조합으로 계산되며, 안정성을 위해 평균 어드밴티지 값이 빼져요.

나머지 코드는 더블 DQN 구현과 매우 유사해요. Q-Network Q와 대상 네트워크인 Q_ast를 초기화하고, 옵티마이저를 설정하며, 훈련 과정을 위한 하이퍼파라미터를 정의해요. 훈련 루프는 여러 에포크를 반복하며, 입실론-그리디 전략을 사용하여 행동을 선택하고, 메모리 버퍼를 업데이트하며, Dueling DDQN 업데이트 규칙을 사용하여 Q-Network를 훈련시키고 있어요. 대상 네트워크 Q_ast는 기본 Q-Network의 가중치로 주기적으로 업데이트되며, 입실론은 최솟값에 도달할 때까지 선형적으로 감소해요.

훈련 과정을 마치면, 함수는 훈련된 Dueling DDQN 모델, 총 손실 및 각 에포크별 총 보상을 반환해요. 이 훈련된 모델은 테스트 환경에서 에이전트의 성능을 평가하거나 실제 세계의 거래 시나리오에서 예측을 수행하는 데 사용할 수 있어요.

```js
dddqn, total_losses, total_rewards = train_dddqn(Environment(train), epoch_num=25)
```

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_13.png)

이 코드 라인은 훈련 데이터셋을 사용하여 거래 환경에서 Dueling Double Deep Q-Network (Dueling DDQN)을 훈련하는 train_dddqn() 함수를 호출합니다. 이 함수는 두 개의 인수를 사용합니다:

- 환경(train): 훈련 데이터를 사용하여 새로운 거래 환경의 인스턴스를 생성합니다. 이 환경은 환경을 초기화하거나 시간 단계를 걸어가는 등의 데이터와 상호 작용하는 방법을 제공합니다.
- epoch_num=25: 이는 실행될 훈련 epochs의 수를 지정합니다. 이 경우, 25번의 epochs를 의미합니다. 각 epoch은 훈련 데이터셋을 완전히 통과하는 것을 의미하며, 에이전트가 환경과 상호 작용하고 Q-Network을 업데이트하며 경험으로부터 학습하는 것을 포함합니다.

train_dddqn() 함수는 세 가지 값을 반환합니다.


<div class="content-ad"></div>

- dddqn: 훈련된 Dueling DDQN 모델로, 테스트 환경이나 실제 시나리오에서 거래 결정을 내릴 때 사용할 수 있습니다.
- total_losses: 각 epoch별 총 손실값 목록입니다. 손실은 훈련 중 예측된 Q값과 대상 Q값 사이의 평균 제곱 오차로 계산됩니다. 이는 모델의 훈련 성능을 평가하고, 에이전트가 효과적으로 학습하는지를 평가하는 데 사용할 수 있습니다.
- total_rewards: 각 epoch별 총 보상값 목록입니다. 보상은 각 epoch 동안 에이전트의 성능을 측정한 것으로, 일반적으로 거래 중 발생한 이익이나 손실에 기반합니다. 이는 훈련 과정 전체에서 수익성 있는 거래 결정을 내리는 에이전트의 능력을 평가하는 데 사용될 수 있습니다.

이러한 반환 값을 변수에 할당함으로써, 훈련 결과를 추가로 분석하거나, 시간이 지남에 따라 손실과 보상을 플로팅하거나, 테스트 환경에서 훈련된 모델의 성능을 평가할 수 있습니다.

```js
plot_loss_reward(total_losses, total_rewards)
```

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_14.png" />

<div class="content-ad"></div>

plot_loss_reward(total_losses, total_rewards) 함수를 사용하면 모델의 손실과 보상을 시간에 따라 그래픽으로 나타낼 수 있어요. 이 함수는 두 개의 인수를 사용합니다:

- total_losses: 훈련 과정 중 각 에포크의 총 손실 목록입니다. 이러한 손실은 예측된 Q-값과 타겟 Q-값 사이의 차이로, 평균 제곱 오차로 계산됩니다. 시간이 지남에 따라 손실을 추적하면 학습 과정의 효과를 평가하고 모델이 최적 해결책으로 수렴하는지 여부를 판단하는 데 도움이 됩니다.
- total_rewards: 훈련 과정 중 각 에포크의 총 보상 목록입니다. 보상은 거래 환경에서 에이전트의 성능을 나타내는데, 일반적으로 거래 중 발생한 이익이나 손실에 기반합니다. 시간이 지남에 따라 보상을 모니터링하면 에이전트가 이윤을 창출하는 거래 결정을 내리는 능력을 평가하고 경험을 통해 결정력을 향상하는 데 도움이 됩니다.

이 함수는 두 개의 플롯을 생성합니다: 하나는 손실에 대한 것이고 다른 하나는 보상에 대한 것입니다. 각 플롯에는 x-축에 에포크 수가, y-축에는 해당 손실 또는 보상 값이 표시됩니다. 이러한 플롯은 훈련 진행 상황에 대한 시각적인 통찰력을 제공하여 학습 과정에서 트렌드나 문제를 식별하는 데 도움이 됩니다. 예를 들어, 감소하는 손실 트렌드는 모델이 효과적으로 학습하고 있음을 나타내며, 증가하는 보상 트렌드는 에이전트가 시간이 지남에 따라 이윤 창출하는 거래 결정에 능숙해지고 있는 것을 시사합니다.

```js
train_profits, test_profits = plot_train_test_by_q(Environment(train), Environment(test), dddqn, 'Dueling Double DQN')
```

<div class="content-ad"></div>


![plot_train_test_by_q](/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_15.png)

"plot_train_test_by_q" 함수 호출은 훈련된 Dueling Double DQN(DDDQN) 모델의 성능을 훈련 및 테스트 데이터에 대해 평가하고, 거래 과정에서 에이전트가 생성한 이익을 시각화하는 데 사용됩니다.

이 함수는 네 가지 인수를 사용합니다:

- Environment(train): 훈련 데이터셋을 사용하여 초기화 된 거래 환경의 인스턴스입니다.
- Environment(test): 테스트 데이터셋을 사용하여 초기화 된 거래 환경의 인스턴스입니다.
- dddqn: 환경에서 거래 결정을 내리는 데 사용되는 훈련된 DDDQN 모델입니다.
- `Dueling Double DQN`: DDDQN 모델을 사용하고 있음을 나타내는 생성된 플롯의 제목 역할을 하는 문자열입니다.


<div class="content-ad"></div>

DDDQN 모델의 성능을 평가하는 함수입니다. 해당 함수는 에이전트의 거래 활동을 시뮬레이션하고 각 거래 세션에서 생성된 이익을 수집하여 훈련 및 테스트 환경에서 모델의 성과를 평가합니다. 이익은 훈련 및 테스트 데이터셋에서 생성된 이익을 각각 나타내는 train_profits 및 test_profits 두 개의 별도 리스트에 저장됩니다.

마지막으로, 해당 함수는 훈련 및 테스트 데이터에 대한 거래 이익의 시간에 따른 시각화를 생성합니다. 이 그래프는 y-축에 에이전트가 생성한 누적 이익을, x-축에 거래 스텝을 나타냅니다. 훈련 및 테스트 데이터셋 상에서 에이전트의 성능을 비교함으로써 모델의 일반화 능력과 새로운, 보이지 않는 시장 데이터에 대한 적응 능력을 평가할 수 있습니다. 또한 시각화를 통해 훈련 데이터에서 뛰어난 성과를 보일지라도 테스트 데이터에서 어려움을 겪는 과적합 문제를 식별하는 데 도움이 됩니다.

Markdown 형식으로 변경된 코드를 참고해주세요.

<div class="content-ad"></div>

이 코드 스니펫은 DDDQN 기반 거래 에이전트의 성능을 "매수 및 보유" 전략과 비교하는 시각화를 생성하는 역할을 합니다. 이를 위해 각 접근 방식이 달성한 상대 이익을 동일한 그래프 상에 시각화합니다. 시각화는 Matplotlib 라이브러리를 사용하여 생성되며, 다음 단계로 구성됩니다:

- plt.figure(figsize=(23,8)): 지정된 너비와 높이(23인치 × 8인치)로 새로운 Matplotlib 피규어를 생성합니다.
- plt.plot(data.index,((data[`Close`]-data[`Close`][0])/data[`Close`][-1]), label=`buy and hold`): 현재 종가와 초기 종가의 차이를 최종 종가로 나눈 것으로 계산된 "매수 및 보유" 전략의 상대적 이익을 플롯합니다. x축은 시간 인덱스를, y축은 상대적 이익을 나타냅니다.
- plt.plot(train.index, ([0] + train_profits)/data[`Close`][-1], label=`rl (train)`): 학습 데이터셋에서 DDDQN 에이전트의 상대적 이익을 플롯합니다. x축은 학습 데이터셋의 시간 인덱스이며, y축은 누적 수익을 최종 종가로 나눈 상대적 이익을 나타냅니다.
- plt.plot(test.index, (([0] + test_profits) + train_profits[-1])/data[`Close`][-1], label=`rl (test)`): 테스트 데이터셋에서 DDDQN 에이전트의 상대적 이익을 플롯합니다. x축은 테스트 데이터셋의 시간 인덱스를, y축은 누적 수익과 학습 데이터셋의 최종 이익을 더한 것을 최종 종가로 나눈 상대적 이익을 보여줍니다.
- plt.plot(test.index, (([0] + test_profits) - data[`Close`][0] + data[`Close`][len(train_profits)])/data[`Close`][-1], label=`rl (test)`): 테스트 데이터셋에서 DDDQN 에이전트의 상대적 이익의 대체 버전을 플롯합니다. 누적 수익에서 초기 종가를 뺀 후 학습 데이터셋의 끝에서의 종가를 더한 것을 최종 종가로 나눈 것으로 계산됩니다.
- plt.ylabel(`relative gain`): y축 레이블을 "상대적 이익"으로 설정합니다.
- plt.legend(): 플롯에 라인의 레이블을 보여주는 범례를 추가합니다.
- plt.show(): 생성된 플롯을 표시합니다.

이 시각화는 DDDQN 거래 에이전트의 성능과 간단한 "매수 및 보유" 전략의 비교를 제공하여 특정 거래 문제에 대한 강화 학습 접근 방식의 효과를 평가할 수 있게 해줍니다.

# 상대적 신호 강도

<div class="content-ad"></div>

RSI는 추세 모멘텀을 나타내는 데 사용됩니다. 상단 영역은 매수 과다 상태를 나타내고, 하단 영역은 매도 과다 상태를 나타냅니다. RSI가 매수 과다 또는 매도 과다 영역에 도달하면 각각 추세가 강하게 하락하거나 상승하는 것을 의미하지만, 영역을 벗어나면 추세 반전이 발생할 수 있습니다.

```js
def calcRsi(series, period):
    """
    데이터 시리즈의 RSI 계산
    
    Parameters
    ----------
    series : 판다스 시리즈
        캔들스틱 데이터셋
    period : int
        각 계산의 기간
        
    Returns
    -------
    rsi : float
        계산된 rsi값
    """
    try:
        delta = series.diff().dropna()
        u = delta * 0
        d = u.copy()
        u[delta > 0] = delta[delta > 0]
        d[delta < 0] = -delta[delta < 0]
        u[u.index[period-1]] = np.mean( u[:period] ) # 첫 번째 값은 평균 이익의 합
        u = u.drop(u.index[:(period-1)])
        d[d.index[period-1]] = np.mean( d[:period] ) # 첫 번째 값은 평균 손실의 합
        d = d.drop(d.index[:(period-1)])
```

```js
        rs = u.ewm(com=period-1, adjust=False).mean() \
            / d.ewm(com=period-1, adjust=False).mean()
        
        rsi = 100 - 100 / (1 + rs)
    except IndexError:
        rsi = 0
        
    return rsi
column_value='Close'
column_index='Date'
data['RSI'] = calcRsi(data[column_value], 14)
#RSI
fig, ax = plt.subplots(figsize=(15,12))
ax.plot(data.index, data['RSI'])
ax.plot(data.index, data[column_value]/data[column_value][0]*100.0)
ax.axhline(y=70,color='r')
ax.axhline(y=30,color='r')
plt.text(s='매수 과다', x=data.index[0], y=70, fontsize=14)
plt.text(s='매도 과다', x=data.index[0], y=30, fontsize=14)
plt.legend()
#p = plt.setp(ax.xaxis.get_majorticklabels(), rotation=90, fontsize=8)
xmin, xmax = ax.get_xlim()
ax.set_xticks(np.linspace(xmin, xmax, 6))
plt.show()
```

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_17.png" />

<div class="content-ad"></div>

이 코드는 상대강도지수(Relative Strength Index, RSI)를 계산하는 calcRsi 함수를 정의하고 주식 시장 데이터를 포함하는 데이터 집합에 이 함수를 적용합니다. RSI는 상승장이나 하락장인지 판단하는 데 사용되는 인기 있는 기술적 지표입니다. RSI를 계산한 후 코드는 RSI와 주식의 정규화된 종가를 시각화하는 플롯을 생성합니다.

여기 코드의 상세한 설명입니다:

- calcRsi 함수는 두 개의 인자, 즉 가격 데이터를 포함하는 팬더 Series인 series와 RSI 계산에 사용되는 기간을 나타내는 period를 사용합니다.
- calcRsi 함수 내부에서 가격 시리즈의 첫 번째 차이를 계산하고 delta 변수에 저장합니다. 이는 한 기간에서 다음 기간까지의 가격 변동을 나타냅니다.
- u와 d라는 두 개의 새로운 Series가 생성됩니다. 이는 양수 가격 변동과 음수 가격 변동을 각각 나타냅니다. 양수 가격 변동은 u에 저장되고 음수 가격 변동(음수으로 곱한 값)은 d에 저장됩니다.
- 초기 기간의 평균 이익과 손실이 u와 d Series에 저장됩니다.
- u와 d의 지수 이동 평균(EMA)이 지정된 감쇠 계수를 사용하여 ewm 메서드를 통해 계산됩니다. 감쇠 계수는 초기 값인 u와 d의 평균 값을 고려하도록 기간 - 1로 설정되고 adjust=False로 설정됩니다.
- 상대강도(RS)는 u의 EMA를 d의 EMA로 나누어 계산됩니다. RSI는 그 후 100 - 100 / (1 + RS)로 계산됩니다.
- RSI는 데이터 DataFrame에 새 열로 추가됩니다.
- plt.subplots()를 사용하여 새로운 그림과 축이 생성됩니다. RSI와 정규화된 종가(0에서 100 범위로 스케일링)가 동일한 그래프에 플로팅됩니다.
- y축 값 70과 30에 오버보트(과매수)와 오버솔드(과매도) 임계값을 나타내는 수평선이 추가됩니다. 이러한 임계값을 표시하는 텍스트 레이블이 추가됩니다.
- x축 눈금을 동일하게 간격으로 설정하려면 np.linspace()를 사용합니다.
- 마지막으로 plt.show()를 사용하여 그래프가 표시됩니다.

이 코드는 주식의 RSI와 정규화된 종가를 동일한 그래프에 시각화함으로써 거래자가 상승장 및 하락장에 대한 주식의 가격 변동을 해당 RSI 값과의 관련성에 대해 분석하여 정보를 얻을 수 있도록 합니다.

<div class="content-ad"></div>

# 볼린저 밴드

볼린저 밴드는 가능한 추세 반전을 나타내는 데 사용됩니다. 추세선이 상단 밴드 또는 하단 밴드 중 하나를 통과하면 반전이 발생할 수 있다는 것을 의미합니다.

```js
def addBollinger(df, period=20, col='Close'):
    """
    데이터 프레임에 간단한 이동 평균 열 추가
```

```js
    Parameters
    ----------
    df : 판다 데이터프레임
        캔들스틱 데이터셋
    period : 정수
        각 계산의 기간
    Returns
    -------
    없음
    """
    bbmid_series = df[col].rolling(window=period).mean()
    series_stdev = df[col].rolling(window=period).std()
    df['BBUpperBand'] = bbmid_series + 2*series_stdev
    df['BBLowerBand'] = bbmid_series - 2*series_stdev
    df['BBBandwidth'] = df['BBUpperBand'] - df['BBLowerBand']  
    df['BBMiddleBand'] = bbmid_series
    
    return df

data = addBollinger(data)
column_value='Close'
column_index='Date'
#볼린저 밴드
fig, ax = plt.subplots(figsize=(15,12))
ax.plot(data.index, data[column_value], label='Close')
ax.plot(data.index, data['BBUpperBand'], c='orange', label='Upper Band')
ax.plot(data.index, data['BBLowerBand'], c='orange', label='Lower Band')
ax.plot(data.index, data['BBMiddleBand'], c='black', label='Middle Band')
plt.legend()
#p = plt.setp(ax.xaxis.get_majorticklabels(), rotation=90, fontsize=8)
xmin, xmax = ax.get_xlim()
ax.set_xticks(np.linspace(xmin, xmax, 6))
plt.show()
```

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_18.png" />

이 코드는 Bollinger Bands를 계산하고 제공된 주식 시장 데이터를 포함하는 팬더스 DataFrame에 추가하는 addBollinger 함수를 정의합니다. Bollinger Bands는 거래에서 가격 변동성을 측정하고 잠재적으로 매수 과잉 또는 매도 과잉 상태를 식별하는 데 사용되는 기술적분석 도구입니다. Bollinger Bands를 계산한 후에 코드는 종가 및 상한, 중간, 하한 Bollinger Bands를 시각화하는 플롯을 생성합니다.

다음은 코드의 상세한 설명입니다:

- addBollinger 함수는 세 가지 인수를 사용합니다: 주식 시장 데이터가 포함된 팬더스 DataFrame인 df; Bollinger Bands 계산에 사용되는 기간인 period; 그리고 가격 데이터를 포함하는 열인 col (기본값은 `Close`로 설정됨).
- addBollinger 함수 내에서 지정된 기간 동안의 가격 데이터의 단순 이동 평균(SMA)이 rolling 및 mean 메서드를 사용하여 계산되고 변수 bbmid_series에 저장됩니다.
- 지정된 기간 동안의 가격 데이터의 표준 편차가 rolling 및 std 메서드를 사용하여 계산되고 series_stdev 변수에 저장됩니다.
- 상하한 Bollinger Bands는 중간 밴드(SMA)에 표준 편차를 두 배 더하거나 빼서 계산됩니다. 이러한 값들은 데이터 DataFrame에 새 열 ‘BBUpperBand’ 및 ‘BBLowerBand’로 추가됩니다.
- 상하한 밴드 간의 차이인 Bollinger Bands 대역폭이 계산되어 데이터 DataFrame에 새 열 ‘BBBandwidth’로 추가됩니다.
- 중간 밴드 (SMA)도 데이터 DataFrame에 새 열 'BBMiddleBand'로 추가됩니다.
- 이제 Bollinger Bands를 포함하는 수정된 DataFrame이 반환됩니다.
- addBollinger 함수가 데이터 DataFrame에 Bollinger Bands를 추가하도록 호출됩니다.
- plt.subplots()를 사용하여 새로운 figure 및 axis가 작성됩니다. 종가, 상한 Bollinger Band, 하한 Bollinger Band, 그리고 중간 Bollinger Band가 동일한 그래프에 플로팅됩니다.
- 플롯을 구분하기 위해 범례가 추가됩니다.
- np.linspace()를 사용하여 x-축 틱을 균일 간격으로 설정합니다.
- 마지막으로 plt.show()를 사용하여 플롯을 표시합니다.

<div class="content-ad"></div>

이 코드는 Bollinger Bands를 시각화하여 종가를 함께 표시함으로써 주식의 가격 움직임을 Bollinger Bands와 비교 분석하여 신중한 거래 결정을 내릴 수 있는 방법을 제공합니다.

# 이동평균 수렴 발산

MACD는 현재 트렌드에서 시장이 힘을 잃고 있다는 것을 알려주는 다른 모멘텀 지표로, 시그널 선과 MACD 선이 교차하는 지점에서 주로 트렌드 반전이 예상됩니다.

```js
def addMACD(df, column_value='Close'):
    ema_fast = df[column_value].ewm(span=12).mean()
    ema_slow = df[column_value].ewm(span=26).mean()
    signal_line = df[column_value].ewm(span=9).mean()
    df['ema_fast'] = ema_fast
    df['ema_slow'] = ema_slow
    df['macd'] = ema_fast - ema_slow
    df['macd_signal'] = df.macd.ewm(span=9, adjust=False).mean()
    df['macdh'] = df['macd'] - df['macd_signal']
    return df
```

<div class="content-ad"></div>

```js
data = addMACD(data)
fig, ax = plt.subplots(figsize=(15,12))
ax.plot(data.index, data['ema_fast'], c='orange', label='빠른 EMA')
ax.plot(data.index, data['ema_slow'], c='blue', label='느린 EMA')
plt.legend()
p = plt.setp(ax.xaxis.get_majorticklabels(), rotation=90, fontsize=8)
plt.show()
fig, ax = plt.subplots(figsize=(15,12))
ax.plot(data.index, data['macd'], c='green')
# ax.bar(, height=)
ax.plot(data.index, data['macd_signal'], c='blue')
ax.axhline(y=0,color='black')
ax.fill_between(data.index, data['macdh'], color = 'gray', alpha=0.5, label='MACD 히스토그램')
#ax.set_xticklabels(data.index.reindex(ax.get_xticks()))
plt.legend()
p = plt.setp(ax.xaxis.get_majorticklabels(), rotation=90, fontsize=8)
plt.show()
```

이 코드는 MACD(Moving Average Convergence Divergence) 및 관련 지표를 계산하는 addMACD 함수를 정의합니다. 이 함수는 주식 시장 데이터를 포함한 pandas DataFrame에 대해 사용됩니다. MACD는 트레이더들이 잠재적인 추세 반전, 매수/매도 과열 상태, 거래 진입 또는 종료 지점을 식별하는 데 사용되는 인기 있는 모멘텀 기반 기술적 분석 도구입니다. 이 코드는 빠른/느린 지수 이동 평균(EMA) 및 MACD 라인, 시그널 라인, MACD 히스토그램을 시각화하는 두 개의 플롯을 생성합니다.


<div class="content-ad"></div>

위의 코드에 대한 자세한 설명입니다:

- addMACD 함수는 DataFrame df와 계산에 사용될 가격 데이터를 나타내는 선택적인 column_value 인수(기본값은 `Close`)를 가져옵니다.
- 12기간과 26기간의 지수이동평균(EMA)은 ewm 및 mean 메소드를 사용하여 계산되어 각각 ema_fast 및 ema_slow 변수에 저장됩니다.
- 9기간 EMA인 시그널 라인은 계산되어 signal_line 변수에 저장됩니다.
- 계산된 빠른 및 느린 EMAs는 데이터 DataFrame에 'ema_fast'와 'ema_slow'라는 새 열로 추가됩니다.
- MACD 라인은 빠른 및 느린 EMAs 간의 차이로 계산되어 데이터 DataFrame에 'macd'라는 새 열로 추가됩니다.
- MACD 시그널 라인은 MACD 라인의 9기간 EMA로 계산되고 데이터 DataFrame에 'macd_signal'이라는 새 열로 추가됩니다.
- MACD 히스토그램(MACDH)은 MACD 라인과 MACD 시그널 라인 간의 차이로 계산되어 데이터 DataFrame에 'macdh'라는 새 열로 추가됩니다.
- 이제 MACD 및 관련 지표를 포함하는 수정된 DataFrame이 반환됩니다.
- addMACD 함수를 사용하여 데이터 DataFrame에 MACD와 관련 지표를 추가합니다.
- 첫 번째 플롯은 빠른(12기간) 및 느린(26기간) EMAs를 나타냅니다. x축 레이블은 90도로 회전되고 글꼴 크기는 8로 설정됩니다.
- 두 번째 플롯은 MACD 라인, MACD 시그널 라인 및 MACD 히스토그램을 나타냅니다. MACD 라인은 초록색으로, 시그널 라인은 파란색으로 플롯됩니다. 또한 ax.axhline(y=0, color=`black`)를 사용하여 제로 라인도 플롯됩니다.
- MACD 히스토그램은 fill_between 메소드를 사용하여 MACD 라인과 시그널 라인 사이의 채워진 영역으로 시각화됩니다. x축 레이블은 90도로 회전되고 글꼴 크기는 8로 설정됩니다.
- 마지막으로, plt.show()를 사용하여 두 플롯을 모두 표시합니다.

이 코드는 MACD 및 관련 지표를 시각화하는 방법을 제공하여 트레이더가 주식의 가격 움직임을 MACD 지표와 관련하여 분석하여 정보에 기반한 거래 결정을 내릴 수 있도록 합니다.

```js
# 짧은 창과 긴 창 초기화
short_window = 40
long_window = 100
```

<div class="content-ad"></div>

```python
# `signals` DataFrame을 `signal` 열과 함께 초기화합니다
signals = pd.DataFrame(index=data.index)
signals['signal'] = 0.0
# 짧은 기간의 이동평균을 만듭니다
signals['short_mavg'] = data['Close'].rolling(window=short_window, min_periods=1, center=False).mean()
# 긴 기간의 이동평균을 만듭니다
signals['long_mavg'] = data['Close'].rolling(window=long_window, min_periods=1, center=False).mean()
# 트레이딩 신호 생성
signals['signal'][short_window:] = np.where(signals['short_mavg'][short_window:] 
                                            > signals['long_mavg'][short_window:], 1.0, 0.0)  
# 트레이딩 주문 생성
signals['positions'] = signals['signal'].diff()
```

이 코드는 데이터 DataFrame의 주식 데이터를 사용하여 간단한 이동평균 교차 트레이딩 전략을 만드는 내용입니다. 코드는 주어진 짧은 기간과 긴 기간을 사용하여 계산된 이동평균값과 이를 기반으로 하는 트레이딩 신호를 저장할 `signals` DataFrame을 초기화하고, 이를 기반으로 트레이딩 주문을 생성합니다.

다음은 각 단계에 대한 설명입니다:

- 짧은 기간과 긴 기간의 창 크기는 각각 40과 100으로 설정됩니다.
- 데이터 DataFrame과 동일한 인덱스를 가지는 새 DataFrame인 `signals`가 만들어지며, `signal` 열이 0.0으로 초기화됩니다.
- 'Close' 가격 데이터에 대해 짧은 이동평균(SMA)을 `short_window` (40) 크기의 창을 사용하여 계산합니다. 계산된 SMA는 `signals` DataFrame의 새 열인 `short_mavg`에 저장됩니다.
- 'Close' 가격 데이터에 대해 긴 이동평균(SMA)을 `long_window` (100) 크기의 창을 사용하여 계산합니다. 계산된 SMA는 `signals` DataFrame의 새 열인 `long_mavg`에 저장됩니다.
- 짧은 이동평균이 긴 이동평균보다 큰 경우, 40번째 데이터 이후부터 각 데이터 포인트에 대해 트레이딩 신호가 생성됩니다. 짧은 이평선이 더 길면 신호는 1.0 (매수 신호)로 설정되고, 그렇지 않으면 0.0 (수행 없음)으로 설정됩니다.
- 연속하는 트레이딩 신호 간의 차이를 계산하여 트레이딩 주문을 생성합니다. 생성된 주문은 `signals` DataFrame의 새 열 'positions'에 저장됩니다.


<div class="content-ad"></div>

이 코드는 기본 이동평균 크로스오버 거래 전략을 설정합니다. 짧은 이동평균이 긴 이동평균 위에 있을 때 전략은 "매수" 신호를 생성합니다. 짧은 이동평균이 긴 이동평균 아래에 있을 때는 어떠한 조치도 취하지 않습니다. signals DataFrame의 'positions' 열을 검토함으로써 거래 전략이 주식에 대한 포지션 진입 또는 청산을 제안하는 지점을 결정할 수 있습니다.

```js
fig = plt.figure(figsize=(10, 8))
```

```js
# 부분 그래프와 y-축 레이블 추가
ax1 = fig.add_subplot(111, ylabel='달러 가격')
# 종가 플로팅
data['Close'].plot(ax=ax1, color='회색', lw=2.)
# 짧은 이동평균과 긴 이동평균 플로팅
signals[['short_mavg', 'long_mavg']].plot(ax=ax1, lw=2.)
# 매수 신호 플로팅
ax1.plot(signals.loc[signals.positions == 1.0].index, 
         signals.short_mavg[signals.positions == 1.0],
         '^', markersize=10, color='자홍')
         
# 매도 신호 플로팅
ax1.plot(signals.loc[signals.positions == -1.0].index, 
         signals.short_mavg[signals.positions == -1.0],
         'v', markersize=10, color='검정')
         
# 그래프 표시
plt.show()
```

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_21.png" />

<div class="content-ad"></div>

이 코드는 이전에 생성한 signals DataFrame을 사용하여 이동평균 교차 거래 전략과 전략에서 생성된 매수/매도 신호를 시각화하는 플롯을 생성합니다.

다음은 코드가 하는 일입니다:

- plt.figure()를 사용하여 크기가 (10, 8)인 새로운 그림을 생성합니다.
- fig.add_subplot()을 사용하여 y-축 레이블을 'Price in $'로 하는 서브플롯을 그림에 추가합니다. 서브플롯은 ax1 변수에 할당됩니다.
- 데이터 DataFrame의 종가를 회색으로 그림과 두께가 2인 선으로 ax1에 플로팅합니다.
- signals DataFrame에서 장기 이동평균(short) 와 단기 이동평균(long)을 두께가 2인 선으로 동일한 서브플롯(ax1)에 플로팅합니다.
- positions이 1.0인 signals DataFrame의 데이터 포인트를 선택하여 매수 신호를 ax1에 플로팅합니다. 이러한 포인트는 크기가 10이고 자홍색(magenta)인 업워드 삼각형(^)으로 표시됩니다.
- positions이 -1.0인 signals DataFrame의 데이터 포인트를 선택하여 매도 신호를 ax1에 플로팅합니다. 이러한 포인트는 크기가 10이고 검정색(black)인 다운워드 삼각형(v)으로 표시됩니다.
- plt.show()를 사용하여 플롯을 표시합니다.

결과 플롯은 주가의 종가와 단기 및 장기 이동평균, 그리고 이동평균 교차 전략에서 생성된 매수 및 매도 신호를 시각화합니다. 이를 통해 전략의 성능을 더 잘 이해하고 주식 포지션 진입 또는 청산 지점을 식별하는 데 도움이 됩니다.

<div class="content-ad"></div>

```js
# 초기 자본 설정
initial_capital = 100 * data['Close'][0] #float(0.0)
```

```js
# DataFrame `positions` 생성
positions = pd.DataFrame(index=signals.index).fillna(0.0)
# 100주를 사기
positions['AAPL'] = 100 * signals['signal']

# 보유한 가치로 포트폴리오 초기화
portfolio = positions.multiply(data['Close'], axis=0)
# 소유 주식 수의 차이 저장
pos_diff = positions.diff()
# `holdings`를 포트폴리오에 추가
portfolio['holdings'] = (positions.multiply(data['Close'], axis=0)).sum(axis=1)
# `cash`를 포트폴리오에 추가
portfolio['cash'] = initial_capital - (pos_diff.multiply(data['Close'], axis=0)).sum(axis=1).cumsum()
# `total`을 포트폴리오에 추가
portfolio['total'] = portfolio['cash'] + portfolio['holdings']
# `returns`를 포트폴리오에 추가
portfolio['returns'] = portfolio['total'].pct_change()
fig = plt.figure(figsize=(10, 8))
ax1 = fig.add_subplot(111, ylabel='포트폴리오 가치($)')
# 달러로 된 자산 곡선 그리기
portfolio['total'].plot(ax=ax1, lw=2.)
# `buy` 거래를 자산 곡선에 그리기
ax1.plot(portfolio.loc[signals.positions == 1.0].index, 
         portfolio.total[signals.positions == 1.0],
         '^', markersize=10, color='m')
# `sell` 거래를 자산 곡선에 그리기
ax1.plot(portfolio.loc[signals.positions == -1.0].index, 
         portfolio.total[signals.positions == -1.0],
         'v', markersize=10, color='k')
# 그래프 보이기
plt.show()
```

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_22.png" />

해당 코드는 이동평균 교차 전략에서 생성된 거래 신호를 사용하여 시간 경과에 따른 포트폴리오 가치를 계산하고 자산 곡선과 매수/매도 신호를 시각화합니다.

<div class="content-ad"></div>

위 코드는 다음을 수행합니다:

- 초기 자본을 주식의 첫 번째 종가의 100배로 설정합니다.
- 동일한 인덱스를 가진 positions DataFrame이 생성되고 0으로 채워집니다.
- positions DataFrame에서 'AAPL' 열을 업데이트하여 거래 신호를 100주로 곱합니다.
- 포지션과 주식의 종가를 요소별로 곱하여 포트폴리오 DataFrame을 초기화합니다.
- 연속된 시간 간격 사이의 소유 주식의 차이를 계산하고 pos_diff DataFrame에 저장합니다.
- 포트폴리오 DataFrame에 총 보유 주식 가치를 나타내는 'holdings' 열을 추가합니다.
- 포트폴리오 DataFrame에 주식을 매수/매도한 후의 사용 가능 현금을 나타내는 'cash' 열을 추가합니다.
- 포트폴리오 DataFrame에 각 시간 단계에서 총 포트폴리오 가치(cash + holdings)를 나타내는 'total' 열을 추가합니다.
- 포트폴리오 DataFrame에 이전 시간 단계에서의 총 포트폴리오 가치의 백분율 변경을 나타내는 'returns' 열을 추가합니다.

나머지 코드는 자산 곡선(총 포트폴리오 가치)과 매수/매도 신호를 시각화합니다:

- plt.figure()를 사용하여 크기가 (10, 8)인 새로운 그림을 생성합니다.
- 'Portfolio value in $'로 y축에 레이블이 지정된 서브플롯이 생성되고 ax1 변수에 할당됩니다.
- 포트폴리오 DataFrame에서 총 포트폴리오 가치를 2의 선 두께로 ax1에 플롯합니다.
- positions이 1.0인 데이터 포인트를 선택하여 signals DataFrame에서 ax1에 매수 신호를 표시합니다. 이 지점은 크기가 10이고 자홍색(magenta)인 위로 향하는 삼각형(^)으로 표시됩니다.
- positions이 -1.0인 데이터 포인트를 선택하여 signals DataFrame에서 ax1에 매도 신호를 표시합니다. 이 지점은 크기가 10이고 검은색(k)인 아래로 향하는 삼각형(v)으로 표시됩니다.
- plt.show()를 사용하여 플롯을 표시합니다.

<div class="content-ad"></div>

플롯 결과는 포트폴리오의 자본 곡선을 시간에 따라 시각화하며, 이동 평균 교차 전략에 의해 생성된 매수 및 매도 신호를 함께 보여줍니다. 이는 전략의 성능과 포트폴리오 가치에 미치는 영향을 더 잘 이해하는 데 도움이 됩니다.

```js
env = Environment(data)
env.reset()
ongoing_profits = []
for i in range(1,len(signals['positions']-1)):
    a = signals['positions'][i]
    if a == -1:
        a = 2
    elif a == float('NaN'):
        a = 0
    obs, reward, done, profit = env.step(a)
    ongoing_profits.append(profit)
    
plt.figure(figsize=(23,8))
plt.plot(data.index,((data['Close']-data['Close'][0])/data['Close'][-1]), label='buy and hold')
plt.plot(data.index, ([0] + ongoing_profits)/data['Close'][-1], label='crossing strategy')
plt.ylabel('relative gain')
plt.legend()
plt.show()
```

<img src="/assets/img/2024-06-19-ForecastingStockUsingDeepReinforcementLearning_23.png" />

이 코드는 이동 평균 교차 전략의 성능을 시뮬레이션하고 지속적인 이익을 계산하며, 단순한 매수 및 보유 전략과 비교하여 상대 이익을 플롯합니다.

<div class="content-ad"></div>

위의 코드는 다음과 같은 작업을 수행합니다:

- Environment 클래스의 인스턴스를 생성하여 주식 데이터를 입력값으로 사용합니다.
- reset() 메서드를 사용하여 환경을 재설정합니다.
- 진행 중인 이익을 저장하기 위해 빈 리스트인 ongoing_profits를 초기화합니다.
- 코드는 signals[`positions`] 시리즈를 두 번째 요소부터 뒤에서 두 번째 요소까지 반복합니다.
- signals[`positions`] 시리즈의 각 요소에 대해 값에 따라 action 변수 a를 업데이트합니다:

  - a가 -1이면 a를 2로 설정합니다.
  - a가 NaN이면 a를 0으로 설정합니다.

- step() 메서드를 사용하여 작업 a로 환경을 업데이트하고, 새 관측값, 보상, 환경이 종료되었는지 여부(done), 이익을 반환합니다.
- 이익을 ongoing_profits 리스트에 추가합니다.
- plt.figure()를 사용하여 크기가 (23, 8)인 새 그림을 생성합니다.
- 매수 및 보유 전략의 상대적 이득을 나타내는 데이터를 플롯합니다. 이는 종가 차이를 마지막 종가로 나눈 비율입니다.
- 교차 전략의 상대적 이득을 플롯합니다. 이는 마지막 종가로의 이익 비율입니다.
- y축을 ‘상대적 이득’이라고 레이블을 지정합니다.
- 플롯에 범례를 추가합니다.
- plt.show()를 사용하여 플롯을 표시합니다.

<div class="content-ad"></div>

결과 플롯은 이동평균 교차 전략의 성능을 간단한 매수 보유 전략과 비교한 것을 보여줍니다. 이를 통해 이동평균 교차 전략의 효과를 이해하고 수동 투자 접근법과 비교할 수 있습니다.