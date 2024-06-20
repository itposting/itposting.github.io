---
title: "암호화폐 백테스팅 간단한 딥 러닝 전략의 놀라운 결과"
description: ""
coverImage: "/assets/img/2024-06-20-Back-testingCryptocurrenciesAstonishingResultsfromaSimpleDeepLearningStrategy_0.png"
date: 2024-06-20 18:11
ogImage: 
  url: /assets/img/2024-06-20-Back-testingCryptocurrenciesAstonishingResultsfromaSimpleDeepLearningStrategy_0.png
tag: Tech
originalTitle: "Back-testing Cryptocurrencies: Astonishing Results from a Simple Deep Learning Strategy"
link: "https://medium.com/@jsgastoniriartecabrera/backtesting-cryptocurrencies-astonishing-results-from-a-simple-deep-learning-strategy-584e06e6998c"
---


암호화폐 시장의 급격한 변동 속에서 백테스팅은 투자 전략을 검증하는 데 중요한 역할을 합니다. 본 연구는 비트코인, 이더리움, 바이낸스 코인, 솔라나 및 엑스알피와 같은 주요 암호화폐를 간단한 딥 러닝 모델을 활용해 평가하는 데 초점을 맞췄습니다. 놀랍게도, 이 방법은 다음과 같이 매우 뛰어난 성과 지표를 제시합니다:

- 샤프 비율: 19.898, 비법적인 위험 조정 수익을 나타냅니다.
- 소티노 비율: 114.442, 무시할 만한 하락 위험을 나타냅니다.
- 베타: -0.131, 역시장 상관 관계를 보여줍니다.
- 알파: 0.021, 주목할 만한 추세를 강조합니다.

이 간단하고 효과적인 딥 러닝 모델에 의해 높은 성과를 이룬 이러한 결과는 전략적인 투자에 대한 깊은 통찰을 제공합니다.

따라서, 우리는 바이낸스의 다섯 가지 암호화폐 쌍에 대해 (새 전략으로 불리는) 간단한 전략을 사용하여 백테스팅을 진행했습니다. 결과는 다음과 같습니다:

<div class="content-ad"></div>

BTCUSDT

![image1](/assets/img/2024-06-20-Back-testingCryptocurrenciesAstonishingResultsfromaSimpleDeepLearningStrategy_0.png)

![image2](/assets/img/2024-06-20-Back-testingCryptocurrenciesAstonishingResultsfromaSimpleDeepLearningStrategy_1.png)

ETHUSDT

<div class="content-ad"></div>

BNBUSDT

SOLUSDT

XRPUSDT

# ETH/USDT 백테스팅 성능 지표 분석

<div class="content-ad"></div>

간단한 딥 러닝 전략을 사용하여 ETH/USDT의 백 테스팅 결과는 다음과 같은 성능 지표를 보여줍니다:

- 평균 절대 오차 (MAE): 19.994, 예측 오차의 평균 크기를 나타냅니다.
- 제곱근 평균 제곱 오차 (RMSE): 25.152, 예측 값과 실제 값 사이의 평균 제곱 차이의 제곱근을 나타냅니다.
- R-제곱 (R²): 0.997, 예측 값과 실제 가격 사이에 매우 높은 상관 관계를 보여줍니다. 이는 모델이 변동성 거의 모두를 설명한다는 것을 의미합니다.
- 평균 절대 백분율 오차 (MAPE): 0.0007, 예측 값과 실제 값 사이의 평균 퍼센트 오차를 나타냅니다.
- 샤프 비율 (신 전략): 15.967, 새 전략의 우수한 리스크 조정 수익을 보여줍니다.
- 소티노 비율 (신 전략): 116.496, 최소한의 하향 리스크를 강조합니다.
- 베타 (신 전략): 0.048, 시장과의 낮은 양의 상관 관계를 보여줍니다.
- 알파 (신 전략): 0.022, 전략이 시장 기준에 비해 우수한 성과를 보여주는 것을 나타냅니다.
- 교차 검증 MAE: 661.709 ± 499.095, 모델의 예측 오차를 데이터의 다양한 하위 집합에 걸쳐 추정합니다.

이러한 지표들은 이 백 테스트에서 적용된 딥 러닝 전략의 높은 성능과 견고성을 강조합니다.

