---
title: "간단한 딥러닝 전략으로 암호화폐 백테스팅 결과 공개 버전 2"
description: ""
coverImage: "/assets/img/2024-06-23-BacktestingCryptocurrenciesAstonishingResultsfromaSimpleDeepLearningStrategyV2_0.png"
date: 2024-06-23 18:42
ogImage: 
  url: /assets/img/2024-06-23-BacktestingCryptocurrenciesAstonishingResultsfromaSimpleDeepLearningStrategyV2_0.png
tag: Tech
originalTitle: "Back testing Cryptocurrencies Astonishing Results from a Simple Deep Learning Strategy V2"
link: "https://medium.com/@jsgastoniriartecabrera/back-testing-cryptocurrencies-astonishing-results-from-a-simple-deep-learning-strategy-v2-54d55b4f5048"
---


과거 글이 많은 댓글을 유발하고 의심스럽다는 점을 감안해 코드를 수정하고 결과를 보여드렸어요. 만약 수정할 부분을 발견하시면 알려주세요. 코드나 ONNX 모델이 필요하면 Github 페이지 링크를 남겨드릴게요.

수정한 코드 결과는 다음과 같아요:

![image](/assets/img/2024-06-23-BacktestingCryptocurrenciesAstonishingResultsfromaSimpleDeepLearningStrategyV2_0.png)

```js
평균 절대 오차(MAE): 3.343354936528137
제곱근 평균 제곱 오차(RMSE): 4.441722762531883
R-제곱(R2): 0.980843427945431
평균 절대 백분율 오차(MAPE): 0.023306784351538545
'SOL_USDT_price_prediction.png'로 저장된 그래프
실제 가격과 예측 가격의 상관 관계: 0.9927086445091788
'Estrategia Original'의 샤프 비율: -5.9404285882999135
'New Strategy'의 샤프 비율: 18.33714244833774
'New Strategy'의 Sortino Ratio: 117.31843386969027
'New Strategy'의 Beta: 0.09456945402128551
'New Strategy'의 Alpha: 0.03367816559565025
Cross-Validation 평균 절대 오차: 91.0050376257974 ± 41.98080676345999
SMA 평균 절대 오차(MAE): 21.129903598484848
SMA 제곱근 평균 제곱 오차(RMSE): 30.88072668067209
SMA R-제곱(R2): 0.6086608043283657
```

<div class="content-ad"></div>

이것은 설명 동영상입니다:

다음은 수정된 코드입니다:

```js
import ccxt
import pandas as pd
import numpy as np
import onnx
import onnxruntime as ort
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error
from sklearn.model_selection import TimeSeriesSplit

# 바이낸스 거래소의 인스턴스 생성
binance = ccxt.binance()

# 시장 심볼과 시간 간격 설정
symbol = 'SOL/USDT'
timeframe = '1d'
limit = 1000  # 120일의 데이터 윈도우를 보장하기 위한 충분한 데이터 다운로드

# 과거 데이터 다운로드
ohlcv = binance.fetch_ohlcv(symbol, timeframe, limit=limit)

# 데이터를 판다스 DataFrame으로 변환
df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')

# 데이터를 CSV 파일로 저장
df.to_csv('binance_data.csv', index=False)
print("'binance_data.csv'에 다운로드 및 저장된 데이터")

# 다운로드된 데이터 로드
data = pd.read_csv('binance_data.csv')

# 'timestamp' 열을 날짜 형식으로 변경
data['timestamp'] = pd.to_datetime(data['timestamp'])

# 정규화 값 (사용한 값에 맞게 조정)
min_close = data['close'].min()
max_close = data['close'].max()

# 종가 데이터를 정규화
data['close_normalized'] = (data['close'] - min_close) / (max_close - min_close)

# ONNX 모델 로드
model = onnx.load('model_solusdt.onnx')
onnx.checker.check_model(model)

# 런타임 세션 생성
ort_session = ort.InferenceSession('model_solusdt.onnx')

# 슬라이딩 윈도우 형태로 모델에 입력할 데이터 준비
input_name = ort_session.get_inputs()[0].name
sequence_length = 120  # 모델에 따라 조정

# 예측값 저장할 리스트 생성
predictions_list = []

# 예측 시작 날짜 설정
start_date = pd.Timestamp('2024-01-01')
end_date = pd.Timestamp.today()

# 하루씩 추론 실행
current_date = start_date
while current_date < end_date:
    # 현재 날짜 이전 120일 데이터 선택
    end_idx = data[data['timestamp'] < current_date].index[-1]
    start_idx = end_idx - sequence_length + 1
    
    if start_idx < 0:
        print(f"{current_date}일에 대한 충분한 데이터가 없습니다.")
        break
    
    # 정규화된 데이터 윈도우 가져오기
    window = data['close_normalized'].values[start_idx:end_idx+1]
    
    if len(window) < sequence_length:
        print(f"{current_date}일에 대한 충분한 데이터가 없습니다.")
        break
    
    # 모델을 위한 데이터 준비
    input_window = np.array(window).astype(np.float32)
    input_window = np.expand_dims(input_window, axis=0)  # 배치 사이즈 차원 추가
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

# 예측값과 실제값 비교
comparison_df = pd.merge(predictions_df, data[['timestamp', 'close']], left_on='date', right_on='timestamp')
comparison_df = comparison_df.drop(columns=['timestamp'])
comparison_df = comparison_df.rename(columns={'close': 'actual'})

# 에러 메트릭스 계산
mae = mean_absolute_error(comparison_df['actual'], comparison_df['prediction'])
rmse = np.sqrt(mean_squared_error(comparison_df['actual'], comparison_df['prediction'])
r2 = r2_score(comparison_df['actual'], comparison_df['prediction'])
mape = mean_absolute_percentage_error(comparison_df['actual'], comparison_df['prediction'])
print(f'Mean Absolute Error (MAE): {mae}')
print(f'Root Mean Squared Error (RMSE): {rmse}')
print(f'R-squared (R2): {r2}')
print(f'Mean Absolute Percentage Error (MAPE): {mape}')

# 그래프 그리기
plt.figure(figsize=(14, 7))
plt.plot(comparison_df['date'], comparison_df['actual'], label='실제 가격', color='blue')
plt.plot(comparison_df['date'], comparison_df['prediction'], label='예측된 가격', color='red')
plt.fill_between(comparison_df['date'], comparison_df['prediction'] - mae, comparison_df['prediction'] + mae, color='gray', alpha=0.2, label='에러 밴드 (MAE)')
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

# 상관 관계 분석
correlation = comparison_df['actual'].corr(comparison_df['prediction'])
print(f'실제 가격과 예측 가격 간 상관 관계: {correlation}')

# 투자 전략 시뮬레이션 (기존 전략)
investment_df = comparison_df.copy()
investment_df['strategy_returns'] = (investment_df['prediction'].shift(-1) - investment_df['actual']) / investment_df['actual']
investment_df['buy_and_hold_returns'] = (investment_df['actual'].shift(-1) - investment_df['actual']) / investment_df['actual']

strategy_cumulative_returns = (investment_df['strategy_returns'] + 1).cumprod() - 1
buy_and_hold_cumulative_returns = (investment_df['buy_and_hold_returns'] + 1).cumprod() - 1

plt.figure(figsize=(14, 7))
plt.plot(investment_df['date'], strategy_cumulative_returns, label='전략 누적 수익', color='green')
plt.plot(investment_df['date'], buy_and_hold_cumulative_returns, label='보유 및 보유 누적 수익', color='orange')
plt.xlabel('날짜')
plt.ylabel('누적 수익')
plt.title(f'{symbol} 투자 전략 대 보유 및 보유')
plt.legend()
plt.savefig(f"{symbol.replace('/', '_')}_investment_strategy.png")
plt.show()
print(f"'{symbol.replace('/', '_')}_investment_strategy.png'로 투자 전략 그래프 저장됨")

# 손실 표시 계산
investment_df['drawdown'] = strategy_cumulative_returns.cummax() - strategy_cumulative_returns
investment_df['max_drawdown'] = investment_df['drawdown'].max()

plt.figure(figsize=(14, 7))
plt.plot(investment_df['date'], investment_df['drawdown'], label='손실', color='red')
plt.xlabel('날짜')
plt.ylabel('손실')
plt.title(f'{symbol} 전략 손실')
plt.legend()
plt.savefig(f"{symbol.replace('/', '_')}_drawdown.png")
plt.show()
print(f"'{symbol.replace

<div class="content-ad"></div>

```
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

