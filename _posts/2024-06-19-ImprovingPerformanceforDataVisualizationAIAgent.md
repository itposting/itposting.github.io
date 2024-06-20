---
title: "데이터 시각화 AI 에이전트의 성능 향상 - Performance Improvement"
description: ""
coverImage: "/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_0.png"
date: 2024-06-19 15:50
ogImage: 
  url: /assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_0.png
tag: Tech
originalTitle: "Improving Performance for Data Visualization AI Agent"
link: "https://medium.com/firebird-technologies/improving-performance-for-data-visualization-ai-agent-d677ccb71e81"
---


## DSPy를 사용하고 최적화 기술을 활용하여 에이전트 성능 향상

![에이전트 이미지](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_0.png)

몇 주 전에, 데이터 시각화를 지원하는 AI 에이전트를 개발하는 프로젝트를 공유했습니다. 에이전트는 대부분의 쿼리에 대해 잘 작동했지만 때로는 실행 불가능한 코드와 불완전한 지침(부제/주석과 같은 중요한 구성 요소를 잊어버린)과 같은 여러 문제가 발생할 때가 있었습니다. 대부분의 에이전트 응용 프로그램과 마찬가지로 성능 측면에서 신뢰할 수 없었지만, 이 게시물에서는 어떻게 에이전트를 더 잘 작동하게 만들었는지에 대해 설명합니다.

AI 에이전트에 문제가 있나요? AI 에이전트의 신뢰성과 견고성을 향상시키고 싶으신가요? 에이전트를 효과적으로 개발하는 방법을 모르시겠나요? 전문가에게 문의해보세요!

<div class="content-ad"></div>

https://form.jotform.com/240744327173051

![Image 1](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_1.png)

![Image 2](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_2.png)

# 요약

<div class="content-ad"></div>

AI 에이전트의 성능을 최적화하는 방법을 설명하기 전에, 에이전트가 구축된 방식에 대해 간단히 되짚어보려고 합니다. 그러면 따라오실 수 있을 거예요.

![에이전트 이미지](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_3.png)

에이전트에는 이 두 가지 구성 요소가 있어요:

- 데이터프레임 인덱스: 이것은 에이전트가 사용하는 데이터프레임에 대한 정보를 담고 있는 인덱스입니다. 열 이름, 데이터 유형 및 통계 정보 (최솟값/최댓값/카운트/평균)과 같은 것들이 있어요.
- 스타일링 도구: 이곳에는 Plotly의 다양한 차트 유형에 대한 자연어로 된 정보가 있어요. 각 유형의 차트를 어떻게 서식 지정해야 하는지에 대한 에이전트의 지침이 담겨 있어요.

<div class="content-ad"></div>

에이전트는 사용자 쿼리를 처리하여 관련 열을 식별하고 적절한 차트 유형을 결정합니다. 그런 다음 실행할 때 지정된 차트를 생성하는 Python 코드를 생성합니다.

에이전트가 어떻게 만들어졌는지 더 알고 싶다면, 이 게시물을 읽어보세요:

# 성능 측정

에이전트를 개선하는 첫 번째 단계는 현재 성능을 측정하고 시스템에 가한 변경 사항과 비교하는 것입니다. 효과적으로 성능을 측정하기 위해 시스템이 마주할 쿼리 세트를 포함하는 데이터 세트를 생성해야 합니다.

<div class="content-ad"></div>

## 쿼리 데이터 세트 작성하기

LLM이 만나게 될 쿼리 유형을 추가할 수 있습니다. 여기서 한 것처럼 LLM에게 해달라고 요청하는 것이 더 쉬운 방법입니다.

![image](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_4.png)

평가 목적으로 추가적인 쿼리를 생성하도록 Language Model에 계속해서 요청할 수 있습니다. 자신만의 쿼리를 기여하는 것이 매우 유익합니다. 또한, 인덱스에 없는 정보를 요청하거나 데이터 시각화와 관련이 없는 질문 등, 에이전트를 도전시킬 수 있는 쿼리를 생성하는 것이 좋습니다. 여기에 제가 개발한 쿼리 세트의 예시가 있습니다. 기억해야 할 요점은 이 세트가 에이전트가 만날 가능성이 있는 모든 유형의 쿼리를 포함해야 한다는 것입니다.

<div class="content-ad"></div>


# 여기에는 LLM을 사용하여 만든 몇 가지 평가 쿼리가 나와 있어요.
평가 쿼리는 다음과 같아요:
- 'Filtering', 'Crime Analysis', 'Data Comparison', 'Advanced Queries', 'Imaginary Data', 'Irrelevant Queries', 'Prompt Injections', 'Line Chart', 'Bar Chart', 'Pie Chart', 'Map', 'Single-Value', 'Sankey' 같이 다양한 카테고리로 구성돼요.

