---
title: "DSPy를 사용하여 메타데이터 추출하는 방법 - NER 스타일 가이드"
description: ""
coverImage: "/assets/img/2024-06-22-UsingDSPyforextractingmetadataNERstyle_0.png"
date: 2024-06-22 20:47
ogImage: 
  url: /assets/img/2024-06-22-UsingDSPyforextractingmetadataNERstyle_0.png
tag: Tech
originalTitle: "Using DSPy for extracting metadata NER style"
link: "https://medium.com/gopenai/using-dspy-for-extracting-metadata-ner-style-44e3f4d55fe5"
---


DSPy는 프로그래밍을 장려하는 "선언적" 방식을 통해 LLMs를 가르치는 것을 선호하여 커뮤니티에서 빠르게 큰 관심을 얻었습니다. 이 글에서는 DSPy를 사용하여 Named Entity Recognition (NER) 또는 구조화된 데이터 추출을 얼마나 쉽게 할 수 있는지 살펴보겠습니다. 이를 통해 자신감을 가지고 기능을 활용할 수 있습니다.

자세한 내용은 아래의 원문을 확인해주세요:

시작해봅시다 😎!

# 소개

<div class="content-ad"></div>

요즘 대형 언어 모델(Large Language Models, LLM)과 작업한 사람들은 프롬프트(prompt)의 중요성을 강조할 것입니다. 프롬프트를 조금만 바꿔도 출력물에 예상치 못한 변화가 연쇄적으로 발생할 수 있습니다. 또한 다른 LLM 제공업체 간에 프롬프트를 이전하거나 재사용하는 일이 까다로운 경우도 많습니다. 예를 들어, OpenAI에서 Claude 3를 통해 Antrophic을 사용하는 함수 호출 로직을 이동하는 경우 프롬프트를 재설계해야 할 필요가 있죠 😅.

따라서 프롬프트를 다시 작성하고, 평가를 재평가하며, 출력물을 디버깅하는 데 많은 시간 ⏰을 투자해야 합니다. 이를 보다 똑똑하게 처리할 수 있는 방법이 있다면 좋을텐데요? 다행히도, DSPs와 같은 흥미로운 프레임워크는 LLM 제공자에 관계없이 프로그래밍에 중점을 둡니다. 자세한 내용은 참조할 자료에서 DSPy에 대해 더 깊이있게 알아볼 수 있습니다.

# Declarative Self-Improving Language Programs (DSPy)

DSPy 또는 선언적 자기 개선 언어 프로그램(Declarative Self-improving Language Programs, Khattab et al, 2023)은 처음으로 [2]에서 소개되었습니다. DSPy는 PyTorch와 같은 신경망 프레임워크에서 영감을 받아, 프롬프트보다는 프로그래밍에 중점을 둡니다.

<div class="content-ad"></div>

간단히 말하자면, DSPy 프로그래밍 모델은 다음과 같은 추상화를 가지고 있습니다:

- 필요한 손쓰기 프롬프트/세밀 조정을 대체할 서명.
- Cot, REACT 등 다양한 프롬프트 엔지니어링 기술을 구현한 모듈.
- 주어진 메트릭스를 기반으로 한 수동 프롬프트 엔지니어링을 자동화하는 옵티마이저

더 자세한 설명은 참조 사항 중 [1]을 참고하십시오.

# 음식 관련 엔티티에 DSPy를 사용한 NER

<div class="content-ad"></div>

다음 섹션에서는 DSPy를 사용하여 NER 사용 사례를 살펴볼 것입니다.

## 데이터

사용할 데이터는 라면 🍜 한 그릇을 만들기 위한 차슈 돼지고기 레시피입니다. 아래 게시물에서 자세한 내용을 확인하세요:

예시 데이터:

<div class="content-ad"></div>

```js
### 차슈 돼지고기 (라면 및 기타 용도)
차슈 돼지고기는 라멘과 같은 일본 요리에 사용되는 돼지 배를 준비하는 전통적인 방법입니다.
다소 시간이 걸릴 수 있지만 비교적 손쉽고 맛있는 결과물이 나옵니다.

### 재료
2 파운드의 돼지 배 또는 조금 더/적게
2개의 대파 또는 작은 경우 3개
1인치 크기의 생 생강 (약 4-6조각 나오는 양)
2쪽의 마늘
⅔컵의 사케
⅔컵의 간장
¼컵의 미린
½컵의 설탕
필요에 따라 조절 가능한 2컵의 물
### 요령
돼지고기를 준비하기 전에 줄 또는 부엌 실을 준비하고 가위 한 켤레를 준비하세요.
해당 사항이 있다면 돼지고기의 외부 지방을 다듬어주세요. 그럼에도 불구하고 이후에는 여전히
...
```

