---
title: "드디어 7B 파라미터 모델이 GPT-4를 이겼어요"
description: ""
coverImage: "/assets/img/2024-06-19-Finally7BParameterModelbeatsGPT-4_0.png"
date: 2024-06-19 16:28
ogImage: 
  url: /assets/img/2024-06-19-Finally7BParameterModelbeatsGPT-4_0.png
tag: Tech
originalTitle: "Finally! 7B Parameter Model beats GPT-4!"
link: "https://medium.com/@boredgeeksociety/finally-7b-parameter-model-beats-gpt-4-732cb0f3321d"
---


우리는 작고 매우 효율적인 모델의 시대로 접어들고 있어요!

![Image](/assets/img/2024-06-19-Finally7BParameterModelbeatsGPT-4_0.png)

# 문맥

몇 일 전 새로운 최첨단 오픈소스 모델에 대해 보도했었죠. 이 모델은 GPT-4를 비롯한 다른 모델들을 능가하는 것으로 나타났습니다.

<div class="content-ad"></div>

이 모델은 SQLCoder-70B입니다.

간략히 말해서, 최근 Meta의 CodeLlama-70B를 기반으로, Defog는 자체 수작업 데이터셋을 활용하여 새로운 섬세하게 조정된 모델을 만들었습니다.

결과는? 직접 확인해보세요:

![image](/assets/img/2024-06-19-Finally7BParameterModelbeatsGPT-4_1.png)

<div class="content-ad"></div>

모델은 GPT-4 및 다양한 SQL 작업들을 크게 개선했습니다!

더 알아보기: 여기에서 모든 내용을 읽고 모델을 테스트할 수 있어요.

# SQLCoder-70B에서 SQLCoder-7B로

안타깝게도, 70B 파라미터 모델은 아직 오프라인 통합이나 노트북에서 실행하는 것에는 너무 크다고 생각됩니다.

<div class="content-ad"></div>

# 모델 증류

모델 증류는 작고 간단한 "학생" 모델에게 크고 복잡한 "선생님" 모델처럼 행동할 수 있도록 가르치는 기계 학습 과정입니다. 선생님의 결과를 배우면서 학생은 비슷한 결정을 내릴 수 있으며, 그 크기나 복잡성이 커질 필요 없이 사용을 빠르고 저렴하게 만들어줍니다. 특히 핸드폰이나 태블릿과 같은 장치에서 사용할 때 유용합니다.

# SQLCoder-7B

모델 증류를 활용하여 Defog는 작은 7B 매개변수 모델을 훈련시키고 표준 벤치마크에서 평가했습니다.

<div class="content-ad"></div>

결과

- 콤팩트 모델
- SQLCoder 70B 파라미터 모델보다 약간 성능이 떨어지지만,
- 그래도 전반적으로 GPT-4를 이긴다!
- SQLCode-7B-2 (7B 모델의 두 번째 반복)와 비교한 성능은 90.5%입니다!

# 결론

SQLCoder-7B의 성공은 특정 도메인에서 프로프리어터리 모델인 GPT-4의 성능을 능가할 수 있는 대규모 기초 모델 위에 세밀하게 조정된 niche, 오픈 소스 모델의 타당한 예입니다.

<div class="content-ad"></div>

메타의 70B 매개변수 CodeLlama에서 파생된 이 모델은 전문 데이터 세트와 대상 지정된 세세한 조정을 통해 SQL 작업과 같은 분야에서 우수한 성능을 달성할 수 있는 잠재력을 보여줍니다!

다가올 몇 달 동안 더 많은 모델이 등장할 것으로 기대되며, 이들은 작고 효율적인 오픈 소스 모델을 사용하여 특정 문제를 해결하기 위해 개발될 것입니다. 이러한 추세는 강력하면서도 다양한 기기와 애플리케이션에 접근 가능하고 적응 가능한 AI 솔루션을 만들기로 대표적인 변화를 보여줍니다.