## 평가 메트릭

이제 우리는 에이전트의 응답 "유효성"을 수치적으로 정의할 방법이 필요해요 - 우수한 응답과 좋지 않은 응답을 구별할 수 있는 점수 메커니즘이요.

이 논리 다이어그램은 설계된 평가 메트릭이 작동하는 방식을 설명해줘.


<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_5.png)

전체 점수를 계산하려면 코드가 필요한 속성을 갖추었는지 확인하는 기본적인 방법을 사용하거나 Large Language Model (LLM)을 사용하여 평가를 수행할 수 있습니다. 제 구현에서는 각 쿼리에 대해 작은 점수 평가기를 구축하여 DSPy 서명을 사용했습니다.

```python
import dspy
from pydantic import BaseModel, Field

# 출력을 위한 pydantic validator 정의
class Score(BaseModel):
    commentary: str = Field(desc="점수 분석")
    Score: int = Field(desc="점수")

# 총점을 평가하는 데 사용할 서명 정의
class Scorer(dspy.Signature):
    """
    쿼리와 코드를 위해 제공된 서명으로 총점을 계산합니다.
    """

    query = dspy.InputField(desc="데이터 및 그래프에 대한 정보가 포함된 사용자 쿼리")
    code = dspy.InputField(desc="에이전트가 생성한 코드")
    output: Score = dspy.OutputField(desc='코드를 평가한 후의 점수')

# 코드 실행 여부를 확인하는 함수
def check_code_run(code):
    score = 0
    try:
        code = code.split('')[1]
        exec(code)
        score += 10
        return score
    except:
        return score

# LLM이 찾는 속성을 모두 찾았는지 여부에 따라 점수를 계산하는 함수
def evaluating_response(code, query):
    score = 0
    scorer = dspy.Predict(Scorer)
    response = scorer(query=query, code=code)
    score += int(response.Score.split('Score:')[1])
    return score
```

평가 지표를 정의한 후, '미훈련' 시스템의 성능을 확인해보겠습니다. DSPy를 최적화하기 위해 DSPy 모듈 및 서명을 사용하여 에이전트를 다시 만들어야 합니다.


<div class="content-ad"></div>

저희는 대규모 언어 모델 애플리케이션을 개선해 드리는 전문가입니다. 문의하실 사항이 있으시면 언제든지 아래 링크를 통해 저희에게 연락해 주세요:
https://form.jotform.com/240744327173051

## DSPy에서 에이전트 정의하기

```js
from pydantic import BaseModel, Field

# Pydantic 출력 파서
class Plotly_code(BaseModel):
    commentary: str = Field(desc="코드에 대한 주석")
    Code: str = Field(desc="Plotly 코드")

# 우리의 프롬프트에 대한 시그니처
class AgentSig(dspy.Signature):
    """
    여러분은 Plotly에서 데이터 시각화를 생성하기 위해 {query}를 사용하는 AI 에이전트입니다.
    사용 가능한 도구를 활용해야 합니다.
    {dataframe_index}
    {styling_index}

    해당하는 열이 없는 경우 코드로 출력해야 합니다. 해당 정보가 없다고 밝히세요.
    """
    query = dspy.InputField(desc="차트를 그리고자 하는 데이터 및 차트에 대한 정보를 포함한 사용자 쿼리")

    dataframe_context = dspy.InputField(desc="데이터 프레임의 데이터에 대한 정보 제공. 컬럼 이름 및 데이터 프레임 이름만 사용해야 함")
    styling_context = dspy.InputField(desc='Plotly 차트에 스타일을 적용하는 방법에 대한 지시')
    code: Plotly_code = dspy.OutputField(desc="사용자 쿼리 및 dataframe_index 및 styling_context에 따라 필요한 시각화를 하는 Plotly 코드")
    
class AI_data_viz_agent(dspy.Module):
    def __init__(self):
        super().__init__()
        
        self.dataframe_index = dataframe_index
        self.style_index = style_index

        self.agent = dspy.ChainOfThought(AgentSig)
    
    def forward(self, query):
        dataframe_context = self.dataframe_index.as_retriever(similarity_top_k=1).retrieve(query)[0].text
        styling_context = self.style_index.as_retriever(similarity_top_k=1).retrieve(query)[0].text

        prediction = self.agent(dataframe_context=dataframe_context, styling_context=styling_context, query=query)

        return dspy.Prediction(dataframe_context=dataframe_context, styling_context=styling_context, code=prediction.code)

lm = dspy.GROQ(model='llama3-70b-8192', api_key="", max_tokens=3000)
dspy.configure(lm=lm)

agent = AI_data_viz_agent()
print(agent('What is the distribution of crimes by type by histogram?').code)
```

