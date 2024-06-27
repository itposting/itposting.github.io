---
title: "LangProp을 사용하여 자율주행 코드 작성 향상시키기"
description: ""
coverImage: "/assets/img/2024-06-27-MakingLLMsWriteBetterandBetterCodeforSelf-DrivingUsingLangProp_0.png"
date: 2024-06-27 19:04
ogImage: 
  url: /assets/img/2024-06-27-MakingLLMsWriteBetterandBetterCodeforSelf-DrivingUsingLangProp_0.png
tag: Tech
originalTitle: "Making LLMs Write Better and Better Code for Self-Driving Using LangProp"
link: "https://medium.com/towards-data-science/making-llms-write-better-and-better-code-for-self-driving-using-langprop-99c6c3dc9508"
---


## 고전적 기계 학습 유추: LLM (Large Language Model) = 옵티마이저; 코드 = 매개변수; LangProp = PyTorch Lightning

아마도 이메일을 쓰거나 문서를 요약하거나 정보를 찾거나 코드 디버깅을 돕는 데에 ChatGPT를 사용해 본 적이 있을 것입니다. 그런데 우리는 ChatGPT가 자동차를 운전하도록 만들 수 있을까요?

작년 3월 Wayve 인턴십을 시작했을 때 이 질문에 답하고 싶었습니다. Wayve는 런던에 위치한 자율 주행차 기업으로 도시 주행이라는 어려운 문제에 end-to-end 학습을 적용하고 있습니다. 당시 회사는 LLM 연구팀을 발대했었고 LINGO-1과 LINGO-2를 성공적으로 개발해냈습니다. AutoGPT는 방금 출시됐고 Voyager는 아직 나오지 않았을 때였습니다. 그런데도 LLM이 일으키는 혼란은 명백했습니다. 질문은, 언어가 주요한 모달리티가 아닌 주행이라는 도메인에 이 새로운 기술을 어떻게 활용할 수 있을까요?

이 블로그 글에서는 작년 5월에 ICLR (국제 학습 표현 연구회의)에서 열린 LLM 에이전트 워크샵에서 발표한 우리의 논문인 LangProp에 대한 개요를 소개하려 합니다.

<div class="content-ad"></div>

# 동기부여: 코드 작성에 ML을 직접 적용합시다.

LLM을 운전에 적용하는 도전은 두 가지 측면에 있습니다. 첫째, LLM은 그 이름대로 말하자면 매우 큰 모델로, 많은 컴퓨팅 자원이 필요하며 실행 속도가 느릴 수 있는 만큼, 자율 주행과 같은 안전 비상 시간 응용에는 적합하지 않아 보일 수 있습니다. 둘째, 언어는 높은 수준의 설명에 좋지만, 관찰을 설명하고 공간 제어 작업을 실행하는 데 필요한 세밀함과 세부 정보가 부족합니다.

그러나 우리는 운전 작업 추론에 반드시 LLM을 사용할 필요가 없다는 것을 깨달았습니다. 대신 LLM이 직접 운전을 위한 코드를 작성하도록 할 수 있습니다.

ChatGPT를 사용해 코드를 작성해 본 적이 있다면 이 아이디어가 끔찍한 것처럼 들릴 수 있습니다. ChatGPT가 작성하는 코드는 종종 잘 작동하지 않으며 오류가 포함된 경우도 많습니다. 하지만 우리가 LLM을 사용하여 버그를 감지하고 자동으로 수정하여 코드 품질을 반복적으로 향상시킨다면 어떨까요?

<div class="content-ad"></div>

우리는 이 아이디어를 한 발 더 나아가서 발전시켰어요 - 버그 수정뿐만 아니라, LLM이 생성한 코드를 원하는 목표 함수 방향으로 개선할 수 있는 교육 프레임워크를 설계했답니다. 교육 데이터셋에서 코드를 "교육"하여 손실을 감소시키려고 노력할 수 있죠. 코드의 개선은 유효성 검사 데이터셋에서 실행하여 양적으로 확인할 수 있어요.

이게 머신 러닝 같아 보이기 시작했나요? 사실 그렇죠! 하지만 LLM을 적용하는 건 아니에요. 사실, 이 과정에서 적절한 신경망이 미세 조정되는 게 없답니다. 대신, 우리는 코드 자체를 미세 조정하고 있어요!