이것은 단지 예시일 뿐이며, 충분한 데이터가 있다면 바이낸스나 다른 거래소의 모든 심볼에서도 좋은 결과를 얻을 수 있을 것이라고 생각합니다.

<div class="content-ad"></div>

리플레이 결과

이 결과를 다시 확인하거나 새로 시도하려면 다음 코드를 사용할 수 있습니다:

- 모델 만들기

```js
import ccxt
import pandas as pd
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Conv1D, MaxPooling1D, Dropout, Flatten
import tf2onnx
import matplotlib.pyplot as plt
import numpy as np
from tensorflow.keras import callbacks
from tensorflow.keras.callbacks import ModelCheckpoint

# 바이낸스에서 데이터 다운로드하는 함수
def descargar_datos(symbol, timeframe='1d', start_date='2004-01-01T00:00:00Z', end_date='2024-01-01T00:00:00Z'):
    exchange = ccxt.binance({'enableRateLimit': False})
    since = exchange.parse8601(start_date)
    end_date_timestamp = pd.to_datetime(end_date, utc=True)
    all_data = []

    while since < end_date_timestamp.timestamp() * 1000:
        ohlc = exchange.fetch_ohlcv(symbol, timeframe=timeframe, since=since)
        all_data.extend(ohlc)
        since = ohlc[-1][0] + 1  # 'since' 매개변수 1밀리초 증가

    df = pd.DataFrame(all_data, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    df.set_index('timestamp', inplace=True)

    # 두 데이터 모두 타임존이 설정되어 있는지 확인하거나 필요한 경우 변환
    if df.index.tz is None:
        df.index = df.index.tz_localize('utc')
    
    df = df[df.index <= end_date_timestamp]
    print(df)
    return df['close'].values

# 데이터 불러오기
data = descargar_datos('ETH/USDT')

# 데이터 정규화
scaler = MinMaxScaler(feature_range=(0, 1))
data = scaler.fit_transform(data.reshape(-1, 1))

# 시퀀스에서 샘플 생성하는 함수
def crear_muestras(dataset, pasos_de_tiempo=120):
    X, y = [], []
    for i in range(pasos_de_tiempo, len(dataset)):
        X.append(dataset[i-pasos_de_tiempo:i, 0])
        y.append(dataset[i, 0])
    return np.array(X), np.array(y)

# 훈련 및 테스트 데이터 준비
pasos_de_tiempo = 120
X, y = crear_muestras(data, pasos_de_tiempo)
X = X.reshape(X.shape[0], X.shape[1], 1)  # LSTM용 변경

# 데이터 분할 (훈련에 80% 할당)
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# 모델 훈련

model = Sequential()
model.add(Conv1D(filters=256, kernel_size=2, activation='relu',padding = 'same',input_shape=(X_train.shape[1],1)))
model.add(MaxPooling1D(pool_size=2))
model.add(LSTM(100, return_sequences = True))
model.add(Dropout(0.3))
model.add(LSTM(100, return_sequences = False))
model.add(Dropout(0.3))
model.add(Dense(units=1, activation = 'sigmoid'))
model.compile(optimizer='adam', loss= 'mse' , metrics = [tf.keras.metrics.RootMeanSquaredError(name='rmse')])

# 조기 종료 설정
early_stopping = callbacks.EarlyStopping(
    monitor='val_loss',
    patience=10,
    restore_best_weights=True,
)
# 최적의 모델 저장할 체크포인트 설정
checkpoint = ModelCheckpoint(
    'best_model.h5', 
    monitor='val_loss', 
    save_best_only=True, 
    save_weights_only=False
)

# 300 에폭 학습
history = model.fit(X_train, y_train, epochs = 300 , validation_data = (X_test,y_test), batch_size=32, callbacks=[early_stopping, checkpoint], verbose=2)

# 훈련 이력 그래프
plt.figure(figsize=(10, 5))
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.plot(history.history['rmse'], label='Train RMSE')
plt.plot(history.history['val_rmse'], label='Validation RMSE')
plt.title('Model Training History')
plt.xlabel('Epochs')
plt.ylabel('Loss/RMSE')
plt.legend()
plt.savefig('ETHUSDT.png')  # 그래프 이미지 파일로 저장

# 모델을 ONNX로 변환
onnx_model, _ = tf2onnx.convert.from_keras(model, opset=13, output_path="model_ethusdt.onnx")
print("ONNX 모델을 'model_ethusdt.onnx'로 저장했습니다.")

# 모델 평가
train_loss, train_rmse = model.evaluate(X_train, y_train, verbose=0)
test_loss, test_rmse = model.evaluate(X_test, y_test, verbose=0)
print(f"train_loss={train_loss:.3f}, train_rmse={train_rmse:.3f}")
print(f"test_loss={test_loss:.3f}, test_rmse={test_rmse:.3f}")
```

