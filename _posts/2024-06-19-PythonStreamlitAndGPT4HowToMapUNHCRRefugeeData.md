---
title: "파이썬 Streamlit과 GPT4 UNHCR 난민 데이터 매핑 방법"
description: ""
coverImage: "/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_0.png"
date: 2024-06-19 05:02
ogImage: 
  url: /assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_0.png
tag: Tech
originalTitle: "Python Streamlit And GPT4: How To Map UNHCR Refugee Data"
link: "https://medium.com/towards-artificial-intelligence/python-streamlit-and-gpt4-how-to-map-unhcr-refugee-data-8428a09d6593"
---




![Python Streamlit](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_0.png)

파이썬 Streamlit은 상호 작용적인 웹 인터페이스를 만드는 놀라운 프레임워크입니다. GPT-4는 빠르게 작동하는 Streamlit 코드를 만들어 줄 수 있어요.

파이썬 Plotly와 함께 사용하면 데이터 시각화에 아름다운 지도와 차트를 손쉽게 만들 수 있어요.

대부분의 경우, 제가 증명해줄 필요가 있죠. 그러니까 제가 어떻게 보여줄지 기대해 주세요.


<div class="content-ad"></div>

웹 인터페이스에서 CSV 데이터 세트를 사용하여 다양한 데이터 시각화를 만들 수 있습니다. 추가로 슬라이더 및 드롭다운 메뉴와 같은 상호 작용 레이어를 여러 개 추가할 수도 있습니다. 이 모든 작업은 데이터세트와 GPT-4에 몇 가지 간단한 프롬프트만 필요합니다.

그럼 데이터세트를 찾아보고 이를 실행해 봅시다.

# 데이터 세트 — UNHCR 난민 데이터

UNHCR(UN High Commission for Refugees)는 전 세계적으로 난민의 움직임에 대한 통계를 추적합니다.

<div class="content-ad"></div>

데이터는 여기에서 자유롭게 액세스할 수 있어요.

다운로드 페이지로 이동한 후에는 선택한 데이터에 대해 더 자세히 볼 수 있어요:

![이미지](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_1.png)

이 프로젝트에서는 각 난민의 출신 국가와 피난국을 검색해보겠어요.

<div class="content-ad"></div>

이 데이터셋은 Streamlit/Plotly 코드 생성의 힘을 보여주는 완벽한 데이터셋입니다.

이 데이터를 사용하여 난민 데이터를 보여주는 전 세계 지도를 만들 수 있습니다:

- 출신 국가 - 피정국이 어디로 이동하고 있는지
- 피정 국가 - 피정국이 어디에서 오고 있는지

데이터셋을 다운로드하면 스프레드시트 형식으로 열어서 다루고 있는 내용을 확인할 수 있습니다:

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_2.png)

이 프로젝트에 관심 있는 데이터 필드는 다음과 같습니다:

- 출신 국가 (3자리 ISO 코드 포함) - 망명을 찾는 사람이 어디에서 왔는지
- 망명국 (3자리 ISO 코드 포함) - 실제로 망명을 찾는 사람이 있는 곳
- 인정된 결정 - 망명을 찾는 사람이 수용되었는지 (국가별 숫자 합계)

출신 국가와 망명 국가 모두 코로플레스 맵을 만드는 데 사용할 수 있는 3자리 ISO 코드가 있습니다.


<div class="content-ad"></div>

이 정말 유용하네요! 맵 생성을 크게 간소화해줍니다.

이제 GPT-4 프롬프트로 넘어가겠습니다!

## 단계 1: 데이터셋 로드, GPT-4 분석을 위한 프롬프트

먼저, 데이터셋에 있는 필드와 값에 대한 이해가 GPT-4에게 있는지 확인해야 합니다. 그러므로 먼저 파일을 채팅 창에 업로드하고 GPT-4의 분석을 요청해보겠습니다:

<div class="content-ad"></div>

![PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_3](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_3.png)

GPT-4는 각 필드에 대한 설명을 답변합니다.

![PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_4](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_4.png)

간결함을 위해 데이터 시각화에 필요한 필드만 포함했습니다. GPT-4의 답변에서 데이터 세트의 필드에 대한 확실한 이해가 엿보입니다.

<div class="content-ad"></div>

좋아요 — 이제 GPT-4에게 데이터 시각화를 위한 입력을 준비했습니다.

# 단계 2: 첫 번째 지도 시각화 생성

먼저, 우리는 망명국을 선택할 수 있는 지도를 만들고 싶습니다 — 망명 신청자의 출신 국가를 어디에서 오는지 확인할 수 있도록 해보세요.

GPT-4에게 알려주세요: 제공된 데이터 세트를 사용하여 사용자가 드롭다운 메뉴에서 국가를 선택할 수있는 Streamlit 애플리케이션을 만들어주세요. 이 애플리케이션은 '인정 결정' 필드를 사용하여 출신 국가의 숫자를 보여주는 Plotly express 코로플레스 맵을 표시해야 합니다.

