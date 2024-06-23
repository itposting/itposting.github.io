---
title: "Fabric 완벽 마스터하기 실시간 주식 데이터 스트리밍 및 분석 방법"
description: ""
coverImage: "/assets/img/2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_0.png"
date: 2024-06-23 16:20
ogImage: 
  url: /assets/img/2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_0.png
tag: Tech
originalTitle: "Mastering Fabric: Real-Time Stock Data Streaming and Analysis"
link: "https://medium.com/@dataninsight/mastering-fabric-real-time-stock-data-streaming-and-analysis-ad72d23d011a"
---



![2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_0.png](/assets/img/2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_0.png)

실시간 주식 시장 데이터를 관리하고 분석하기 위해 Fabric 이벤트 스트림을 사용하세요. 시간, 심볼, 가격 및 거래량과 같은 필드를 포함하는 이 데이터는 실시간 이벤트를 시뮬레이션하고 KQL 데이터베이스를 사용하여 분석하는 데 사용됩니다.

## Fabrics에서 사용되는 구성 요소:

- Fabric Event Stream
- Azure Data Explorer (KQL Database)
- Power BI
- KQL Query


<div class="content-ad"></div>

![이미지](/assets/img/2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_1.png)

## 실시간 주식 데이터 설정 및 분석 단계

- 워크스페이스 생성:

1. Microsoft Fabric에 로그인: Microsoft Fabric에 로그인하고 Power BI를 선택합니다.
2. 워크스페이스 생성: 메뉴 바에서 Workspaces를 선택하고 자신이 원하는 이름으로 새 워크스페이스를 만들어 Fabric 용량(Trial, Premium, 또는 Fabric)이 있는지 확인하세요.

<div class="content-ad"></div>

2. 실시간 인텔리전스 기능 활성화: 파워 BI 포털의 왼쪽 하단에 있는 파워 BI 아이콘을 선택하고 실시간 인텔리전스 경험으로 전환하세요.

3. KQL 데이터베이스 생성:

- 이름을 선택하고 새 데이터베이스를 생성하세요.
- OneLake 활성화: 데이터베이스 세부 정보 패널에서 OneLake에서 사용 가능하도록 설정하세요.

![이미지](/assets/img/2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_2.png)

<div class="content-ad"></div>

4. 이벤트스트림 만들기: 리얼타임 인텔리전스 메뉴에서 이벤트스트림(미리보기)를 선택하고 이름을 지정하세요. Microsoft Fabric의 이벤트스트림은 코드를 필요로하지 않고 실시간 이벤트를 캡처하고 변환하여 다양한 대상으로 라우팅합니다.

5. 샘플 데이터 소스 추가:

- 이벤트스트림 캔버스에서 새 출처를 추가하고 샘플 데이터를 선택하세요.
- 샘플 데이터 소스의 이름을 지정하고 필요한 값으로 구성하세요.
- 구성을 적용하려면 이벤트스트림을 게시하세요.

![이미지](/assets/img/2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_3.png)

<div class="content-ad"></div>

<img src="/assets/img/2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_4.png" />

6. **KQL Database를 Eventstream 대상으로 설정하기**

- **대상 추가**: Eventstream 캔버스에서 대상 추가를 선택하고 KQL Database를 선택합니다.
- **대상 구성**: KQL Database에 대한 세부 정보를 입력하고 데이터 삽입 모드를 선택하고 대상의 이름을 지정한 후 구성을 저장합니다.

7. **이벤트 변환**: Eventstream 캔버스에서 그룹화와 같은 변환 이벤트를 추가하고 필요에 맞게 구성합니다. 해당 이벤트를 이벤트 스트림에 연결하고 변경 사항을 발행합니다.

<div class="content-ad"></div>

## KQL을 사용하여 데이터 분석하기

Kusto Query Language (KQL)은 KQL 데이터베이스에서 데이터를 조회하는 데 사용됩니다. 주식 데이터를 분석하는 몇 가지 예시 쿼리가 있습니다:

- 평균 매수-매도 스프레드
StockData_Table
| extend bidPrice = todouble(bidPrice), askPrice = todouble(askPrice)
| extend BidAskSpread = askPrice — bidPrice
| summarize AvgBidAskSpread = round(avg(BidAskSpread),2) by symbol
- 평균 거래량
StockData_Table
| extend volume = todouble(volume)
| summarize AvgVolume = round(avg(volume),2) by symbol
- 가격 변동률
StockData_Table
| extend lastSalePrice = todouble(lastSalePrice)
| order by symbol, ['time'] asc
| extend PrevPrice = prev(lastSalePrice, 1)
| where isnotnull(PrevPrice)
| extend PriceChangePercent = ((lastSalePrice — PrevPrice) / PrevPrice) * 100
| summarize AvgPriceChangePercent = round(avg(PriceChangePercent),2) by symbol
- 시장 점유율 백분율
StockData_Table
| extend marketPercent = todouble(marketPercent)
| summarize AvgMarketSharePercent = avg(marketPercent) by symbol

<img src="/assets/img/2024-06-23-MasteringFabricReal-TimeStockDataStreamingandAnalysis_5.png" />

<div class="content-ad"></div>

## 시각화를 위한 Power BI 활용

- KQL 데이터베이스에 연결: Power BI를 사용하여 KQL 데이터베이스에 연결하고 분석된 데이터를 기반으로 시각화를 생성하세요.
- 대시보드 생성: 평균 입찰-요청 스프레드, 평균 거래량, 시장 점유율 등 핵심 성과 지표(KPI)를 시각화하기 위한 대화형 대시보드를 구성하세요.

본 프로젝트는 Microsoft Fabric의 Eventstream을 활용하여 실시간 데이터 스트리밍, 분석, 시각화를 실현하며 KQL 및 Power BI를 사용하여 주식 시장 데이터에 대한 귀중한 통찰력을 제공합니다.