# Binance 데이터를 다운로드하는 함수
def descargar_datos(symbol, timeframe='1d', start_date='2000-01-01T00:00:00Z', end_date='2024-01-01T00:00:00Z'):
    exchange = ccxt.binance({'enableRateLimit': False})
    since = exchange.parse8601(start_date)
    end_date_timestamp = pd.to_datetime(end_date, utc=True)
    all_data = []

    while since < end_date_timestamp.timestamp() * 1000:
        ohlc = exchange.fetch_ohlcv(symbol, timeframe=timeframe, since=since)
        all_data.extend(ohlc)
        since = ohlc[-1][0] + 1  # `since`를 1밀리초 증가

    df = pd.DataFrame(all_data, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
    df.set_index('timestamp', inplace=True)

    # 두 시간대가 timezone-aware하지 않으면 변환
    if df.index.tz is None:
        df.index = df.index.tz_localize('utc')
    
    df = df[df.index <= end_date_timestamp]
    print(df)
    return df['close'].values

# 데이터 불러오기
data = descargar_datos('SOL/USDT')

# 데이터 정규화
scaler = MinMaxScaler(feature_range=(0, 1))
data = scaler.fit_transform(data.reshape(-1, 1))

# 시퀀스에서 샘플을 생성하는 함수
def crear_muestras(dataset, pasos_de_tiempo=120):
    X, y = [], []
    for i in range(pasos_de_tiempo, len(dataset)):
        X.append(dataset[i-pasos_de_tiempo:i, 0])
        y.append(dataset[i, 0])
    return np.array(X), np.array(y)

# 훈련 및 테스트 데이터 준비
pasos_de_tiempo = 120
X, y = crear_muestras(data, pasos_de_tiempo)
X = X.reshape(X.shape[0], X.shape[1], 1)  # LSTM에 맞게 재구성

# 데이터 분할 (훈련용 80%)
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
    patience=5,
    restore_best_weights=True,
)
# 가장 좋은 모델 저장
checkpoint = ModelCheckpoint(
    'best_model.h5', 
    monitor='val_loss', 
    save_best_only=True, 
    save_weights_only=False
)


# 300 에포크로 모델 훈련
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
plt.savefig('SOLUSDT.png')  # 그래프를 이미지 파일로 저장

# 모델을 ONNX로 변환
onnx_model, _ = tf2onnx.convert.from_keras(model, opset=13, output_path="model_solusdt.onnx")
print("ONNX 모델을 'model_solusdt.onnx'로 저장했습니다.")

# 모델 평가
train_loss, train_rmse = model.evaluate(X_train, y_train, verbose=0)
test_loss, test_rmse = model.evaluate(X_test, y_test, verbose=0)
print(f"train_loss={train_loss:.3f}, train_rmse={train_rmse:.3f}")
print(f"test_loss={test_loss:.3f}, test_rmse={test_rmse:.3f}")


github: Back-testing Cryptocurrencies Astonishing Results from a Simple Deep Learning Strategy

youtube explanation: [여기를 클릭하여 유튜브 설명 보기](https://youtu.be/z_taWHp_HaI)
