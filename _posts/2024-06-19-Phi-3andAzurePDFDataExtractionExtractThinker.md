---
title: "파이-3와 Azure PDF 데이터 추출  ExtractThinker"
description: ""
coverImage: "/assets/img/2024-06-19-Phi-3andAzurePDFDataExtractionExtractThinker_0.png"
date: 2024-06-19 04:00
ogImage: 
  url: /assets/img/2024-06-19-Phi-3andAzurePDFDataExtractionExtractThinker_0.png
tag: Tech
originalTitle: "Phi-3 and Azure: PDF Data Extraction | ExtractThinker"
link: "https://medium.com/towards-artificial-intelligence/phi-3-and-azure-pdf-data-extraction-extractthinker-cb490a095adb"
---


PDF 및 이미지에서 구조화된 데이터를 추출하는 것은 어려울 수 있지만, 광학 문자 인식 (OCR)과 언어 모델 (LLMs)을 결합하면 강력한 솔루션을 제공할 수 있습니다. Azure 생태계 내에서 문서 지능 서비스를 활용하면 문서를 분석할 때 좋은 선택이 될 것입니다.

이 글에서는 Azure AI 스튜디오의 Phi-3 미니 모델을 활용하여 데이터 추출 프로세스를 개선하는 방법을 보여드리겠습니다. Phi-3 미니 모델은 38억 개의 매개변수를 가진 작은 언어 모델(SML)로 효율적이고 정확한 결과를 제공하여 이 작업에 이상적인 선택지입니다. 이 예제는 Azure에 중점을 두고 있지만, 이와 유사한 도구를 사용하여 다른 제공업체에서도 적용할 수 있는 원칙을 다룹니다.

해당 솔루션은 다른 클라우드 제공업체에도 쉽게 복제되며, 비슷한 품질, 가격, 기능을 제공합니다.

# OCR 선택하기 - Azure 문서 지능

<div class="content-ad"></div>

Azure Document Intelligence은 Microsoft 생태계에 속하는 OCR 제품입니다. 가격 측면에서는 아래 이미지에서 볼 수 있듯이 세 가지 계층으로 나뉩니다:

![이미지](/assets/img/2024-06-19-Phi-3andAzurePDFDataExtractionExtractThinker_0.png)

"read"는 단락과 필기 텍스트만 추출합니다. 기본적으로 전통적인 OCR입니다. 대부분의 문서 추출에는 충분하지만 복잡한 문서에는 부족할 수 있습니다.

"prebuilt" 레이아웃은 작업에 가장 적합한 선택지이며 나머지는 LLM이 처리합니다. 이 옵션에는 영수증, 송장, 신분증, W-2 등 여러 템플릿이 있지만, 표와 확인란과 같은 구조를 강조해야 하는 추출이 필요합니다. 이를 위해 "prebuilt-layout"을 문서 유형으로 사용할 수 있습니다.

<div class="content-ad"></div>

마지막으로 가장 비싼 옵션은 "사용자 정의" 레이아웃입니다. 시스템에 공급될 문서 및 추출해야 할 필드에 따라 교육되어야 합니다. LLM 분야의 발전을 고려할 때, 이 기사에서 설명된 대로 폐기되고 수행되어야 합니다.

# Azure Ai studio의 Phi-3

Phi-3는 Microsoft의 주력 모델 그룹입니다. 그들은 작고 OpenAI에서 다루지 않는 시장 점유율을 차지하고 있습니다. OpenAI는 세계 최고의 모델을 제공하는 데 빛을 발합니다.

![이미지](/assets/img/2024-06-19-Phi-3andAzurePDFDataExtractionExtractThinker_1.png)

<div class="content-ad"></div>