<div class="content-ad"></div>

결과 GPT-4에서 코드를 Markdown 형식으로 변경하였습니다:

```python
import streamlit as st
import pandas as pd
import plotly.express as px

# 데이터셋 불러오기
file_path = 'asylum-decisions.csv'  # 필요시 경로 업데이트
asylum_data = pd.read_csv(file_path)

# Streamlit 앱 생성
st.title('Asylum Decisions Analysis')

# 망신국가 선택을 위한 드롭다운 메뉴
country_of_asylum = st.selectbox(
    'Select a Country of Asylum:',
    asylum_data['Country of asylum'].unique()
)

# 선택한 망신국가 기반으로 데이터 필터링
filtered_data = asylum_data[asylum_data['Country of asylum'] == country_of_asylum]

# 출신국가별로 그룹화하고 인정된 결정 수 합산
grouped_data = filtered_data.groupby('Country of origin (ISO)').sum().reset_index()

# 코로플레스 맵 생성
fig = px.choropleth(
    grouped_data,
    locations='Country of origin (ISO)',
    color='Recognized decisions',
    hover_name='Country of origin (ISO)',
    color_continuous_scale=px.colors.sequential.Plasma,
    labels={'Recognized decisions': 'Recognized Decisions'},
    title=f'Recognized Decisions for Asylum Seekers in {country_of_asylum}'
)

# 맵 출력
st.plotly_chart(fig)

# 상세 데이터를 표로 추가하여 표시
st.write('Detailed Data:', grouped_data)
```

해당 코드는 상호작용 웹 앱을 만드는 데 사용되는 streamlit, 데이터 조작 및 분석에 사용되는 pandas, 시각화를 만드는 데 사용되는 plotly.express 등 관련 라이브러리를 포함하고 있어요.

<div class="content-ad"></div>

업로드한 데이터 세트에 액세스하는 코드이며 이를 사용하여 데이터 프레임을 만듭니다(pandas 라이브러리 사용). 데이터 프레임은 데이터 시각화를 위한 가장 좋은 방법입니다. 데이터 프레임은 그런 다음 Plotly express 함수 choropleth()로로드되며 이 함수는 각 원본 국가의 숫자(인식된 결정)를 보여주는 전역 맵을 생성합니다.

이 코드를 즐겨 사용하는 Python 편집기(저는 PyCharm을 사용합니다)에 복사하여 붙여넣기하고 Python 파일(예: streamlit_map01.py)로 저장할 수 있습니다.

이 프로젝트에 대한 제 예시 PyCharm 작업 환경은 다음과 같습니다:

![Image](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_5.png)

<div class="content-ad"></div>

PyCharm을 사용하면 내장 터미널 창(보기/도구 창/터미널)을 사용하여 새 Streamlit 애플리케이션을 실행할 수 있습니다:

![이미지](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_6.png)

그리고 새 코드를 실행한 결과:

![이미지](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_7.png)

<div class="content-ad"></div>

와우, 그냥 그렇게하면, 사용자가 원산지 국가를 선택할 수있는 인터랙티브 애플리케이션이 만들어졌어요. 애플리케이션에서 캐나다가 선택되어 있고, 원산지 국가들이 표시되어 있어요.

정말 멋진 시작이에요! 하지만 더 개선할 수 있을 것 같아요.

사용자가 연도별로 선택할 수 있게하여 추가적인 상호작용을 추가해 봅시다.

# 단계 3: 연도별로 표시하기 위한 슬라이더 추가

<div class="content-ad"></div>

이제 사용자가 연도를 선택할 수 있도록 슬라이더를 추가하여 세분화 수준을 한 단계 더 높일 수 있습니다(현재는 데이터 집합의 모든 연도를 표시 중입니다). GPT-4에 추가 작업을 요청해 보겠습니다.

GPT-4에 제안: 좋아요, 사용자가 연도를 선택할 수 있도록 슬라이더를 추가하고, 크로플레스 맵에는 해당 연도의 결과만 표시하도록 해주세요.

코드의 주요 부분은 동일하지만, GPT-4가 사용자가 국가를 선택한 후 추가 필터를 추가하는 슬라이더 코드를 추가할 것입니다.

다음은 추가 코드의 예시입니다(간결하게 표현):

<div class="content-ad"></div>

```js
# 연도를 선택할 수 있는 슬라이더
year = st.slider(
    '연도를 선택하세요:',
    int(asylum_data['Year'].min()),
    int(asylum_data['Year'].max()),
    int(asylum_data['Year'].min())
)

# 선택된 국가와 연도에 따라 데이터 필터링
filtered_data = asylum_data[(asylum_data['Country of asylum'] == country_of_asylum) & (asylum_data['Year'] == year)]

# 원산지 국가별로 그룹화하여 인정된 결정 수 합산
grouped_data = filtered_data.groupby('Country of origin (ISO)').sum().reset_index()
```