위의 데이터 외에도 TypedPredictor와 함께 사용할 Pydantic 데이터 모델을 설정해야 합니다:

```js
class FoodMetaData(BaseModel):
    reasoning: str = Field(description="엔티티가 정확한 이유")
    value: Union[str, int] = Field(description="엔티티의 값")
    entity: str = Field(description="실제 엔티티 즉, 돼지고기, 양파 등")

class FoodMetaDatas(BaseModel):
    context: List[FoodMetaData]
```

```js
class FoodEntity(BaseModel):
    food: str = Field(description="유체 및 고체 음식, 즉 고기, 채소, 주류 등이 될 수 있습니다.")
    quantity: int = Field(description="레시피에 사용해야 하는 실제 양 또는 양")
    unit: str = Field(description="사용 중인 단위, 예를 들어 그램, 밀리리터, 파운드 등")
    physical_quality: Optional[str] = Field(description="재료의 특성")
    color: str = Field(description="음식의 색상")
class FoodEntities(BaseModel):
    entities: List[FoodEntity]
```  

<div class="content-ad"></div>

- FoodMetadatas는 각 엔티티의 컨텍스트 추출 + 추론 흐름의 일부입니다.
- FoodEntities는 우리가 원하는 엔티티를 추출하는 데 사용됩니다.

마지막으로, DSPy 프로그램이 옵티마이저를 위해 컴파일될 때, 우리는 dspy.Examplemodule을 사용하여 일부 훈련 예제를 만들 것입니다:

```js
trainset = [
    dspy.Example(
        recipe="2개의 계란, 500그램 버터 및 10그램 그리르치즈로 프렌치 오믈렛 만들기", 
        entities=[
            FoodEntity(food="계란", quantity=2, unit="", physical_quality="", color="흰색"),
            FoodEntity(food="버터", quantity=500, unit="그램", physical_quality="", color="노랑"),
            FoodEntity(food="치즈", quantity=10, unit="그램", physical_quality="그리레", color="노랑")
        ]
    ).with_inputs("recipe"),
        ...
    dspy.Example(
        recipe="250g 밀가루, 1큰술 베이킹 파우더, 1그램 소금, 10g 설탕, 100ml 신선우유로 아메리칸 팬케이크 만들기", 
        entities=[
            FoodEntity(food="밀가루", quantity=250, unit="그램", physical_quality="", color="흰색"),
            FoodEntity(food="베이킹 파우더", quantity=1, unit="큰술", physical_quality="", color="흰색"),
            FoodEntity(food="소금", quantity=1, unit="그램", physical_quality="짠맛", color="흰색"),
            FoodEntity(food="우유", quantity=100, unit="밀", physical_quality="지방", color="흰색"),
        ]
    ).with_inputs("recipe")
]
```

## 서명

<div class="content-ad"></div>

데이터셋을 만들거나 수집한 후의 다음 단계는 DSPy 프로그램에 대한 서명을 작성하는 것입니다. 이것을 입력/출력 동작에 대한 선언적 명세로 생각할 수 있습니다:

```js
class RecipeToFoodContext(dspy.Signature):
    """당신은 음식 AI 어시스턴트입니다. 엔티티, 엔티티의 값 및 추출된 값이 올바른 값인 이유를 추출하는 작업을 수행해야 합니다. 
    엔티티를 추출할 수 없는 경우 null을 추가하십시오"""
    recipe: str = dspy.InputField()
    context: FoodMetaDatas = dspy.OutputField()
```

```js
class RecipeToFoodEntities(dspy.Signature):
    """당신은 음식 AI 어시스턴트입니다. 레시피에서 음식과 관련된 메타데이터를 추출해야 합니다."""
    recipe: str = dspy.InputField()
    entities: FoodEntities = dspy.OutputField()
```

- RecipeToFoodContext은 문맥 + 추론 호출에 사용되는 서명입니다. 여기에서 문자열 설명을 사용하여 LLM에 초기 지침을 제공했다는 점에 유의하십시오.
- RecipeFoodEntities는 실제로 식별된 엔티티를 추출하는 서명에 해당합니다.

<div class="content-ad"></div>

지금까지는 특별한 공학 작업이 아니라 Python 클래스/객체를 명시하는 것이었습니다 🐍. 코드는 또한 이해하기 비교적 쉽습니다. 무엇을 하는지, 입력이나 출력 등이 뭔지 잘 알 수 있죠.

