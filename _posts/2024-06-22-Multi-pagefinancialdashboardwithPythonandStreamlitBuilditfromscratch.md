---
title: "파이썬과 Streamlit으로 멀티페이지 금융 대시보드 만들기 처음부터 끝까지 완성하기"
description: ""
coverImage: "/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_0.png"
date: 2024-06-22 17:01
ogImage: 
  url: /assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_0.png
tag: Tech
originalTitle: "Multi-page financial dashboard with Python and Streamlit: Build it from scratch."
link: "https://medium.com/python-in-plain-english/multi-page-financial-dashboard-with-python-and-streamlit-build-it-from-scratch-feb92cd7e676"
---


<img src="/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_0.png" />

개인화된 작업 공간을 상상해보세요. 여기서는 상품, ETF, 과소평가된 주식, 그리고 변동성 있는 암호화폐 시장을 각각 별도의 탭에서 동시에 모니터링할 수 있습니다. 이러한 설정은 데이터를 손쉽게 접근할 수 있는 것 이상을 제공합니다. 표준 도구들이 제공하는 유연성 부족으로 자주 허용되지 않는 방식으로 이 데이터를 통합하고 상호작용할 수 있게됩니다. 여러분의 대시보드를 구축함으로써, 관련성 있는 지표를 강조함으로써 유연성을 얻을 수 있고, 사용자 정의 필터를 적용하고, 심지어 시장 변동에 실시간으로 반응하는 고급 분석 도구를 통합할 수 있습니다.

투자 결정에 중요한 고유한 지표들을 간과할 수 있는 범용 인터페이스에 의존할 필요가 없습니다. 여러분의 대시보드를 생성함으로써, 데이터 분석 과정을 통제하고 시장에 대한 더 깊은 이해를 기르는 전략적인 과정이 됩니다. 이제 이 혁신적인 도구를 만드는 것을 시작해봅시다.

데이터 작업에 파이썬보다 더 나은 것이 무엇인가요? 그리고 데이터를 분석하는 데 가장 사용자 친화적인 방법이 무엇인가요? 우리는 파이썬에 대해 더 많은 이해가 있고, Streamlit을 소개할게요. 이 Streamlit은 데이터 분석을 위한 대화형 웹 애플리케이션을 빠르고 쉽게 구축할 수 있는 강력한 오픈 소스 파이썬 라이브러리입니다.

<div class="content-ad"></div>

모든 난이도의 개발자를 대상으로 설계된 Streamlit은 데이터 스크립트를 공유 가능한 웹 앱으로 쉽게 변환할 수 있도록 도와줍니다.

# Streamlit을 특별하게 만드는 요소는 무엇인가요?

1. 사용 용이성: Streamlit의 매력은 그 간단함에 있습니다. 직관적인 Python 코드로 앱을 작성하므로 HTML, CSS 또는 JavaScript와 같은 복잡한 웹 기술을 알 필요가 없습니다. 이 사용자 친화적인 방식은 웹 프로그래밍 경험이 부족한 데이터 과학자와 분석가들에게 앱 개발의 가능성을 열어줍니다.

2. 빠른 프로토타이핑: Streamlit을 사용하면 코드를 수정하면 해당 변경 사항이 앱 인터페이스에 자동으로 업데이트되어 이터레이션 과정이 매우 신속해집니다. 이 기능을 이용하면 앱을 동적으로 조정하고 실시간으로 결과를 확인할 수 있어 빠른 프로토타이핑과 실험에 매우 유용합니다.

<div class="content-ad"></div>

3. 다양한 내장 위젯: Streamlit에는 슬라이더, 체크박스, 드롭다운과 같은 다양한 내장 위젯이 포함되어 있어 데이터와 상호 작용하기가 매우 쉽습니다. 이러한 요소들은 코드를 최소한으로 사용하여 추가할 수 있어 사용자가 표시된 데이터나 수행 중인 계산을 조작할 수 있게 해줍니다.

4. 데이터 시각화 지원: Streamlit은 Matplotlib, Seaborn, Plotly와 같은 주요 Python 데이터 시각화 라이브러리와 완벽하게 통합되어 있습니다. 이 통합을 통해 차트, 지도 및 그래프를 쉽게 앱에 통합하여 데이터를 더욱 매력적이고 정보를 제공하는 방식으로 시각화할 수 있습니다.