LangProp에서 "코드"란 모델의 매개변수이고, LLM은 매개변수를 손실을 줄이는 방향으로 개선하기 위해 이끄는 최적화 도구예요. 이게 왜 멋진 걸까요? 이런 사고방식을 적용한다면, 이제 우리는 소프트웨어의 최적화를 데이터 기반으로 자동화할 수 있게 될 거예요! 딥러닝을 통해 데이터 기반 접근 방식이 어떻게 어렵게 설명할 수 있는 문제들을 해결하는 데 힘을 보여줬죠. 하지만, 지금까지 머신 러닝의 응용 영역은 숫자 값으로 매개화된 모델로 제한되어 왔어요. 이제 코드로 작성된 시스템들도 다룰 수 있게 된 거죠.

만약 인공 지능의 역사를 따라오셨다면, Symbolic AI와 현대적이면서 성공적인 머신 러닝 접근 방식을 통합하는 이 우아한 방법에 흥미를 느낄 것입니다. Symbolic AI는 인간 전문가가 세계에 대한 완벽한 모델을 논리와 코드 형태로 설명하는 것이었어요. 이는 인간 전문가만으로는 복잡한 작업 (예: 객체 인식)이 로직만으로 설명하기 쉽지 않았단 한계가 있었어요. 반면 머신 러닝은 데이터 자체가 말하도록 하고, 최적의 모델을 자동으로 설계하는 방식으로 작동해요. 이 접근 방식은 패턴 인식, 압축 및 함수 근사화를 포함한 다양한 분야에서 매우 성공적이었어요. 그러나 로직, 추론 및 장기적인 계획은 데이터에 신중하게 신경망을 맞출 때 종종 실패하는 분야에 속해요. 이는 신경망 파라미터 공간의 복잡한 작업을 학습하는 것이 어려운 일이기 때문이에요. LLM과 LangProp을 통해 이제 데이터 기반 학습 방법을 적용하여 상징적인 시스템을 배우고 개선할 수 있게 되었답니다.

<div class="content-ad"></div>

## 고지사항

자세히 들어가기 전에, 몇 가지 고지사항이 필요하다고 생각합니다.

- LangProp에 대한 이 작업은 Wayve에서 인턴십 프로젝트로 진행되었으며, 회사의 연구 및 개발 우선순위나 전략을 직접적으로 반영하지 않습니다. 이 블로그 글의 목적은 LangProp을 논문으로 설명하는 것이며, 이 블로그 글의 모든 내용은 제 개인으로서 쓴 것입니다.
- 우리는 주로 자율 주행의 경우에 LangProp을 시연했지만, (a) 환경의 완벽한 관측이 필요하다는 등의 제한사항을 강조하고 싶습니다., (b) 우리는 단순히 시뮬레이션 환경에서만 작동시켰고 실제 배치로부터는 거리가 먼 것, (c) 생성된 주행 코드가 완벽하거나 정교하지 않으며, 실제 배치에 적합하도록 많은 문제가 있습니다. 우리는 LLM을 데이터 기반 소프트웨어 최적화에 적용한 잠재력을 보여주는 연구 프로토타입으로 LangProp을 보고 있습니다. 제품으로의 배치가 아닙니다.

LangProp의 제한사항에 대한 자세한 정보가 필요하면, 우리 논문의 부록에 있는 제한 섹션을 확인해주세요.

<div class="content-ad"></div>

그렇다면, LangProp가 어떻게 작동하는지 살펴보겠습니다!

## LangProp는 어떻게 작동하나요?

### ...Symbolic AI와 진화 알고리즘을 다시 가져옵니다

![그림](/assets/img/2024-06-27-MakingLLMsWriteBetterandBetterCodeforSelf-DrivingUsingLangProp_0.png)

<div class="content-ad"></div>

LangProp은 PyTorch Lightning과 같은 디자인을 가지고 있어요. LangProp 모듈은 훈련되고 추론에 사용되는 매개변수(스크립트의 모음)를 추적합니다. 훈련 모드에서는 정책 추적기가 전방 통과 중에 입력, 출력 및 예외를 기록합니다. 코드의 성능은 목적 함수에 의해 평가됩니다. 점수에 따라 정책 추적기는 현재 있는 스크립트를 다시 순위 지정하고 상위 k개의 스크립트를 LLM으로 보내 세분화를 진행합니다. 추론 시에 예측을 하는 것은 최고 점수의 코드를 호출하는 것만으로 간단합니다.