좋아요! 우리는 새로운 Python 코드의 전체 부분을 복사하여 붙여넣거나 저장할 수 있습니다(나의 예시에서 streamlit_map02.py 파일을 생성했습니다).

새로운 Python 코드의 실행 결과:

<img src="/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_8.png" />

<div class="content-ad"></div>

당신이 볼 수있듯이, 큰 변화는 물론, 사용자가 연도를 선택할 수 있도록 드롭다운 바로 아래에 슬라이더를 추가한 것입니다.

특정 나라 출신 사람들이 어떤 나라로 피난처 신청을 하는지도 볼 수 있으면 어떨까요? 이 데이터도 이미 데이터 세트에 포함되어 있습니다. 이미 연도와 나라별 선택 기능을 추가했습니다. 이 정보를 보려면 첫 번째 지도 옆에 두 번째 지도를 추가하여 접근 가능한 데이터를 두 배로 늘리면 됩니다.

출발!

# 단계 4: 두 번째 코로플레스 맵 추가하기

<div class="content-ad"></div>

우리는 국가의 난민국가를 보여주는 두 번째 지도를 추가할 수 있습니다. 그리고 이것을 우리가 만든 첫 번째 지도 옆에 놓을 수 있습니다.

이 두 지도를 함께 보면 선택한 국가에 대한 두 가지 정보를 확인할 수 있습니다:

- 어느 국가에서 난민을 구합니다
- 어느 국가로 난민을 보냅니다

GPT-4에게 지침: 슬라이더와 드롭다운을 사용하여 선택한 국가에 대한 피난지 국가를 표시하는 두 번째 지도를 추가하십시오(첫 번째 지도 옆에 놓으세요. 지도는 각각 자체 컨테이너에 있어야 합니다). 두 지도가 모두 초기 연도와 드롭다운에서 업데이트되도록 해주세요. 두 번째 지도의 색상 체계를 'YlOrRd'로 변경해주세요.

<div class="content-ad"></div>

GPT-4가 코드를 생성해줍니다. 여러분은 자신이 선호하는 편집기에 다시 복사하여 붙여넣기/저장/실행할 수 있습니다 (저는 streamlit_map03.py라는 세 번째 파일을 만들었습니다).

참고: 이 프롬프트를 올바르게 만드는 데 몇 차례 시도했습니다. 명시적으로 언급되지 않는 한 GPT-4는 두 번째 지도를 첫 번째 드롭다운과 연결하지 않을 수도 있습니다(또는 두 번째 드롭다운을 추가할 수도 있습니다).

최종 디스플레이:

![이미지](/assets/img/2024-06-19-PythonStreamlitAndGPT4HowToMapUNHCRRefugeeData_9.png)

<div class="content-ad"></div>

와우, 정말 인상적이에요. 데이터셋과 3가지 모듈식 프롬프트로, 행성상 모든 국가 간 난민 이동을 볼 수 있는 대화형 웹 애플리케이션을 만들었어요.

그리고 GPT-4는 이 모든 것을 100줄 미만의 코드로 (내 최종 Python 파일에는 70줄) 완성했어요.

좋은 경험이 되었기를 바라요. 함께 해줘서 고마워요!

# 요약하자면...

<div class="content-ad"></div>

위의 GPT-4 프롬프트 단계를 모듈식으로 따르면 대부분의 사람이 수동으로 코딩하는 데 소요되는 시간의 일부분에 웹 응용 프로그램을 매우 유용하게 개발할 수 있습니다.

그러나 여기서 주의해야 할 점이 있습니다 — GPT-4는 응답에서 정확하지 않습니다. 코드나 결과가 여기에 표시된 것과 정확히 같아야 한다는 보장은 없습니다. 이것이 오늘의 LLM 환경의 특성입니다.

내 경험상 GPT-4는 계속해서 작동하는 코드를 생성할 수 있지만, 그것이 생성 될 때마다 동일한 코드는 아닙니다.

전문가 팁: 마음에 드는 작동 코드 덩어리(레이아웃/색상 선택/기능 등)가 있으면, 다음 모듈식 단계에 사용하기 위해 이 코드를 GPT-4에 다시 피드해야 합니다. 이렇게 하면 GPT-4가 진로를 유지하는 데 도움이 됩니다.

<div class="content-ad"></div>

이런 프롬프트들을 한 번 시도해 보세요! 그리고 제게 어땠는지 꼭 알려주세요.

읽어 주셔서 감사합니다.

만약 이런 종류의 이야기가 당신에게 딱 맞고, 나를 작가로서 지원하고 싶다면, 제 Substack을 구독해 주세요.

Substack에서는 나의 독자들만을 위해 매주 뉴스레터와 다른 플랫폼에서 찾을 수 없는 기사들을 게시합니다.