자, 그럼 더 이상의 말이 필요 없죠. 이를 만들어 봅시다. 먼저, 필요한 것을 이해해봅시다: 사용자로서, 주요 재정 데이터를 한 곳에 표시하고 4가지 관심 영역(Crypto, ETF, 주식, 상품) 간에 쉽게 탐색할 수 있기를 원합니다. 아래는 이 모든 세그먼트에 대한 요구 사항입니다.

- Cryptos: 시가 총액을 기준으로 상위 500개의 가상 화폐에 대한 실시간 가격 및 이전 종가, 시장 변동 폭, 7일 변동 사항을 표시합니다.
- ETFs: 펀드의 성과 지표: 현재 가격, 52주 최고 및 최저가, 연 별 ETF 수익률(%), 배당 수익률 및 ETF의 실제 옵션에 대한 정보입니다.
- Stocks: 주식의 현재 가격을 수집하고 주요 지표인 주가수익(P/E) 비율, 주당순이익(EPS)을 함께 제시합니다. 그것을 기반으로 설정한 임계값과 함께, 주식의 공정 가치를 계산하여 현재 주식 가치와 공정 주식 가치 간의 차이를 보여줍니다(차이가 충분히 크다면, 아마도 가격이 저평가된 주식일 것입니다).
- Commodities: 현재 시장 가격, 과거 추이 (그래프), 판매 단위를 표시합니다(주식과는 다르게 각 상품에는 다른 측정 단위가 있으며, 이전 종가로부터의 가격 변동).

<div class="content-ad"></div>

"알았다고 했잖아!", 버니 맥의 캐릭터가 "오션스 13”에서 강조했던 것처럼. 코드 작업을 시작해봐요.

새로운 파이썬 프로젝트를 만들고 중요한 몇 가지 파일을 포함해보세요: ETF 목록과 코드로 분석할 주식 목록이 필요할 거에요. 두 파일 모두 준비해 놨어요 (그동안 가지고 있었고, 관심이 있는 분들께 DM을 통해 공유할 수 있어요).

# Streamlit 환경 설정하기

Streamlit과 데이터 처리 및 시각화를 위해 pandas와 matplotlib/plotly와 같은 필요한 라이브러리를 설치해보세요.

<div class="content-ad"></div>


```js
pip install streamlit pandas matplotlib plotly
```

메인 스크립트(streamlit_app.py)를 만들고 각 대시보드 패널을 위한 개별 스크립트를 작성하세요. 앱을 구성하기 위해 Streamlit의 레이아웃 기능을 활용해주세요:

- 주요 네비게이션: st.sidebar.radio 또는 st.sidebar.selectbox를 사용하여 다른 금융 세그먼트 간에 탐색할 수 있게 사이드바를 활용하세요.
- 대시보드 콘텐츠: 암호화폐, ETF, 주식 및 상품 모듈에 있는 각 페이지 함수(app())에서 데이터를 표시하는 데 필요한 표, 차트 및 상호 작용 위젯을 설정해주세요.

우리의 streamlit_app.py 파일은 프로젝트의 루트 폴더에 있어야 합니다. 또한 대시보드 페이지가 있는 pages 폴더가 필요합니다 (각 대시보드마다 한 페이지씩).


<div class="content-ad"></div>