## Modules

데이터셋을 생성하고 서명을 지정한 후에는 모듈을 작성할 준비가 되었습니다. 각 모듈은 Chain-of-Thought, ReAct 등 다양한 프롬프팅 기술을 "추상화"하는 멋진 기능이 있습니다. 또한 신경망 프레임워크에 익숙한 독자들을 위해 아래의 forward 메서드에 주목해주세요:

```js
class ExtractFoodEntities(dspy.Module):
    def __init__(self, temperature: int = 0, seed: int = 123):
        super().__init__()
        self.temperature = temperature
        self.seed = seed
        self.extract_food_context = dspy.TypedPredictor(RecipeToFoodContext)
        self.extract_food_context_cot = dspy.TypedChainOfThought(RecipeToFoodContext)
        self.extract_food_entities = dspy.TypedPredictor(RecipeToFoodEntities)
        
    def forward(self, recipe: str) -> FoodEntities:
        food_context = self.extract_food_context(recipe=recipe).context
        parsed_context = parse_context(food_context.context)
        food_entities = self.extract_food_entities(recipe=parsed_context)
        return food_entities.entities
```

<div class="content-ad"></div>

위 모듈은 dspy.Module 인터페이스를 사용하고 있습니다. dspy.Functional 인터페이스를 사용하여 모듈을 지정할 수도 있습니다:

```js
from dspy.functional import FunctionalModule, predictor, cot

class ExtractFoodEntitiesV2(FunctionalModule):
    def __init__(self, temperature: int = 0, seed: int = 123):
        super().__init__()
        self.temperature = temperature
        self.seed = seed
    @predictor
    def extract_food_context(self, recipe: str) -> FoodMetaData:
        """당신은 음식 AI 어시스턴트입니다. 엔티티, 엔티티의 값 및 추출된 값이 올바른 값인 이유를 추출하는 것이 작업입니다. 
        엔티티를 추출할 수 없는 경우 null을 추가하세요."""
        pass
    @cot
    def extract_food_context_cot(self, recipe: str) -> FoodMetaData:
        """당신은 음식 AI 어시스턴트입니다. 엔티티, 엔티티의 값 및 추출된 값이 올바른 값인 이유를 추출하는 것이 작업입니다. 
        엔티티를 추출할 수 없는 경우 null을 추가하세요."""
        pass
    
    @predictor
    def extract_food_entities(self, recipe: str) -> FoodEntities:
        """당신은 음식 AI 어시스턴트입니다. 작업은 레시피에서 음식 엔티티를 추출하는 것입니다."""
        pass
        
    def forward(self, recipe: str) -> FoodEntities:
        food_context = self.extract_food_context(recipe=recipe)
        parsed_context = parse_context(food_context.context)
        food_entities = self.extract_food_entities(recipe=parsed_context)
        return food_entities
```

이를 통해 데코레이터 함수를 사용하여 표준 프롬프트 엔지니어링 기술을 지정할 수 있으며, 이는 매우 깔끔합니다. 또한 모듈에서 사용된 parse_context 메서드는 결과 JSON 콘텍스트를 문자열로 구문 분석하는 유틸리티 함수이며, 체인의 다음 단계에 대한 입력으로 사용될 것입니다.

## DSPy 프로그램 실행하기

<div class="content-ad"></div>

프로그램을 실행하려면 모듈의 인스턴스를 만들고 입력값을 사용하여 호출하십시오. 그러나 DSPy의 또 다른 멋진 기능은 모듈에 대한 dspy.Context를 지정할 수 있다는 것입니다:

```js
extract_food_entities = ExtractFoodEntities()

with dspy.context(lm=gpt4):
    entities = extract_food_entities(recipe="Ten grams of orange dutch cheese,  \
    2 liters of water and 5 ml of ice")
    pprint(entities)
```

위의 프로그램은 다음 출력을 보여줍니다:

```js
FoodEntities(
    entities=[
        FoodEntity(
            food='orange dutch cheese',
            quantity=10,
            unit='grams',
            physical_quality=None,
            color='orange',
        ),
        FoodEntity(
            food='water',
            quantity=2000,
            unit='milliliters',
            physical_quality=None,
            color='clear',
        ),
        FoodEntity(
            food='ice',
            quantity=5,
            unit='milliliters',
            physical_quality=None,
            color='clear',
        ),
    ],
)
```

<div class="content-ad"></div>

이것은 다른 LLM(모델 상의 큰 언어 모델)을 시험해보거나, 예를 들어 DEV에는 gpt-3.5-turbo를 사용하고, PROD에서는 더 강인한 모델인 gpt-4-turbo-preview를 사용한다면 유용할 것입니다.