허깅 페이스에 대한 이 모델 요약에 따르면, 이 모델은 3.3조 토큰을 학습했습니다. 이 작은 모델은 추출 및 분류와 같은 작업에 우수한 결과를 제공할 수 있습니다. 게다가 각 클래스는 컨텍스트 창 옵션을 제공합니다: 4k 컨텍스트 창과 128k 컨텍스트 창이 있습니다. 이 경우 약간 낮은 품질과 약간 높은 비용의 상충이 있습니다. "토큰 당 유연한 요금제" 모델의 가격은 다음과 같습니다:

![이미지](/assets/img/2024-06-19-Phi-3andAzurePDFDataExtractionExtractThinker_2.png)

먼저, 이 기사 발행 당시 "유연한 요금제"에 비전 모델이나 작은 모델이 포함되어 있지 않습니다. 위 이미지에 표시된 모델만 사용할 수 있지만, 전용 머신에 호스팅해야 합니다.

그러나 가격은 중요합니다. 요금 측면에서 미니 모델은 GPT 3.5 터보의 50% 비용이 들며, 위의 벤치마크 결과에 따르면 영어 기반 텍스트에서 비슷한 성능을 발휘합니다. 왜냐하면 Mixtral 7x8B는 GPT 3.5 (이전 버전)과 비슷한 성능을 보였기 때문입니다. 중간 모델은 GPT 3.5 터보와 비슷한 비용을 가지며 영어 기반 텍스트에서 약간 더 나은 성과를 내지만, 다른 언어에는 적합하지 않습니다. 따라서 사용 사례 분리는 다중 언어에 적합한 경우 "GPT 3.5 터보를 선택하는 것이 좋을 것"입니다.

<div class="content-ad"></div>

# 코드 구현

전체 예시는 여기에서 찾을 수 있지만, 이 섹션에서는 코드가 어떻게 작동하는지에 대해 자세히 설명해 드릴 것입니다. 이 예시는 Azure와 Phi-3에 초점을 맞추고 있지만, 다른 구성 요소를 사용할 때도 유사하게 작동합니다.

## 내부 작동 방식

<img src="/assets/img/2024-06-19-Phi-3andAzurePDFDataExtractionExtractThinker_3.png" />

<div class="content-ad"></div>

위 이미지는 ExtractThinker가 여러 조각들과 함께 작동하는 방법을 보여줍니다. Azure DI는 이 예에서 "Layout"를 문서 유형으로 사용하여 라인, 테이블 및 확인란과 같은 구조를 가진 콘텐츠를 추출합니다. 이는 데이터 매핑할 때 모델에 추가 정보를 제공합니다. 추출기 구성 요소는 그런 다음 모델 메시지에 삽입될 프롬프트를 생성합니다. 이는 비전 모델이며 이미지도 결과를 증가시키기 위해 추가할 수 있습니다.

아래는 ExtractThinker에 이를 아카이빙하는 방법입니다:

```js
subscription_key = os.getenv("AZURE_SUBSCRIPTION_KEY")
endpoint = os.getenv("AZURE_ENDPOINT")
api_key = os.getenv("AZURE_AI_API_KEY")

extractor = Extractor()
extractor.load_document_loader(
    DocumentLoaderAzureForm(subscription_key, endpoint)
)

llm = LLM(model="azure/Phi-3-mini-128k-instruct",
          api_base="https://Phi-3-mini-128k-instruct-qjsac-serverless.swedencentral.inference.ai.azure.com",
          api_key=api_key,
          api_version="v1")

extractor.load_llm(llm)

content = extractor.extract("path\\driverLicense.jpg", InvoiceContract)
```

## 확장성

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-Phi-3andAzurePDFDataExtractionExtractThinker_4.png)

추출 관점에서 고전적인 문서는 운전면허증, 매매 계약서, 송장 등이 될 수 있습니다. 이러한 문서들은 보통 작거나 한두 장 정도이므로 이미지에서 보듯이 크기가 다른 두 모델을 최적화하여 흐름을 조정할 수 있습니다. 4k 창을 초과하는 문서의 일부 (예: 5%)가 작성될 경우, 다음 코드를 사용하여 창을 초과할 경우 예외 처리를 할 수 있습니다:

```js
def router():
    model_list = [
        {
            "model_name": "azure/Phi-3-mini-4k-instruct",
            "litellm_params": {
                "model": "azure/Phi-3-mini-4k-instruct",
                "api_base": os.getenv("AZURE_API_BASE"),
                "api_key": os.getenv("AZURE_API_KEY")
            },
        },
        {
            "model_name": "azure/Phi-3-mini-128k-instruct",
            "litellm_params": {
                "model": "azure/Phi-3-mini-128k-instruct",
                "api_base": os.getenv("AZURE_API_BASE"),
                "api_key": os.getenv("AZURE_API_KEY")
            }
        },
    ]

    # 라우터 구성 정의
    router = Router(
        model_list=model_list,
        default_fallbacks=["azure/Phi-3-mini-128k-instruct"],
        context_window_fallbacks=[
            {"azure/Phi-3-mini-4k-instruct": ["azure/Phi-3-mini-128k-instruct"]},
        ],
        set_verbose=True
    )

    return router
```

# 추출용 미니 모델, 분류용 중간 모델


<div class="content-ad"></div>

문서 및 페이지의 분류에 관련된 경우, 더 큰 모델을 사용하는 것이 좋습니다 (중간). 이 모델에 대한 입력 비용은 미니 모델의 출력보다 저렴합니다 ($0.5 대 $0.8 당 MT), 그리고 출력물은 몇 개의 토큰일 것입니다 (예: 출력물은 "송장(Invoice)"이라는 1에서 3개의 토큰을 포함할 수 있습니다).

다음은 코드입니다:

```js
# 분류
분류들 = [
    Classification(name="운전 면허증(Driver License)", description="이것은 운전 면허증입니다"),
    Classification(name="송장(Invoice)", description="이것은 송장(Invoice)입니다"),
]

추출기 = Extractor()
추출기.load_document_loader(DocumentLoaderAzureForm(subscription_key, endpoint))

llm = LLM(model="azure/Phi-3-medium-4k-instruct",
          api_base="https://Phi-3-medium-4k-instruct-qjsac-serverless.swedencentral.inference.ai.azure.com",
          api_key="...",
          api_version="v1",)

추출기.load_llm(llm)

결과 = 추출기.classify_from_path("경로\\운전면허증.jpg", 분류들)
```

# 비용 절감

<div class="content-ad"></div>

비용을 절약할 때 맞춤형 모델과 비교해야 합니다. 어떤 계약도 추출에 사용할 수 있기 때문에 결과는 개발 비용을 고려하지 않고 훈련된 모델의 결과와 유사해야 합니다. 대부분의 과중한 작업은 LLM이 수행하기 때문입니다.

[이미지](/assets/img/2024-06-19-Phi-3andAzurePDFDataExtractionExtractThinker_5.png)

숫자는 여유를 두고 보수적으로 유지되어, "맞춤형" 레이아웃과 비교할 수 있도록 했습니다. 가능한 최대한 비용을 낮추는 것이 목표라면 "문서 유형"을 "읽기"로 설정하고 phi-3 mini 가격을 사용하여 $2를 초과하지 않을 수 있습니다.

# 결론

<div class="content-ad"></div>

Azure Document Intelligence 및 Phi-3 모델을 결합하여 PDF 및 이미지에서 구조화된 데이터를 효율적으로 추출할 수 있어요. 이 과정은 광학 문자 인식(OCR)을 사용하여 텍스트와 문서 구조를 인식하고, 언어 모델(LLMs)을 활용하여 관련 데이터를 정확하게 추출하는 것을 포함합니다.

이 방법은 문서 추출을 위한 Azure의 미리 구축된 레이아웃과 처리를 위한 Phi-3 미니 모델을 활용하여 비용 효율적이고 효율적인 결과를 도출합니다.

확장 가능한 솔루션을 구현하고 대체 매커니즘을 활용하여 다양한 문서 유형 및 크기를 신뢰성 있게 처리할 수 있어요.