## 내 Streamlit 어플리케이션 폴더 구조:
- **pages/**: 대시보드의 여러 페이지를 위한 디렉토리
    - **__init__.py**: 'pages'를 파이썬 패키지로 만듦
    - **commodities.py**: 상품 대시보드 모듈
    - **cryptos.py**: 암호화폐 대시보드 모듈
    - **etfs_value.py**: ETF 대시보드 모듈
    - **underpriced_stocks.py**: 저평가 주식 대시보드 모듈
- **stramlit_app.py**: 주 Streamlit 어플리케이션 파일


주 Streamlit 어플리케이션 코드부터 시작해봅시다. (특정 대시보드 페이지에 대한 중요 부분은 이미 이전 게시물 몇 개에서 살펴봤습니다.)

```python
import streamlit as st
from pages import commodities, cryptos, etfs_value, underpriced_stocks

# 페이지 딕셔너리
pages = {
    "상품": commodities,
    "암호화폐": cryptos,
    "ETFs 가치": etfs_value,
    "저평가 주식": underpriced_stocks
}

st.sidebar.title('Navigation')
choice = st.sidebar.radio("페이지 선택:", list(pages.keys()))

page = pages[choice]
page.app()  # 각 모듈이 페이지를 실행하기 위한 app 함수를 갖고 있다고 가정
```

앱 구조를 보면 매우 간단합니다. 필요한 대시보드 페이지와 Streamlit 라이브러리를 import하고, 페이지 딕셔너리를 작성하고, 사이드바 제목을 설정하고, 선택 메커니즘을 구현합니다. 이를 통해 사용자가 앱의 다른 섹션으로 이동할 수 있도록 합니다. 마지막으로 page.app() 메서드를 호출하여 사용자의 선택에 따라 적절한 페이지를 동적으로 로드합니다. 이 방법은 각 페이지 모듈 내의 특정 기능과 연결되어 대시보드를 렌더링하는 데 사용됩니다.


<div class="content-ad"></div>

작은 이정표를 달성했어요: 더 큰 목표를 향해 나아가요.
대시보드 페이지 만들기

pages/commodities.py

```js
import streamlit as st
import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt

# 상품, 측정 단위 및 이름 정의
commodities_info = {
    "CL=F": {"unit": "배럴", "name": "원유 (WTI)"},
    "BZ=F": {"unit": "배럴", "name": "브렌트 원유"},
    "NG=F": {"unit": "mmBtu", "name": "천연가스"},
    "HO=F": {"unit": "갤런", "name": "난방유"},
    // (중략)
}

@st.cache  # 데이터 캐싱을 통해 과도한 API 호출을 방지합니다
def fetch_commodity_data(tickers, period="6d", interval="1d"):
    try:
        data = yf.download(tickers, period=period, interval=interval)
        return data
    except Exception as e:
        st.error(f"상품 데이터 검색에 실패했습니다: {str(e)}")
        return pd.DataFrame()  # 실패 시 빈 DataFrame 반환

def app():
    st.title("상품 대시보드")

    // (중략)

if __name__ == "__main__":
    app()
```

이 Streamlit 앱은 선택한 기간 동안 상품 가격과 변동을 보여주는 대시보드를 표시하는 데 사용됩니다. 사용자들은 특정 상품, 시간대 및 데이터 세부 사항을 기반으로 사용자 정의로 표시를 조정할 수 있습니다. 특정 라이브러리를 가져온 후, commodities_info라는 딕셔너리를 만들었습니다. 이 딕셔너리는 관심 상품을 정의하며, 해당 시장 티커 심볼, 측정 단위 및 이름을 포함합니다. 이 딕셔너리는 특정 상품을 티커 심볼로 참조하면서 사용자 친화적인 이름과 단위를 표시하는 데 앱 전반에서 사용됩니다.

<div class="content-ad"></div>

다음 부분은 매우 중요합니다: @st.cache 데코레이터를 사용하여 함수 호출 결과를 캐싱하는 중요한 임무를 수행하고 있습니다. 이를 통해 입력을 기반으로 함수 호출 결과를 캐싱함으로써 yfinance에 대한 API 호출 수를 줄여 대역폭을 절약할 뿐만 아니라 첫 로드 후 사용자 상호작용 속도도 높일 수 있습니다.

- tickers: 상품 기호 목록.
- period: 데이터를 가져올 시간 기간을 지정하는 문자열 (기본값은 "6d" 또는 6일). 대시보드에서 사용자가 더 많은 내용을 볼 수 있도록 변경할 수 있습니다.
- interval: 데이터 포인트의 정밀도 (기본값은 "1d" 또는 매일). 대시보드에서도 사용자 정의가 가능합니다.

## 앱 기능

이 함수는 주요 응용 프로그램 인터페이스를 정의합니다:

<div class="content-ad"></div>

- st.title("상품 대시보드"): 대시보드의 제목을 설정합니다.
- 사이드바 입력란을 통해 사용자는 데이터의 기간과 간격을 선택하고 어떤 상품을 표시할지 선택할 수 있습니다.

## 데이터 로드 및 표시

상품이 선택된 경우, 앱은 fetch_commodity_data 함수를 사용하여 데이터를 검색합니다. 성공적인 데이터 검색은 최신 및 이전 종가를 사용하여 변동률을 계산하는 데이터 처리를 트리거합니다. 이 데이터는 그런 다음 데이터 프레임에 표시됩니다. 그 후에는 시각적인 그래픽을 위한 플로팅 함수를 정의하고 있습니다 (이 대시보드에서 그래프와 플롯만 사용 가능합니다. 다른 대시보드의 경우 주식/ETF/암호화폐의 수가 100보다 많아 시스템에 불필요한 부하가 될 수 있습니다).

## 실행 시작점

<div class="content-ad"></div>

```js
if __name__ == "__main()":
    app()
```

이 줄은 스크립트가 직접 실행되었는지 확인한 후 streamlit 애플리케이션을 시작하는 app() 함수를 호출합니다.

축하드립니다! 네가 만든 대시보드 페이지 중 첫 번째를 성공적으로 만들었어요!

![이미지](/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_1.png)

<div class="content-ad"></div>

앗, 분할 취소를 요청해주셨군요. 물론이죠, 질문이 있으시면 언제든지 물어보세요! 😉

<div class="content-ad"></div>

Markdown 형식으로 표를 나타냅니다.

파일 pages/underpriced_stocks.py

```js
import streamlit as st
import yfinance as yf
import pandas as pd
import requests

# API 액세스를 위한 상수
API_KEY = 'Your API Key'
BASE_URL = 'https://financialmodelingprep.com/api/v3'

@st.cache_resource
def fetch_sp500_tickers():
    """
    API를 사용하여 현재 S&P 500 소속 티커를 가져옵니다.
    """
    url = f"{BASE_URL}/sp500_constituent?apikey={API_KEY}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            tickers = [item['symbol'] for item in data]
            return tickers
        else:
            st.error(f"티커를 가져오지 못했습니다: HTTP 상태 코드 {response.status_code}")
            return []
    except Exception as e:
        st.error(f"요청 실패: {e}")
        return []

@st.cache
def fetch_stock_data(tickers):
    """
    주어진 티커에 대한 주식 데이터를 가져와 주식이 저평가되었는지 계산합니다.
    """
    data = []
    for symbol in tickers:
        stock = yf.Ticker(symbol)
        try:
            info = stock.info
            if 'currentPrice' in info and 'trailingEps' in info:
                current_price = info['currentPrice']
                eps = info['trailingEps']
                pe_ratio = info.get('trailingPE', float('inf'))  # 사용 가능한 경우 trailing P/E 사용

                # 목표 P/E 비율 가정
                target_pe = 15
                fair_value = eps * target_pe

                underpriced = current_price < fair_value
                price_gap = ((fair_value - current_price) / current_price) * 100 if current_price else 0

                data.append({
                    'Symbol': symbol,
                    'Current Price': current_price,
                    'EPS': eps,
                    'Fair Market Value': fair_value,
                    'Underpriced': '네' if underpriced else '아니요',
                    'Price Gap (%)': round(price_gap, 2)
                })
        except Exception as e:
            print(f"{symbol}에 대한 데이터를 가져오지 못했습니다: {e}")

    return pd.DataFrame(data)

def app():
    """
    S&P 500 주식 및 저평가 상태를 표시하는 Streamlit 앱입니다.
    """
    st.title("S&P 500 주식 분석")

    tickers = fetch_sp500_tickers()

    if tickers:
        st.write("S&P 500 회사의 티커가 로드되었습니다.")
        df = fetch_stock_data(tickers)
        if not df.empty:
            st.dataframe(df)
        else:
            st.write("제공된 티커에 대한 데이터를 찾을 수 없습니다.")
    else:
        st.write("주식 티커를 로드할 수 없습니다. API 설정 및 네트워크 연결을 확인해주세요.")

if __name__ == "__main__":
    app()

```

암호화폐처럼 동일한 방식으로: 필요한 라이브러리 가져오기, financialmodelingprep 라이브러리에서 SP500 티커 가져오기 및 yfinance에서 데이터 가져오기: 각 주식별로 데이터를 가져오는 동안 limitation에 도달하는 것을 피하기 위해 이 두 작업을 서로 다른 소스 사이에 분리했습니다. financialmodelingprep의 최소 결제 요금제(매월 19.99 미국 달러)에는 분당 300회의 호출 제한이 있으므로 우리가 주식을 하나씩 가져올 때 쉽게 이 제한에 도달할 것입니다.

<div class="content-ad"></div>

yfinance에서 무엇을 얻고 있습니까? 적절한 기준을 설정하고 특정 주식이 성장 잠재력이 있는지 고려하는 데 도움이 되는 여러 가지 지표 목록을 얻고 있습니다.
현재 가격: 주식의 최신 거래 가격입니다.
EPS (주당 수익): 회사가 주당 주식에 대해 벌어들이는 돈을 나타냅니다.
목표 P/E 비율: 이는 많은 가치 투자자들을 위한 전형적인 기준인 15로 설정됩니다. 여기서는 해당 주식의 이익에 기초하여 합리적인 가격으로 간주될 수 있는 것을 예상하기 위해 사용됩니다. 목표 P/E 15는 성장과 가치 속성을 균형 있게 고려할 수 있는 중도 기준으로 선택되었습니다. 브로드 산업 범위에 역사적으로 적용되었던 산업에 대해 사용된 보수적인 수치로, 오버밸류된 시장에서 상대적 가치 평가가 낮은 주식을 식별하는 데 도움을 줄 수 있습니다.
공정시장가치 계산: EPS * 목표 P/E로 계산됩니다. 이는 주식이 목표 P/E 비율인 15로 가치 평가되었다면 해당 주식의 공정 가치를 나타냅니다. 낮은 P/E는 주식이 수익에 비해 저평가되었을 수 있다는 것을 시사할 수 있습니다.
저평가 여부 확인: 만일 현재 시장 가격이 계산된 공정시장가치보다 낮다면 해당 주식이 저평가되었다고 간주됩니다.
가격 격차(%): 공정시장가치와 현재 가격 사이의 백분율 차이를 보여주며, 주식 가격이 추정된 공정 가치에 도달하기 위해 얼마나 증가해야 하는지를 나타냅니다.

![Financial Dashboard](/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_3.png)

우리는 4개 중 3개를 얻었습니다: 마지막은 ETF 분석 대시보드입니다.

파일: pages/etfs_value.py

<div class="content-ad"></div>

```python
import streamlit as st
import yfinance as yf
import pandas as pd

st.set_page_config(layout="wide")

@st.cache_resource(ttl=300, show_spinner=True)
def fetch_options_data(symbol):
    """ Yahoo Finance에서 ETF 심볼의 옵션 데이터를 가져옵니다. """
    etf = yf.Ticker(symbol)
    try:
        expiration_dates = etf.options
        options_info = []
        for expiration_date in expiration_dates:
            options_chain = etf.option_chain(expiration_date)
            puts = options_chain.puts
            calls = options_chain.calls
            options_info.append({
                '만기일': expiration_date,
                '풋 옵션 개수': len(puts),
                '콜 옵션 개수': len(calls)
            })
        return options_info
    except Exception as e:
        st.error(f"{symbol}에 대한 옵션 데이터를 가져올 수 없습니다: {e}")
        return []

def format_assets(assets):
    """ 큰 숫자를 읽기 쉬운 형식으로 변환합니다. """
    if assets >= 1e9:
        return f"{assets / 1e9:.2f}B"
    elif assets >= 1e6:
        return f"{assets / 1e6:.2f}M"
    return str(assets)

@st.cache_data(show_spinner=True)
def fetch_data(symbol):
    """ Yahoo Finance에서 ETF에 대한 금융 데이터 및 메트릭을 가져옵니다. """
    etf = yf.Ticker(symbol)
    info = etf.info
    options_info = fetch_options_data(symbol)
    return {
        '이름': info.get('longName', 'N/A'),
        '최신 가격': f"${info.get('previousClose', 'N/A')}",
        '52주 최고가': f"${info.get('fiftyTwoWeekHigh', 'N/A')}",
        '52주 최저가': f"${info.get('fiftyTwoWeekLow', 'N/A')}",
        '1년 수익률': f"{info.get('ytdReturn', 'N/A') * 100:.2f}%" if info.get('ytdReturn') is not None else "N/A",
        '3년 수익률': f"{info.get('threeYearAverageReturn', 'N/A') * 100:.2f}%" if info.get('threeYearAverageReturn') is not None else "N/A",
        '5년 수익률': f"{info.get('fiveYearAverageReturn', 'N/A') * 100:.2f}%" if info.get('fiveYearAverageReturn') is not None else "N/A",
        '총 자산': format_assets(info.get('totalAssets', 'N/A')),
        '배당 수익률': f"{info.get('yield', 'N/A') * 100:.2f}%" if info.get('yield') is not None else "N/A",
        '평균 거래량': info.get('averageVolume', 'N/A'),
        '옵션 상세정보': "; ".join([f"만기일: {opt['만기일']}, 풋: {opt['풋 옵션 개수']}, 콜: {opt['콜 옵션 개수']}" for opt in options_info]),
    }

def app():
    """ ETF 분석을 표시하는 Streamlit 애플리케이션의 진입점입니다. """
    st.title("ETF 분석")
    refresh_button = st.button("데이터 새로고침")

    if refresh_button:
        st.experimental_rerun()

    file_path = "etfs.txt"
    try:
        with open(file_path, 'r') as file:
            symbols = [line.strip().upper() for line in file.readlines()]
            data = [fetch_data(symbol) for symbol in symbols]
            df = pd.DataFrame(data)
            st.table(df)
    except FileNotFoundError:
        st.error("ETF 심볼 파일을 찾을 수 없습니다. 현재 디렉토리에 'etfs.txt' 파일이 있는지 확인해 주세요.")

if __name__ == "__main__":
    app()
```

<div class="content-ad"></div>

데이터를 가져와서 서식을 지정한 후 Streamlit의 st.table() 함수를 사용하여 각 ETF의 주요 지표를 명확하고 조직적으로 보여줍니다. 이 테이블에는 최신 가격, 올해의 최고가와 최저가, 수익률, 총 자산, 배당 수익률 및 자세한 옵션 데이터와 같은 세부 정보가 포함되어 있습니다.

![이미지](/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_4.png)

![이미지](/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_5.png)

ETF의 사용 가능한 옵션 수가 다르기 때문에 테이블의 높이와 가시성에 영향을 줍니다. 그래서 이 대시보드의 스크린샷을 2개 두었습니다.

<div class="content-ad"></div>

그래요, 우리 최종 대시보드가 준비되었어요. 터미널을 열고 마법의 열쇠를 입력해볼까요? "알라딘의 비밀 금고 여는 방법"이 아니라 이런 모습을 하겠죠.

```js
streamlit run streamlit_app.py
```

그리고, 와! 대시보드가 실행 중이에요.

당신의 IDE 터미널에서 대시보드에 액세스하는 URL을 확인할 수 있어요.

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_6.png)

로컬 URL 링크를 클릭하세요. 기본 브라우저에서 페이지를 열고 성취 결과를 확인할 수 있을 겁니다.

![이미지](/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_7.png)

테이블에 대해 "csv로 다운로드", 검색 및 전체화면 옵션이 제공되었는지 확인하세요.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-22-Multi-pagefinancialdashboardwithPythonandStreamlitBuilditfromscratch_8.png" />

요약하자면 — 우리는 큰 한걸음을 내디디었어요: 어떤 데이터 표시 소스의 UI 한계에 국한되어 사용자일 뿐이었던 것으로부터, 이제 우리는 직접 대시보드를 개발할 수 있게 되었어요: 신뢰할 만한 정보 소스를 찾아내고, 원하는 형태로 정보를 제공받을 수 있도록 결정하고, 그에 맞게 조작할 수 있게 되었죠. 너무 복잡하지 않죠, 아마도 자기 계발과 금융 교육 여정에서 다음 목표에 도달하기 위한 단계에 또 다른 발걸음인 것 같아요. 코딩에 행운을 빕니다!

# 쉽게 말해보면 🚀

In Plain English 커뮤니티의 일원이 되어 주셔서 감사합니다! 떠나시기 전에:

<div class="content-ad"></div>

- 글쓴이를 클립하고 팔로우 해주세요! 👏️️
- 팔로우하기: X | LinkedIn | YouTube | Discord | 뉴스레터
- 다른 플랫폼 방문하기: Stackademic | CoFeed | Venture | Cubed
- PlainEnglish.io 에서 더 많은 콘텐츠를 확인하세요!