## DSPy 프로그램 최적화하기

이제 프로그램을 최적화하는 데 필요한 모든 구성 요소가 준비되었습니다 🎉. DSPy에서 최적화자는 DSPy 프로그램의 매개변수인 프롬프트와/또는 LM(언어 모델) 가중치를 조정할 수 있는 알고리즘입니다. 프로그램을 최적화하려면 최대화할 메트릭을 제공합니다.

최적화 단계에서는 BootstrapFewShot 최적화자를 사용합니다. 그리고 최대화하려는 메트릭(어떤 파이썬 함수도 될 수 있음)은 아래에 표시되어 있습니다:

<div class="content-ad"></div>

```python
def validate_entities(example, pred, trace=None):
    """두 객체가 동일한지 확인합니다."""
    return example.entities == pred
```

최적화를 실행하려면 compile 메서드를 사용합니다:

```python
from dspy.teleprompt import BootstrapFewShot

teleprompter = BootstrapFewShot(metric=validate_entities)
compiled_ner = teleprompter.compile(ExtractFoodEntitiesV2(), trainset=trainset)
```

저희 데이터셋에서 컴파일된 프로그램을 실행한 결과는 다음과 같습니다:

<div class="content-ad"></div>

```js
FoodEntities(
    entities=[
        FoodEntity(
            food='삼겹살',
            quantity=2,
            unit='lb',
            physical_quality=None,
            color='',
        ),
        FoodEntity(
            food='파',
            quantity=2,
            unit='개',
            physical_quality='작을 경우 3개',
            color='',
        ),
        FoodEntity(
            food='생강',
            quantity=1,
            unit='인치',
            physical_quality='한 조각',
            color='',
        ),
        FoodEntity(
            food='마늘',
            quantity=2,
            unit='쪽',
            physical_quality=None,
            color='',
        ),
        FoodEntity(
            food='술',
            quantity=2,
            unit='⅔ 컵',
            physical_quality=None,
            color='',
        ),
        FoodEntity(
            food='간장',
            quantity=2,
            unit='⅔ 컵',
            physical_quality=None,
            color='',
        ),
        FoodEntity(
            food='미린',
            quantity=1,
            unit='¼ 컵',
            physical_quality=None,
            color='',
        ),
        FoodEntity(
            food='설탕',
            quantity=1,
            unit='½ 컵',
            physical_quality=None,
            color='',
        ),
        FoodEntity(
            food='물',
            quantity=2,
            unit='컵',
            physical_quality='필요에 따라 약간 더',
            color='',
        ),
    ],
)
```

프롬프트 엔지니어링에 반이나하 며 살짝 봐두 시간 정도만 투자한 것에 대해서 꽤 괜찮지 않나요? 💪!

## LLM 검사

프로그램을 이렇게 선언하는 것도 좋지만 LLM이 사용하는 기본 프롬프트를 확인하려면 어떻게 해야 할까요? 걱정 마세요. inspect_history를 사용해 보세요:


<div class="content-ad"></div>

```js
gpt4.inspect_history(n=1)
```

아래와 같은 출력이 나왔습니다:

```js
당신은 음식 AI 어시스턴트입니다. 레시피에서 음식 엔티티를 추출하는 것이 당신의 임무입니다.

---

다음 형식을 따르세요.
레시피: ${recipe}
음식 엔티티 추출: ${extract_food_entities}. 단일 JSON 객체로 응답하세요. JSON 스키마: {"$defs": {"FoodEntity": {"properties": {"food": {"description": "고기, 채소, 주류 등과 같이 고체 및 액체 음식일 수 있습니다", "title": "음식", "type": "string"}, "quantity": {"description": "레시피에 사용해야 하는 음식의 정확한 양 또는 분량", "title": "분량", "type": "integer"}, "unit": {"description": "사용 중인 단위 (예: 그램, 밀리리터, 파운드 등)", "title": "단위", "type": "string"}, "physical_quality": {"anyOf": [{"type": "string"}, {"type": "null"}], "description": "재료의 특성", "title": "물리적 품질"}, "color": {"description": "음식의 색깔", "title": "색깔", "type": "string"}, "required": ["food", "quantity", "unit", "physical_quality", "color"], "title": "FoodEntity", "type": "object"}, "properties": {"entities": {"items": {"$ref": "#/$defs/FoodEntity"}, "title": "Entities", "type": "array"}, "required": ["entities"], "title": "FoodEntities", "type": "object"}
---
레시피:
pork belly:
{
"reasoning": "차슈 포크의 주 재료로 2 파운드의 삼겹살을 사용하도록 레시피에서 명시되어 있습니다.",
"value": "2 파운드",
"entity": "삼겹살"
}
green onions:
{
"reasoning": "2개의 대파가 필요하며, 작은 대파인 경우 3개를 사용합니다.",
"value": "2 또는 3",
"entity": "대파"
}
fresh ginger:
{
"reasoning": "레시피에는 신선한 생강 1인치가 필요하며, 이는 레시피에 대략 4~6개의 조각을 제공합니다.",
"value": "1인치",
"entity": "생강"
}
garlic:
{ 
"reasoning": "재료 중에는 마늘 2쪽이 필요합니다.",
"value": "2쪽",
"entity": "마늘"
}
sake:
{
"reasoning": "풍미를 위해 요리 액체에 ⅔컵의 사케가 사용됩니다.",
"value": "⅔컵",
"entity": "사케"
}
soy sauce:
{
"reasoning": "요리 액체에 ⅔컵의 간장이 추가되어 요리의 맛을 더합니다.",
"value": "⅔컵",
"entity": "간장"
}
mirin:
{
"reasoning": "달콤하고 깊은 맛을 위해 레시피에 ¼컵의 미린이 포함됩니다.",
"value": "¼컵",
"entity": "미린"
}
sugar:
{
"reasoning": "요리 액체를 달게하기 위해 ½컵의 설탕을 사용합니다.",
"value": "½컵",
"entity": "설탕"
}
water:
{
"reasoning": "삼겹살을 위한 요리 액체를 만들기 위해 2컵의 물(필요에 따라 더 추가 가능)이 필요합니다.",
"value": "2컵",
"entity": "물"
}
음식 엔티티 추출: json
{
"entities": [
{
"food": "삼겹살",
"quantity": 2,
"unit": "파운드",
"physical_quality": null,
"color": ""
},
{
"food": "대파",
"quantity": 2,
"unit": "개",
"physical_quality": "작으면 3개",
"color": ""
},
{
"food": "생강",
"quantity": 1,
"unit": "인치",
"physical_quality": "조각",
"color": ""
},
{
"food": "마늘",
"quantity": 2,
"unit": "쪽",
"physical_quality": null,
"color": ""
},
{
"food": "사케",
"quantity": 2,
"unit": "⅔컵",
"physical_quality": null,
"color": ""
},
{
"food": "간장",
"quantity": 2,
"unit": "⅔컵",
"physical_quality": null,
"color": ""
},
{
"food": "미린",
"quantity": 1,
"unit": "¼컵",
"physical_quality": null,
"color": ""
},
{
"food": "설탕",
"quantity": 1,
"unit": "½컵",
"physical_quality": null,
"color": ""
},
{
"food": "물",
"quantity": 2,
"unit": "컵",
"physical_quality": "필요에 따라 추가",
"color": ""
}
]
}
``
```

# 마무리말

<div class="content-ad"></div>

이 게시물의 목적은 DSPy 라이브러리를 익히고 TypedPredictor 클래스를 주로 NER 사용 사례에 사용하는 방법을 살펴보는 것이었습니다. 이제 여러분도 더 나은 이해를 하셨으면 좋겠습니다!

첫 인상을 요약하면 다음과 같습니다:

- DSPy는 사용하기 쉽고 시작하기 쉽습니다 ✅
- 프롬프트 엔지니어링에 시간을 낭비하는 대신, 프레임워크가 대신 처리해 주는 것이 아주 좋습니다 ✅
- LLM을 최적화 및 PyTorch와 같은 아이디어를 사용하여 "전형적인" ML 문제로 다루는 것이 매우 좋습니다 ✅
- 여전히 발전 중이며 아마도 "운영"에 준비가 되지는 않았습니다 ❌
- 프로그램을 디버깅할 때 무슨 일이 일어나고 있는지 이해하기 쉽도록 더 나은 로깅/추적이 필요합니다 ❌

그러나 프롬프트를하는 대신 LLM을 프로그래밍하는 접근 방식을 좋아합니다. 이것은 분야에서 흥미로운 발전이며 예를 들어, 미래의 복합 AI 시스템에 대한 것입니다.

<div class="content-ad"></div>

DSPY의 채택 및 추가 개발을 기대하고 있어요.

# 참고 자료

- 💻 DSPy 소개: 인사 대신 프로그래밍으로!
- 💻 DSPy: 선언형 언어 모델 호출을 자가 개선 파이프라인으로 컴파일하기
- 💻 DSPy 심층 탐구