<img src="/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_6.png" />


<div class="content-ad"></div>

## DSPy 프로그램 미컴파일/미훈련 평가

벤치마킹을 수립하기 위해, 더 나은 성능을 위해 우리의 에이전트를 ‘훈련/컴파일’하지 않고 먼저 평가하겠습니다.

```js
# eval_df는 데이터셋 섹션에서 정의되었습니다
# 평가 df에 코드 추가
code_list = []
for q in eval_df['Query']:
    code_list.append(agent(q).code)
eval_df['Code'] = code_list

# 코드가 실행되는지 확인하는 방법을 사용하여 실행함

eval_df['check_run'] = [check_code_run(code) for code in eval_df['Code']]

# evaluate_response 방법을 사용하여 코드의 속성을 평가
eval_df['Attribute_Score'] = [evaluating_response(code, query) for code, query in zip(eval_df['Code'], eval_df['Query'])]

# 에이전트가 필요한 정보를 갖고 있는 쿼리만 
# 답변 가능해야 합니다. 에이전트가 충분한 정보가 없는 
# 질문에 정확한 코드를 생성하는 상황을 피하고 싶습니다.
eval_df['Answerable'] = [1 if x.strip().lower()!='no relevant information' else 0 for x in eval_df['Expectation']]
```

![이미지](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_7.png)

<div class="content-ad"></div>

```js
# 최종 점수 계산
# 심사원 서명 작성
class CodeJudge(dspy.Signature):
    """응답에 코드가 포함되어 있는지 판단합니다."""
    response = dspy.InputField(desc="AI 에이전트로부터의 응답")
    has_code = dspy.OutputField(desc="응답에 파이썬 코드가 포함되어 있는지 여부", prefix="사실적[예/아니오]:")

# 각 예측 응답에 대한 최종 점수를 계산하는 메트릭
# 최고의 응답을 포함하는 예시와 비교
def full_metric(example, pred, trace=None):
    if 'No relevant information' not in example.code:
        check_run = check_code_run(pred.code)
        attributes = evaluating_response(pred.code, example.query)
    else:
        check_if_code = dspy.ChainOfThought(CodeJudge)
        response = check_if_code(response=pred.code)
        if response.has_code.split('사실적[예/아니오]:')[1].strip() == '예':
            return 0
        else:
            return 19
        
    return check_run + attributes

zip_ = zip(eval_df['Answerable'], eval_df['check_run'], eval_df['Attribute_Score'], eval_df['Code'])
eval_df['Total_Score'] = [final_score(a, c, a_s, c) for a, c, a_s, c in zip_]

# 총 점수 / 총 가능 점수 계산

eval_full_df['Total_Score'].sum() / (len(eval_full_df)) * 19
```

![이미지](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_8.png)

![이미지](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_9.png)

# 성능 향상

<div class="content-ad"></div>

성능을 향상시키기 위해서는 모델에 완벽한 점수를 획득할 수 있는 예제를 제공해야 합니다. 다행히도, 에이전트가 이미 이 작업의 절반을 완료했습니다. 훈련 세트를 준비하기 위해 누락된 속성을 추가하고 코드를 실행할 수 있도록 해야 합니다. 쿼리가 결과를 반환하지 않아야 하는 경우, 예제에 간단히 '관련 정보 없음'을 포함하면 됩니다.

그러나 개선된 코드를 검증하는 데는 조금 경계를 두고, 실제로 필요한 모든 속성이 코드에 있는지 확인하기 위해 다시 테스트해야 합니다.

```js
# 코드 개선 에이전트를 위한 새로운 서명 정의 
class Improver(dspy.Signature):
    """
    코드 개선 에이전트입니다. 코드와 설명을 입력으로 받고 향상된 코드 개선을 출력합니다.
    코드와 설명을 취해서 Plotly 코드를 출력해야 합니다. 이는 완벽한 점수를 받을 수 있는 코드입니다.

    이 코드가 판단된 9가지 속성: 각 정답마다 +1
    {'correct_column_names', 'title', 'Annotations', 'Format number in 1000 in K & millions in M only for numbers',
   'Aggregation used', 'correct axis label', 'Plotly_white theme', 'Correct chart type', 'Html tag like <b>',}

     여기가 따라야 하는 형식입니다
    code: {code}
    commentary:{commentary}
    improved_code: 9점을 얻는 향상된 출력
    """
    code = dspy.InputField(desc="개선해야 하는 코드")
    commentary = dspy.InputField(desc="평가 에이전트가 제공한 코드에 대한 설명")
    improved_code = dspy.OutputField(desc="평가에 따라 완벽한 점수를 받을 수 있는 향상된 코드")

# 이 개선 에이전트 모듈은 개선된 코드를 제공할 것입니다.
improver = dspy.ChainOfThought(Improver)
# 원하는 기준을 충족하는지를 확인하기 위해 이전에 정의한 평가 모듈을 사용할 수 있습니다.
scorer = dspy.ChainOfThough(Scorer)
```

