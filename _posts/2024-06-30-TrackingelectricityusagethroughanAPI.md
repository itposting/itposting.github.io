---
title: "API로 전기 사용량 추적하는 방법"
description: ""
coverImage: "/assets/img/2024-06-30-TrackingelectricityusagethroughanAPI_0.png"
date: 2024-06-30 19:01
ogImage: 
  url: /assets/img/2024-06-30-TrackingelectricityusagethroughanAPI_0.png
tag: Tech
originalTitle: "Tracking electricity usage through an API"
link: "https://medium.com/@jack_57343/tracking-electricity-usage-via-an-api-d5a8b8d458fd"
---


TL;DR: 코드로 건너뛰려면 여기를 클릭하세요.

몇 년 전, 에너지 위기 기간 동안 전기 사용량을 보고하기 위해 추적기를 만들어서 내 사용 습관을 더 잘 이해하고 낭비를 줄일 수 있기를 희망했습니다. 당시 공급업체인 EON이 설치한 스마트 미터가 정확한 통계를 IHD(인 홈 디바이스)로 보내지만 그 정보들은 항상 켜져 있는 디스플레이 안으로 갇혀 있었어요. 이 정도만으로는 충분하지 않았죠.

영국 전체 주택에 스마트 미터를 설치하는 노력은 절대 영향력을 제로화하는 목표의 일환입니다. 스마트 미터는 소비자들이 사용량을 더 잘 인식하도록 돕고, 필요 없는 것을 끄는 것을 장려하여 전력(그리고 돈!)을 절약할 수 있도록 돕습니다. 보는 것과 측정하는 것을 통제하는 것이 훨씬 쉽습니다. 데이터 통신 회사(DCC)의 등장입니다.

요약하면, DCC는 스마트 미터를 에너지 공급업체에 연결하여 특정 간격(일반적으로 매 30분마다)에 사용된 에너지 양을 추적합니다. 이 데이터는 대규모 에너지 공급업체에게 제공되지만 중개업체들을 통해 광범위하게 공개되며, 그 가운데 하나인 glowmarkt가 있습니다.

<div class="content-ad"></div>

글로마켓의 Bright 앱을 사용하면 DCC에 연결하여 미터 데이터를 다운로드할 수 있습니다. 이 과정은 앱을 다운로드하고 스마트 미터 일련 번호와 소유권 증명을 제공하는 것만큼 쉽습니다 (이 데이터를 아무나에게 제공할 수는 없습니다).

등록은 몇 영업일이 걸릴 수 있지만, 등록되면 앱을 통해 미터가 캡처한 세부 정보를 볼 수 있습니다(보통 30분마다). 이것은 정말 좋습니다. 이제 우리는 IHD에서 볼 수 있는 것과 동일한 데이터에 폰에서 액세스할 수 있습니다. 한 걸음 더 나아가서 API에서 직접 원시 데이터를 가져올 수도 있습니다.

# Bright API

여기에 Postman 컬렉션이 있습니다. 아래에서 Postman을 통한 호출 방법과 타입스크립트 애플리케이션 일부를 자동화하는 방법을 보여드리겠습니다.

<div class="content-ad"></div>

## 인증하기

먼저 정적 bright 애플리케이션 id를 사용하여 사용자 이름/비밀번호로 인증하려면 https://api.glowmarkt.com/api/v0-1/auth 로 POST를 통해 인증합니다.

![이미지](/assets/img/2024-06-30-TrackingelectricityusagethroughanAPI_0.png)

```js
async function getLoginToken() {
  const body = {
    "username": process.env.BRIGHT_USERNAME,
    "password": process.env.BRIGHT_PASSWORD,
    "applicationId": "b0f1b774-a586-4f72-9edd-27ead8aa7a8d"
  }

  const res = await fetch('https://api.glowmarkt.com/api/v0-1/auth', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })

  if (res.status !== 200) {
    throw new Error(`인증에서 200을 기대했으나 ${res.status}을 받음`)
  }

  const json = await res.json()
  return json.token
}
```

<div class="content-ad"></div>

## 가상 엔티티 가져오기

접근 토큰을 사용하여 가상 엔티티를 요청하려면 https://api.glowmarkt.com/api/v0-1/virtualentity/ 로 GET을 보내세요.

![이미지](/assets/img/2024-06-30-TrackingelectricityusagethroughanAPI_1.png)

```js
async function getVirtualEntities(token: string) {
  const res = await fetch('https://api.glowmarkt.com/api/v0-1/virtualentity/', {
    headers: {
      token,
      applicationId: 'b0f1b774-a586-4f72-9edd-27ead8aa7a8d'
    }
  })

  if (res.status !== 200) {
    throw new Error(`GET VEs에서 200을 기대했지만, ${res.status}를 받았습니다`)
  }

  const json: VirtualEntitiesResponse = await res.json()
  return json
}
```

<div class="content-ad"></div>