LangProp 트레이너는 훈련할 LangProp 모듈, 훈련 데이터셋 및 검증 데이터셋을 입력으로 받아요. 데이터셋은 PyTorch Dataset 객체를 포함하여 모든 반복 가능한 객체가 될 수 있어서 기존 작업에 LangProp을 적용하기 쉬워요. 훈련이 완료되면, 우리는 수정된 코드 모음과 코드 순위를 위한 몇 가지 통계와 함께 체크포인트를 저장할 수 있어요.

우리가 최상의 코드를 선택하고 개선하는 메커니즘은 진화 알고리즘과 유사합니다. 처음에는 샘플을 무작위로 선택하지만, 그 중에서 성능이 우수한 샘플은 유지되어 새로운 더 좋은 샘플 집단을 생성하기 위해 변형됩니다.

# 운전에 LangProp 적용하기

<div class="content-ad"></div>

![이미지](/assets/img/2024-06-27-MakingLLMsWriteBetterandBetterCodeforSelf-DrivingUsingLangProp_1.png)

이제 LangProp을 사용하여 CARLA에서 운전해 봅시다!

CARLA는 자율 주행 연구에 사용되는 오픈 소스 주행 시뮬레이터입니다. 자율 주행 자동차 에이전트를 벤치마크하기 위한 리더보드 챌린지가 있습니다. 우리는 이 챌린지의 표준 노선과 도시에서 LangProp을 테스트했습니다.

LangProp을 기계 학습 프레임워크로 정의하는 좋은 점은 이제 고전적인 지도 학습뿐만 아니라 모방 학습과 강화 학습 기술도 적용할 수 있다는 것입니다.

<div class="content-ad"></div>

특히 전투부서(Table)태그를 마크다운 형식으로 변경합니다.

항목들
- 오프라인 데이터셋(전문가의 주행 데모에서 수집된 상태 및 행동 쌍)에서 교육을 시작하고 온라인 롤아웃을 수행합니다. 온라인 롤아웃 중에는 DAgger[1]를 사용합니다. 이는 온라인 롤아웃으로 수집된 샘플들을 전문가의 레이블로 표시하고 현재 데이터셋과 통합하는 데이터 집합 집계 기술입니다.

- 모델(코드)에 들어가는 입력은 환경 상태의 파이썬 사전입니다. 이는 차량 및 주변 배우자의 자세 및 속도, 교통 신호/정지 표지판까지의 거리를 포함합니다. 출력은 차량이 주행해야 하는 속도와 조향각인 주행 행동입니다.

- 교통 신호나 정지 신호를 무시하거나, 다른 차량, 보행자 또는 자전거 타기와 충돌하거나, 너무 오래 서 있을 경우, 성능 점수에 벌점이 있습니다. 교육 목표는 흉내 학습 점수(에이전트가 실제 행동 레이블과 얼마나 일치하는지), 그리고 약법 학습 점수(벌점을 줄이는)를 통합하여 최대화하는 것입니다.

마지막으로, LangProp 주행 에이전트의 실제 작동 상황입니다.

<div class="content-ad"></div>

이제 LangProp 에이전트 운전을 관찰해 보세요!

훈련 중에 우리는 ChatGPT가 생성하는 초기 운전 정책이 매우 결함이 많다는 것을 보았습니다. 특히, 그것은 이전 속도를 그대로 복사하는 단순한 정책을 자주 학습합니다. 이것은 모방 학습 분야에서 알려진 인과 혼란 [2]이라는 현상입니다. 오프라인 데이터 집합에서 행동 복제만으로 훈련한다면, 이와 같은 단순하지만 단순한 정책들은 다른 복잡한 정책들보다 높은 점수를 받습니다. 이것이 정책이 온라인 롤아웃에서 잘 수행되도록 하기 위해 DAgger 및 강화 학습과 같은 기술을 사용해야 하는 이유입니다.

1 또는 2 번의 반복 후에, 모델은 이전 속도 복사를 중단하고 전진하기 시작하지만, 극도로 신중하거나 무모합니다. 즉, 가까이에 배우가 있어도 (충돌 코스가 아니더라도) 멈춥니다. 조금 더 반복한 후에, 모델은 앞 차량과의 거리를 유지하며 이 거리를 차량의 상대 속도에 기반하여 동적으로 계산하기 시작합니다. 또한 다른 배우 (예: 길을 사비거나 다니는 보행자)가 속도 및 위치 벡터를 살펴 차량과 충돌 코스에 있는지 예측합니다.