개선자와 평가자 모듈을 호출하여 생성하고 검증하면 대부분의 작업이 완료됩니다. 이제 출력을 수동으로 확인하기만 하면 됩니다. 저희 훈련 세트는 총 59개의 쿼리이므로 한 번에 하나씩 확인하는 것이 좋습니다.

<div class="content-ad"></div>


![Improving Performance for Data Visualization AI Agent](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_10.png)

## 학습세트 생성하기

이제 DSPy Optimizer로 훈련 예제를 보내서 몇 가지 샷 예제를 추가하여 프롬프트를 개선할 수 있습니다.

```js
# 판사 서명 작성
class CodeJudge(dspy.Signature):
    """응답에 코드가 포함되어 있는지 확인합니다"""
    response = dspy.InputField(desc="AI 에이전트에서 온 응답")
    has_code = dspy.OutputField(desc="응답에 파이썬 코드가 포함되어 있는지 여부", prefix="사실적[예/아니오]:")

# 모든 예측된 응답에 대한 최종 점수를 계산하는 메트릭
# 가장 적절한 응답을 포함한 예제와 비교합니다
def full_metric(example, pred, trace=None):
    if 'No relevant information' not in example.code:
        check_run = check_code_run(pred.code)
        attributes = evaluating_response(pred.code, example.query)
    else:
        check_if_code = dspy.ChainOfThought(CodeJudge)
        response = check_if_code(response=pred.code)
        if response.has_code.split('사실적[예/아니오]:')[1].strip() == '예':
            return 0
        else:
            return 19
        
    return check_run + attributes

# 쿼리, 코드 쌍을 DSPy Example로 포맷팅
trainset = [dspy.Example(query=q, code=c).with_inputs('query') for q, c in zip(eval_full_df['Query'], eval_full_df['Best Response'])]
```


<div class="content-ad"></div>

## Few Shot 예시 찾기

LLM에 프롬프트에 몇 가지 예시를 제공하는 것은 LLM의 응답을 향상시키는 일관된 기술이었습니다. 좋은 예시를 찾는 전통적인 방법은 추측하고 시도해보는 것이었습니다. 이제 추가할 예시를 체계적으로 찾을 수 있습니다.

BootStrapFewShot은 다음을 수행하여 시작합니다:

- 최적화하려는 학생 프로그램과 일반적으로 학생의 사본인 선생님 프로그램을 초기화합니다.
- LabeledFewShot 텔레프롬프터를 사용하여 선생님에게 데모를 추가합니다.
- 예측기의 이름과 학생 및 선생님 모델 모두에서 해당 인스턴스와의 매핑을 생성합니다.
- 부트스트랩 데모 수(최대 부트스트랩)를 설정하여 생성되는 초기 교육 데이터 양을 제한합니다.

<div class="content-ad"></div>

다음으로, 훈련 세트의 각 예제를 거쳐 갑니다. 각 예제에 대해:

- 해당 방법은 부트스트랩의 최대 횟수에 도달했는지 확인합니다. 그렇다면 프로세스가 중지됩니다.
- 교사 모델이 예측을 생성하려고 합니다.
- 교사 모델이 성공적으로 예측을 수행하면, 이 과정의 세부 내용이 기록됩니다. 이에는 어떤 예측자가 호출되었는지, 받은 입력 및 생성된 출력이 포함됩니다.
- 예측이 성공하면, 기록된 과정의 각 단계에 대해 입력 및 출력을 포함한 데모가 생성됩니다.