<div class="content-ad"></div>

- 백테스팅

```js
import ccxt
import pandas as pd
import numpy as np
import onnx
import onnxruntime as ort
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error
from sklearn.model_selection import TimeSeriesSplit

# 바이낸스 거래소 인스턴스 생성
binance = ccxt.binance()

# 시장 심볼 및 시간 간격 정의
symbol = 'ETH/USDT'
timeframe = '1d'
limit = 1000  # 120일 신뢰 구간 보장을 위한 충분한 데이터 다운로드

# 역사적 데이터 다운로드
ohlcv = binance.fetch_ohlcv(symbol, timeframe, limit=limit)

# 데이터를 판다스 DataFrame으로 변환
df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')

# 데이터를 CSV 파일로 저장
df.to_csv('binance_data.csv', index=False)
print("'binance_data.csv'에 다운로드 및 저장된 데이터")

# 다운로드한 데이터 로드
data = pd.read_csv('binance_data.csv')

# 'timestamp' 열을 datetime 형식으로 변환
data['timestamp'] = pd.to_datetime(data['timestamp'])

# 정규화 값(정규화에 사용한 값에 맞게 조정)
min_close = data['close'].min()
max_close = data['close'].max()

# 종가 데이터 정규화
data['close_normalized'] = (data['close'] - min_close) / (max_close - min_close)

# ONNX 모델 로드
model = onnx.load('model_ethusdt.onnx')
onnx.checker.check_model(model)

# 런타임 세션 생성
ort_session = ort.InferenceSession('model_ethusdt.onnx')

# 모델에 주입할 데이터를 슬라이딩 윈도우로 준비
input_name = ort_session.get_inputs()[0].name
sequence_length = 120  # 모델에 따라 조정

# 예측값을 저장할 리스트 생성
predictions_list = []

# 예측 시작 날짜 설정
start_date = pd.Timestamp('2024-01-01')
end_date = pd.Timestamp.today()

# 날짜별 추론 실행
current_date = start_date
while current_date <= end_date:
    # 현재 날짜 이전 120일 데이터 선택
    end_idx = data[data['timestamp'] <= current_date].index[-1]
    start_idx = end_idx - sequence_length + 1

    if start_idx < 0:
        print(f"{current_date} 날짜에 대한 데이터 부족")
        break

    # 정규화된 데이터 윈도우 추출
    window = data['close_normalized'].values[start_idx:end_idx+1]

    if len(window) < sequence_length:
        print(f"{current_date} 날짜에 대한 데이터 부족")
        break

    # 모델에 입력할 데이터 준비
    input_window = np.array(window).astype(np.float32)
    input_window = np.expand_dims(input_window, axis=0)  # 배치 크기 차원 추가
    input_window = np.expand_dims(input_window, axis=2)  # 특성 차원 추가

    # 추론 실행
    output = ort_session.run(None, {input_name: input_window})
    prediction = output[0][0][0]

    # 예측값 역정규화
    prediction = prediction * (max_close - min_close) + min_close

    # 예측값 저장
    predictions_list.append({'date': current_date, 'prediction': prediction})

    # 날짜 증가
    current_date += pd.Timedelta(days=1)

# 예측값 리스트를 DataFrame으로 변환
predictions_df = pd.DataFrame(predictions_list)

# 예측값을 CSV 파일로 저장
predictions_df.to_csv('predicted_data.csv', index=False)
print("'predicted_data.csv'에 저장된 예측값")

# 예측값과 실제 값 비교
comparison_df = pd.merge(predictions_df, data[['timestamp', 'close']], left_on='date', right_on='timestamp')
comparison_df = comparison_df.drop(columns=['timestamp'])
comparison_df = comparison_df.rename(columns={'close': 'actual'})

# 오차 메트릭 계산
mae = mean_absolute_error(comparison_df['actual'], comparison_df['prediction'])
rmse = np.sqrt(mean_squared_error(comparison_df['actual'], comparison_df['prediction']))
r2 = r2_score(comparison_df['actual'], comparison_df['prediction'])
mape = mean_absolute_percentage_error(comparison_df['actual'], comparison_df['prediction'])
print(f'평균 절대 오차(MAE): {mae}')
print(f'제곱근 평균 제곱 오차(RMSE): {rmse}')
print(f'R^2 점수 (R2): {r2}')
print(f'평균 절대 백분율 오차(MAPE): {mape}')

# 오차 밴드가 있는 그래프 그리기
plt.figure(figsize=(14, 7))
plt.plot(comparison_df['date'], comparison_df['actual'], label='실제 가격', color='blue')
plt.plot(comparison_df['date'], comparison_df['prediction'], label='예측 가격', color='red')
plt.fill_between(comparison_df['date'], comparison_df['prediction'] - mae, comparison_df['prediction'] + mae, color='gray', alpha=0.2, label='오차 밴드 (MAE)')
plt.xlabel('날짜')
plt.ylabel('가격')
plt.title(f'{symbol} 가격 예측 대 비교')
plt.legend()
plt.savefig(f"{symbol.replace('/', '_')}_price_prediction.png")
plt.show()
print(f"'{symbol.replace('/', '_')}_price_prediction.png'로 그래프 저장됨")

# 잔차 분석
residuals = comparison_df['actual'] - comparison_df['prediction']
plt.figure(figsize=(14, 7))
plt.plot(comparison_df['date'], residuals, label='잔차', color='purple')
plt.axhline(0, color='black', linestyle='--', linewidth=0.8)
plt.xlabel('날짜')
plt.ylabel('잔차')
plt.title(f'{symbol} 예측 잔차')
plt.legend()
plt.savefig(f"{symbol.replace('/', '_')}_residuals.png")
plt.show()
print(f"'{symbol.replace('/', '_')}_residuals.png'로 잔차 그래프 저장됨")

# 상관관계 분석
correlation = comparison_df['actual'].corr(comparison_df['prediction'])
print(f'실제 및 예측 가격 간 상관관계: {correlation}')

# 예측 기반 투자 전략 시뮬레이션 (원본 전략)
investment_df = comparison_df.copy()
investment_df['strategy_returns'] = (investment_df['prediction'].shift(-1) - investment_df['actual']) / investment_df['actual']
investment_df['buy_and_hold_returns'] = (investment_df['actual'].shift(-1) - investment_df['actual']) / investment_df['actual']

strategy_cumulative_returns = (investment_df['strategy_returns'] + 1).cumprod() - 1
buy_and_hold_cumulative_returns = (investment_df['buy_and_hold_returns'] + 1).cumprod() - 1

plt.figure(figsize=(14, 7))
plt.plot(investment_df['date'], strategy_cumulative_returns, label='전략 누적 수익', color='green')
plt.plot(investment_df['date'], buy_and_hold_cumulative_returns, label='매수 및 보유 누적 수익', color='orange')
plt.xlabel('날짜')
plt.ylabel('누적 수익률')
plt.title(f'{symbol} 투자 전략 대 매수 및 보유')
plt.legend()
plt.savefig(f"{symbol.replace('/', '_')}_investment_strategy.png")
plt.show()
print(f"'{symbol.replace('/', '_')}_investment_strategy.png'로 투자 전략 그래프 저장됨")

# 손실 전망
investment_df['drawdown'] = strategy_cumulative_returns.cummax() - strategy_cumulative_returns
investment_df['max_drawdown'] = investment_df['drawdown'].max()

plt.figure(figsize=(14, 7))
plt.plot(investment_df['date'], investment_df['drawdown'], label='Drawdown', color='red')
plt.xlabel('날짜')
plt.ylabel('Drawdown')
plt.title(f'{symbol} 전략 Drawdown')
plt