저희 논문에서의 실험에서는 LangProp 운전 에이전트가 이전에 구현된 많은 운전 에이전트들보다 성능이 우수함을 보여줍니다. PPO 전문가 에이전트 (Carla-Roach [3], TCP [4]) 및 연구자가 구현한 전문가 에이전트 (TransFuser [5], InterFuser [6], TF++ [7])와 비교하여 LangProp은 TF++을 제외하고 모든 전문가 에이전트를 성능 상으로 앞섰습니다. 모든 전문가 에이전트들은 GPT 3.5 훈련 차단일인 2021년 9월 이후에 발표되었으므로 이 결과는 놀라우면서도 흥미로운 것입니다!

<div class="content-ad"></div>

# 마무리 말씀

함께 시간을 보내줘서 감사합니다! 이 작업에서 우리는 주로 CARLA의 자율 주행에 LangProp을 응용해 보았지만, LangProp을 CartPole-v1의 전형적인 강화 학습 환경과 같은 더 일반적인 문제에 쉽게 적용할 수 있다는 것도 보여주었습니다. LangProp은 성능에 대한 피드백을 텍스트나 코드 형식으로 얻을 수 있는 환경이나 문제에서 가장 잘 동작하며, 모델에 단순한 숫자 점수 이상의 더 풍부한 의미 신호를 제공합니다.

데이터를 기반으로 소프트웨어를 반복적으로 개선하는 LangProp과 유사한 훈련의 끝없는 가능한 응용 분야가 있으며, 이 공간에서 무엇이 일어날지 기대됩니다!

만약 우리의 작업을 좋아하셨다면, 이를 기반으로 발전시키고 우리 논문을 인용해 주시기 바랍니다:

<div class="content-ad"></div>


@inproceedings{
ishida2024langprop,
title={LangProp: A code optimization framework using Large Language Models applied to driving},
author={Shu Ishida and Gianluca Corrado and George Fedoseev and Hudson Yeo and Lloyd Russell and Jamie Shotton and Joao F. Henriques and Anthony Hu},
booktitle={ICLR 2024 Workshop on Large Language Model (LLM) Agents},
year={2024},
url={https://openreview.net/forum?id=JQJJ9PkdYC}
}


# 참고문헌

[1] Stéphane Ross, Geoffrey Gordon, and Drew Bagnell. “A reduction of imitation learning and structured prediction to no-regret online learning.” In Proceedings of the fourteenth international conference on artificial intelligence and statistics, JMLR Workshop and Conference Proceedings, 2011.

[2] Pim De Haan, Dinesh Jayaraman, and Sergey Levine. “Causal confusion in imitation learning”. Advances in Neural Information Processing Systems, 2019.


<div class="content-ad"></div>

[3] Zhejun Zhang, Alexander Liniger, Dengxin Dai, Fisher Yu, and Luc Van Gool. “End-to-end urban driving by imitating a reinforcement learning coach.” In Proceedings of the IEEE/CVF international Conference on Computer Vision, pp. 15222–15232, 2021.

[4] Penghao Wu, Xiaosong Jia, Li Chen, Junchi Yan, Hongyang Li, and Yu Qiao. “Trajectory-guided control prediction for end-to-end autonomous driving: A simple yet strong baseline.” Advances in Neural Information Processing Systems, 35:6119–6132, 2022.

[5] Kashyap Chitta, Aditya Prakash, Bernhard Jaeger, Zehao Yu, Katrin Renz, and Andreas Geiger. “Transfuser: Imitation with transformer-based sensor fusion for autonomous driving.” IEEE Transactions on Pattern Analysis and Machine Intelligence, 2022.

[6] Hao Shao, Letian Wang, Ruobing Chen, Hongsheng Li, and Yu Liu. “Safety-enhanced autonomous driving using interpretable sensor fusion transformer.” In Conference on Robot Learning, pp. 726–737. PMLR, 2023.

<div class="content-ad"></div>

[7] Jaeger, Bernhard, Kashyap Chitta, 그리고 Andreas Geiger. “Hidden biases of end-to-end driving models.” Proceedings of the IEEE/CVF International Conference on Computer Vision. 2023.