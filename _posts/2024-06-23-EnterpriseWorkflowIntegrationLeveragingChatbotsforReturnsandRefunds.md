---
title: "반품 및 환불 처리를 위한 챗봇 활용 엔터프라이즈 워크플로우 통합 방법"
description: ""
coverImage: "/assets/img/2024-06-23-EnterpriseWorkflowIntegrationLeveragingChatbotsforReturnsandRefunds_0.png"
date: 2024-06-23 19:23
ogImage: 
  url: /assets/img/2024-06-23-EnterpriseWorkflowIntegrationLeveragingChatbotsforReturnsandRefunds_0.png
tag: Tech
originalTitle: "Enterprise Workflow Integration: Leveraging Chatbots for Returns and Refunds"
link: "https://medium.com/gptalk/enterprise-workflow-integration-leveraging-chatbots-for-returns-and-refunds-47bf45fce2ed"
---


<img src="/assets/img/2024-06-23-엔터프라이즈워크플로우통합챗봇을활용한반품및환불.png" />

고객 서비스 랜드스케이프가 급격히 변화하고 있습니다. 기업들은 영업을 최적화하고 고객 경험을 높이기 위해 AI 솔루션을 채택하고 있습니다. 기본 챗봇은 FAQ에 대한 답변으로 흔히 사용되고 있지만, 반품이나 환불 처리와 같이 복잡한 시나리오에 대해 어려움을 겪는 경우가 많습니다. 이러한 복잡한 상황에서 가장 큰 수익률을 얻을 수 있는 영역입니다.

# 기본 챗봇 응용

LLM 챗봇은 대부분 고객 서비스에 사용되며, 기본 지원을 제공하고 자주 묻는 질문에 답변합니다. 이러한 챗봇은 일반적으로 응답 생성을 위해 소스 문서나 HTML 페이지의 라이브러리에 의존합니다. 이 문서들은 청크(chunk) 단위로 분리되어 벡터 저장소(Vector Store)에 저장됩니다. 사용자가 질문을 하면 벡터 저장소에서 유사도 검색이 수행되어 관련 문서 청크가 검색되고, 이후 OpenAI와 같은 LLM으로 응답을 생성하기 위해 전송됩니다.

<div class="content-ad"></div>

![image](/assets/img/2024-06-23-EnterpriseWorkflowIntegrationLeveragingChatbotsforReturnsandRefunds_1.png)

챗봇이 도움이 될 수는 있지만, 고객 서비스 자동화의 진정한 가치는 고객 지원에서 정례적으로 발생하는 복잡한 상황을 해결할 수 있는 능력에 있습니다.

# 챗봇을 활용하여 복잡한 워크플로우 문제 해결하기

자연어 처리 및 생성 기술의 놀라운 발전에도 불구하고, LLM을 기반으로 한 챗봇은 여전히 제품 반품 또는 환불과 같이 복잡한 상황에서 특히 고객이 만족스러운 경험을 얻는 데 어려움을 겪고 있습니다. 왜 그런지 살펴보겠습니다:

<div class="content-ad"></div>

<table>
<tr>
<th>Issue</th>
<th>Description</th>
</tr>
<tr>
<td>Contextual Blindspots</td>
<td>LLMs (Large Language Models) may sound human-like, but often miss important context. For instance, a chatbot might not realize a prior promise for faster shipping, causing frustration.</td>
</tr>
<tr>
<td>Isolated Operations</td>
<td>Traditional LLM chatbots are often disconnected from essential systems like order management or knowledge bases. This means a chatbot may not access specific booking details when a customer wants to change a flight.</td>
</tr>
<tr>
<td>Inconsistent Service</td>
<td>LLMs can provide conflicting responses, especially in complex situations with strict policies. This can lead to confusion and distrust, like differing information on warranty policies.</td>
</tr>
<tr>
<td>Language Barriers</td>
<td>Most LLM chatbots support only one language, limiting help for a global customer base. For example, an English-only chatbot may not effectively assist Spanish-speaking customers.</td>
</tr>
</table>

# Why Processing Refunds can be Challenging for AI (Even the Super Smart Ones!)

Even highly intelligent AI systems face difficulties when it comes to handling refund processes. Here are some essential capabilities that chatbots need to possess for successfully managing complex tasks like refunds:

<div class="content-ad"></div>

- 많은 규칙을 따라야 합니다: 온라인으로 셔츠를 주문했지만 잘못된 사이즈로 도착했어요. 환불 정책에 따르면 구매 후 30일 이내에 원래 영수증이 있는 새 제품만 환불을 받을 수 있을 수도 있습니다. AI는 이 모든 규칙과 함께 주문 세부 정보 (날짜, 사이즈 등)와 교환 사유 (잘못된 사이즈)를 이해해야 올바른 결정을 내릴 수 있어야 해요. 이 모든 것을 동시에 이해하는 것은 수 많은 퍼즐 조각을 맞추는 것과 같아요!
- 당신의 말을 이해하기: 교환에 관해 AI에게 “이 셔츠는 너무 커!” 라고 메시지를 보낼 수도 있어요. AI의 자연어 처리 능력은 당신이 환불 정책에 정확한 단어를 사용하지 않아도 (예: “잘못된 사이즈”) 당신이 무슨 의미인지 파악하는 데 능숙해야 해요. 이는 용어가 많은 문자 메시지를 번역하는 것과 같아요 — AI는 당신의 말 뒤에 감추어진 의도를 이해해야 해요.
- 다른 시스템과 대화하기: 환불을 처리하려면 AI가 여러 컴퓨터 프로그램을 확인해야 할 수도 있어요. 세부 정보를 확인하기 위해 주문 내역을 확인해야 하거나 적용 가능한 규칙을 확인하기 위해 환불 정책 데이터베이스를 참고하거나 환불을 시작하기 위해 금융 시스템에 연결해야 할 수도 있어요. 이 모든 것을 처리해야 하는 것은 여러 공을 질러야 하는 것과 같아요 — AI는 이러한 다양한 시스템과의 소통을 처리하여 환불을 올바르게 처리해야 해요.
- 상황에 적응하기: 환불 처리를 위한 AI 시스템은 “왜 환불을 요청하시나요?” 나 “제품이 손상되었나요, 아니면 생각이 바뀌었나요?”와 같이 명확히 질문하여 상황에 적응해야 해요. 세부 사항을 확인한 후 자신의 방식으로 접근을 조정해야 해요. 하자가 있는 경우, 사진을 요청하고 전액 환불을 처리할 수 있어야 해요. 생각이 바뀐 경우, 반품 안내나 재설치 수수료가 있는 라벨을 제공하거나 당신에게 가장 잘 맞는 옵션을 제안하며 교환이나 상품권을 제공할 수 있어야 해요.

<div class="content-ad"></div>

많은 기업들이 처음에는 기존 문서에서 FAQ를 처리하기 위해 챗봇을 도입하지만, 실제 기회는 챗봇이 복잡한 업무 흐름을 관리할 수 있는 능력에 있습니다. 이러한 시나리오는 챗봇이 특정 정책을 조회하고 내부 시스템과 상호 작용하며 명확한 질문을 하고 다양한 상황에 적응하며 필요할 때 실시간 대화 대상에게 매끄럽게 연결되어야 합니다. 이것이 다음 12개월 동안 가장 중요한 챗봇 혁신이 일어날 곳이며, 기업에 가장 높은 ROI를 제공할 것입니다.