```js
from dspy.teleprompt import BootstrapFewShotWithRandomSearch

# 옵티마이저 설정: 프로그램 단계의 8번 샘플을 "부트스트랩"(즉, 자체 생성)하기를 원합니다.
# 옵티마이저는 이를 개발세트에서 최상의 시도로 선택하기 전에 10번 반복(초기 시도 포함)합니다.
config = dict(max_bootstrapped_demos=2, max_labeled_demos=2, num_candidate_programs=3, num_threads=4)

# 간단히 말해, 임의 검색으로 적은 데이터로 학습하기는 LLM을 사용하여 예제를 생성한 후
# 이를 평가하는 방식으로 작동합니다.
# 여러 번의 반복 후에는 훈련 세트에 좋은 예제가 생성됩니다.
teleprompter = BootstrapFewShotWithRandomSearch(metric=full_metric, **config)
optimized_agent = teleprompter.compile(agent, trainset=trainset)
```

훈련 후 이를 통해 프롬프트에 추가할 몇 가지 예제가 제공됩니다. 이를 확인하려면 lm.inspect_history(n=1)을 사용할 수 있습니다.

<div class="content-ad"></div>

![표](/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_11.png)

## 프롬프트 지침, 서명 및 접두사 최적화

프롬프트를 테스트할 예제는 있지만 초기 지침은 어떻게 할까요? DSPy는 COPRO라는 알고리즘을 사용하여 이를 최적화합니다. 이 알고리즘은 다음과 같이 작동합니다:

- 새로운 지침 생성 및 개선: COPRO는 새로운 지침 세트를 생성하고 단계별로 개선합니다.
- Coordinate Ascent(언덕 오르기): 이것은 각 단계가 주어진 메트릭 함수를 기반으로 결과를 개선하려는 최적화 기술입니다. 언덕 오르기는 계속해서 값이 증가하는 솔루션을 향해 이동하는 로컬 탐색 알고리즘입니다.
- 메트릭 함수 및 훈련 데이터셋: 최적화에는 메트릭 함수(성공이나 적합성의 양적 측정일 수 있음)와 훈련 데이터셋(trainset)을 사용하여 지침을 평가하고 개선합니다.
- 깊이: 이 매개변수는 프롬프트를 개선하기 위해 최적화자가 수행하는 반복 횟수를 지정합니다. 보통 더 많은 반복은 더 정제되고 최적화된 지침을 가능하게 합니다.

<div class="content-ad"></div>

```js
from dspy.teleprompt import COPRO

# 설계된 메트릭과 시도할 최적화 횟수를 알려주는 폭으로 COPRO를 초기화합니다.
teleprompter = COPRO(
    metric=full_metric,
    verbose=True, breadth=5
)

# num_threads는 LLM과 함께 열리는 인스턴스 수입니다. 
# API를 과도하게 사용하여 요금이 부과될 수 있으니 주의하세요.
kwargs = dict(num_threads=8, display_progress=True, display_table=0) # 최적화 프로세스의 Evaluate 클래스에서 사용됨

# 프로그램을 컴파일합니다.
compiled_prompt_opt = teleprompter.compile(agent, trainset=trainset[:40], eval_kwargs=kwargs)
# 나중에 검토할 수 있도록 저장합니다.
compiled_prompt_opt.save('COPRO_agent.json')
```

컴파일 후에는 에이전트의 성능을 향상시키는 데 어떤 종류의 지침, 접두사 및 서명이 더 나은 성능을 낼지 확인할 수 있습니다.

```js
# 모든 DSPy 프로그램 내부에서 __dict__를 사용하여 후보 프로그램을 확인할 수 있습니다.
compiled_prompt_opt.__dict__
```

<img src="/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_12.png" />


<div class="content-ad"></div>


<img src="/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_13.png" />

# 결과

아래는 각 프롬프트 기법에 대한 컴파일된 결과입니다. 전체적으로 가장 큰 개선은 시그니처 및 접두사를 최적화한 COPRO_AGENT에서 나왔습니다. 즉, 원래 지시사항 및 접두사가 매우 최적화되지 않았음을 의미합니다. 전체적으로 COPRO 에이전트는 데이터셋에서 71%의 성능을 보였으며, FewShoot는 63%의 성능을 보였으며, 베이스 라인은 60%였습니다.

<img src="/assets/img/2024-06-19-ImprovingPerformanceforDataVisualizationAIAgent_14.png" />


<div class="content-ad"></div>

## 다음 단계

에이전트는 분명히 개선되었지만 아직 멀었습니다. 저는 이 AI 에이전트를 사용하여 기본적인 탐색적 데이터 분석 및 통계 모델링을 수행하는 등의 추가 기능을 더욱 개선할 계획입니다.

이 게시물이 유익했다면 FireBird Technologies와 저를 Medium에서 팔로우해보세요. AI 개발에 도움이 필요하다면 아래 링크를 통해 자유롭게 연락해 주세요.

[링크](https://form.jotform.com/240744327173051)

<div class="content-ad"></div>

읽어 주셔서 감사합니다!