이 응답에서는 각 연료 유형을 나타내는 여러 Virtual Entities를 볼 수 있습니다(예: 가스 및 전기), 그리고 태양열판이나 배터리 등이 있는 경우 수출 미터가 포함될 수도 있습니다. 이 예제에서는 "전기 소비"에 관심이 있습니다. resourceId를 가져와서 소비를 조회해 보겠습니다.

## 소비 조회

쿼리 매개변수를 사용하여 세밀도와 시간 범위를 정의한 상태에서 https://api.glowmarkt.com/api/v0-1/resource/`id`/readings 로 GET을 수행하십시오. 예를 들어, 2023년 1월 1일부터 2023년 1월 7일까지 30분 간격으로 조회하려면 다음과 같이 호출하면 됩니다.

```js
GET https://api.glowmarkt.com/api/v0-1/resource/447c88f4-c99d-44c4-9f1d-03a767b084a6/readings?period=PT30M&function=sum&from=2023-01-01T00:00:00&to=2023-01-07T23:59:59
```

<div class="content-ad"></div>

```js
async function getThirtyMinuteIntervalUsage(token: string, resourceId: string, from: Date, to: Date) {
  const fromStr = dateToApiFormat(from)
  const toStr = dateToApiFormat(to)
  const res = await fetch(`https://api.glowmarkt.com/api/v0-1/resource/${resourceId}/readings?period=PT30M&function=sum&from=${fromStr}&to=${toStr}`, {
    headers: {
      token,
      applicationId: 'b0f1b774-a586-4f72-9edd-27ead8aa7a8d'
    }
  })

  if (res.status !== 200) {
    throw new Error(`Expected 200 from GET Readings. Got ${res.status}`)
  }

  return await res.json() as ResourceReadingsResponse
}

function dateToApiFormat(date: Date) {
  const pad = (num: number) => num.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

async function getCompleteHistoryReadings(token: string, resourceId: string, earliestTime = 0) {
  const startTo = new Date(Date.now() + (1000 * 60))
  const readingsByTime: Record<number, number> = {}

  let i = 0
  while (true) {
    const to = new Date(startTo.getTime() - ((MILLI_IN_DAY * 10) * i++))
    const from = new Date(to.getTime() - (MILLI_IN_DAY * 10) - 1)
    const response = await getThirtyMinuteIntervalUsage(token, resourceId, from, to)

    // If ALL readings are 0 then either we haven't used anything for 10 days or we're out of data
    if (!response.data.some(o => o[1] > 0)) {
      return readingsByTime
    }

    // Should already be sorted in response - but for sanity sake
    response.data.sort((a, b) => a[0] > b[0] ? -1 : 1)

    for (const [epoch, kwh] of response.data) {
      readingsByTime[epoch] = kwh

      if (epoch < earliestTime) {
        return readingsByTime
      }
    }
  }
}

// Tie it altogether
export async function getMeterReadings(since?: number) {
  const token = await getLoginToken()
  const entities = await getVirtualEntities(token)
  const resource = entities[1].resources.find(o => o.name === "electricity consumption")

  if (!resource) {
    throw new Error('Failed to find electricity consumption resource')
  }

  return await getCompleteHistoryReadings(token, resource?.resourceId, since ? (since / 1000) || 0 : 0)
}
```

We get an array of arrays representing the start time of that period and its usage. In the above screenshot, I used 0 kWh between 12am — 1am and then 0.211 kWh between 1:30am — 2:00am. In the TypeScript code, we are converting this array of arrays to a key/value object by time.

## Using this data


<div class="content-ad"></div>

저는 Discord에서의 일일 사용량을 멋지게 포맷된 그래프로 보고하고 있어요.

![이미지](/assets/img/2024-06-30-TrackingelectricityusagethroughanAPI_3.png)

저는 Octopus의 Agile 요금제를 사용하고 있어요. 이 요금제는 30분마다 변경되는 가격을 가지고 있어요. 이 가격을 30분 단위 사용량에 매핑하여 하루 내내 전기 요금이 얼마나 드는지 정확하게 파악할 수 있어요. 이를 통해 Agile 요금제가 가격 상한선보다 돈을 절약하는지 추적하고 평가하고 있어요. 에너지 위기 때는 가격 상한선이 33펜스였던 때가 참으로 그랬지만 시간이 지남에 따라 그렇지 않아지고 있어요. 여기서 봇이 얼마나 절약하거나 손해를 봤는지, 그리고 예상 월간 비용을 알려줘요.

![이미지](/assets/img/2024-06-30-TrackingelectricityusagethroughanAPI_4.png)

<div class="content-ad"></div>

# 결론

DCC를 통해 데이터에 쉽게 접근할 수 있어서 투명성이 증대되고 소비자가 에너지 사용을 이해하고 제어하는데 더 많은 권한을 부여받습니다. 아마도 여러분에게 자신의 데이터를 얻는 것이 얼마나 쉬운지 보여줬을 텐데요. 사용 가능한 데이터로 무엇이 더 가능한지에 대해 많이 할 수 있습니다. 향후 포스트에서 이에 대해 더 탐구할 예정입니다. 이제 멋진 것을 만들러 가세요!