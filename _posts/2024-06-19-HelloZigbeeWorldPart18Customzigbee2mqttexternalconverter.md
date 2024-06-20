---
title: "안녕하세요, 지그비 세계, 18부 - 사용자 정의 zigbee2mqtt 외부 변환기"
description: ""
coverImage: "/assets/img/2024-06-19-HelloZigbeeWorldPart18Customzigbee2mqttexternalconverter_0.png"
date: 2024-06-19 17:08
ogImage: 
  url: /assets/img/2024-06-19-HelloZigbeeWorldPart18Customzigbee2mqttexternalconverter_0.png
tag: Tech
originalTitle: "Hello Zigbee World, Part 18 — Custom zigbee2mqtt external converter"
link: "https://medium.com/@omaslyuchenko/hello-zigbee-world-part-18-custom-zigbee2mqtt-external-converter-1a666db52d44"
---


이전 두 편의 글에서는 스마트 스위치에 여러 작업을 지원하는 기능을 구현하여, 멀티스테이트 입력 클러스터를 통해 단일/더블/트리플/롱 프레스를 처리하고 보고할 수 있게 되었습니다. 또한 On/Off 스위치 설정 클러스터의 사용자 정의 확장을 통해 장치의 설정을 제어하는 기능도 구현했습니다. 이러한 추가 기능으로 사용자들은 Zigbee 시설을 이용하여 런타임에서 장치를 구성할 수 있게 됩니다.

그러나 한 가지 문제가 있습니다: 우리는 장치 측면에서 이를 구현했지만, zigbee2mqtt와 같은 다른 시스템들은 이러한 추가 기능과 어떻게 작동해야 하는지 알지 못합니다. 이 글에서는 우리의 장치를 지원하기 위해 zigbee2mqtt용의 외부 컨버터 — 특별한 플러그인을 작성하는 방법을 상세히 설명하고 있습니다.

일반적으로, 나의 코드는 이전 글에서 만든 코드를 기반으로 합니다. 개발 보드로는 NXP JN5169 마이크로컨트롤러를 기반으로 한 EBYTE E75-2G4M10S 모듈을 사용할 것입니다. 이 글은 Hello Zigbee 시리즈에 훌륭한 추가 내용이 되며, 처음부터 Zigbee 장치 펌웨어를 구축하는 방법을 설명하고 있습니다.

<div class="content-ad"></div>

# Zigbee2mqtt 외부 컨버터

안타깝게도 외부 컨버터에 대한 문서화가 매우 미흡하며, 정확히 함수가 무엇을 해야 하는지에 대한 좋은 설명을 찾지 못했습니다. 조금 모호한 예제 몇 개가 있지만, 이에 대해 많은 의문이 듭니다.

우리의 사용자 정의 On/Off Switch Configuration Cluster를 지원하기로 시작합시다. 저는 직접 `poke` 메서드를 사용하여 내 컨버터를 작성해야 했고, 그들이 어떻게 동작해야 하는지 파악하기 위해 수십 개의 기존 컨버터를 살펴보았습니다. 제가 제작 중일 때 컨버터에 대해 공부한 내용은 다음과 같습니다.

모든 컨버터는 `imports`로 시작합니다.

<div class="content-ad"></div>

```js
const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const e = exposes.presets;
const ea = exposes.access;
```

우리가 맞춤 필드를 여러 개 추가했기 때문에, 그들과 관련된 유형 및 데이터 구조를 설명해야 합니다. Herdsman converters 프로젝트에서 정의된 모든 가능한 유형이 있습니다. 불행하게도, TypeScript에서 구조체를 JavaScript 코드로 가져오는 방법을 찾지 못해 필요한 유형의 값을 중복해서 작성해야 했습니다.

```js
const DataType = {
    uint16: 0x21,
    enum8: 0x30,
}
```

새로운 속성에 대한 열거형 값들을 정의해봅시다. 값들의 순서는 펌웨어 코드에 설명된 것과 동일하며, 변환기 코드는 목록에서 위치 번호를 해당 값과 일치시키기만 하면 됩니다.

<div class="content-ad"></div>

```js
const switchTypeValues = ['toggle', 'momentary', 'multifunction'];
const switchActionValues = ['onOff', 'offOn', 'toggle'];
const relayModeValues = ['unlinked', 'front', 'single', 'double', 'tripple', 'long'];
```

제조업체별 속성을 참조할 때에는 속성 식별자 뿐만 아니라 제조업체 코드도 명시해야 합니다. 그렇지 않으면 ZCL 펌웨어 코드에서 요청을 거부합니다.

```js
const manufacturerOptions = {
    jennic: {manufacturerCode: 0x1037}
}
```

이제 z2m 웹 양식에 해당 필드를 등록해야 합니다. 이러한 필드는 디바이스의 Exposes 탭에 표시됩니다.

<div class="content-ad"></div>

```js
function genSwitchEndpoint(epName) {
   return [
       e.switch().withEndpoint(epName),
       exposes.enum('switch_mode', ea.ALL, switchModeValues).withEndpoint(epName),
       exposes.enum('switch_actions', ea.ALL, switchActionValues).withEndpoint(epName),
       exposes.enum('relay_mode', ea.ALL, relayModeValues).withEndpoint(epName),
       exposes.numeric('max_pause', ea.ALL).withEndpoint(epName),
       exposes.numeric('min_long_press', ea.ALL).withEndpoint(epName),
   ]
}

function genSwitchEndpoints(endpoinsCount) {
   let features = [];

   for (let i = 1; i <= endpoinsCount; i++) {
       const epName = `button_${i}`;
       features.push(...genSwitchEndpoint(epName));
   }

   return features;
}
```

주어진 엔드포인트 수에 대해 첫 번째 함수는 스위치 위젯 (e.switch())과 구성 필드 시리즈를 생성합니다. 결과물은 다음과 같습니다.

<img src="/assets/img/2024-06-19-HelloZigbeeWorldPart18Customzigbee2mqttexternalconverter_1.png" />

2~3개 값으로 이루어진 열거형 필드는 버튼으로, 다른 필드(relay_mode)는 드롭다운 목록으로 변환되었습니다. 마지막 두 숫자 필드는 증가/감소 화살표가 있는 입력 필드입니다.

<div class="content-ad"></div>

이제 이에 생명을 불어넣고, 3개의 변환 함수를 작성해야 합니다. 이 3개의 함수는 toZigbee 및 fromZigbee라는 코드명으로 구성되어야 합니다. 정확히 무슨 의미인지는 아래에서 설명하겠습니다.

양식을 변경할 때 zigbee2mqtt는 toZigbee 구조에서 convertSet() 함수를 호출합니다. key 필드는 또한 우리의 컨버터가 처리할 수있는 매개변수 목록을 지정합니다.

```js
const toZigbee_OnOffSwitchCfg = {
   key: ['switch_mode', 'switch_actions', 'relay_mode', 'max_pause', 'min_long_press'],

   convertSet: async (entity, key, value, meta) => {
       let payload = {};
       let newValue = value;

       switch(key) {
           case 'switch_mode':
               newValue = switchModeValues.indexOf(value);
               payload = {65280: {'value': newValue, 'type': DataType.enum8};
               await entity.write('genOnOffSwitchCfg', payload, manufacturerOptions.jennic);
               break;

           case 'switch_actions':
               newValue = switchActionValues.indexOf(value);
               payload = {switchActions: newValue};
               await entity.write('genOnOffSwitchCfg', payload);
               break;

           case 'relay_mode':
               newValue = relayModeValues.indexOf(value);
               payload = {65281: {'value': newValue, 'type': DataType.enum8};
               await entity.write('genOnOffSwitchCfg', payload, manufacturerOptions.jennic);
               break;

           case 'max_pause':
               payload = {65282: {'value': value, 'type': DataType.uint16};
               await entity.write('genOnOffSwitchCfg', payload, manufacturerOptions.jennic);
               break;

           case 'min_long_press':
               payload = {65283: {'value': value, 'type': DataType.uint16};
               await entity.write('genOnOffSwitchCfg', payload, manufacturerOptions.jennic);
               break;

           default:
               break;
       }

       result = {state: {[key]: value}
       return result;
   },
```

toZigbee_OnOffSwitchCfg::convertSet() 함수는 텍스트 속성 이름과 설정할 속성 값들을 받습니다. 이 함수의 목표는 이를 네트워크로 전송할 수 있는 구조로 변환하는 것입니다. 표준 속성 (예: switch_actions)의 경우, 단순히 속성 키-값 쌍이 될 것이지만, 값은 숫자로 변환됩니다. herdsman 변환기 코드는 표준 속성 및 이들의 형식, 네트워크로 전달하는 방법 등을 알고 있습니다. 비표준 속성 (예: relay_mode)의 경우, 세 개의 값으로 변환해야 합니다:

<div class="content-ad"></div>

- 숫자 속성 식별자 (10진 형식으로 설정해야 함 — 예: 65280)
- 속성 유형 (유형 식별자)
- 값 (열거형의 경우 값 색인)

이러한 값들은 낮은 수준의 Zigbee 메시지로 묶여 네트워크를 통해 전송됩니다. 엔티티 객체는 읽기 및 쓰기 명령이 실행되는 엔드포인트입니다. 비표준 속성을 위해 제조사별 코드를 지정하는 것이 필수적입니다 (manufacturerOptions.jennic 사용).

함수는 속성의 새로운 상태를 반환해야 합니다. 그 결과는 꼼꼼한 종류의 구조로 구성되어야 하며, 그렇지 않으면 웹 양식의 버튼 값이 변경되지 않습니다.

새로운 속성 값을 보내는 스니퍼는 다음과 같이 보일 것입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HelloZigbeeWorldPart18Customzigbee2mqttexternalconverter_2.png" />

디바이스 측에서는 ZCL 구현이 들어오는 요청을 파싱하고, 자동으로 새 값을 해당 필드에 설정합니다.

```js
ZPS_EVENT_APS_DATA_INDICATION: SrcEP=1 DstEP=2 SrcAddr=0000 Cluster=0007 () Status=0
ZCL Write Attribute: Clustter 0007 Attrib ff00
ZCL Endpoint Callback: Write attributes completed
ZPS_EVENT_APS_DATA_CONFIRM: SrcEP=2 DstEP=1 DstAddr=0000 Status=0
ZPS_EVENT_APS_DATA_ACK: SrcEP=1 DrcEP=2 DstAddr=0000 Profile=0104 Cluster=0007 ()
```

속성을 읽는 것이 더 어려워 보입니다. 기본적으로 zigbee2mqtt UI는 현재 속성 값을 표시하지 않습니다. 속성 중 하나 옆의 "업데이트" 버튼을 클릭하면 toZigbeeConverter::convertGet() 함수가 호출됩니다.

<div class="content-ad"></div>

처음에는 이름인 toZigbee::converterGet()에 매우 혼동을 겪었어요. 왜 fromzigbee가 아니지? 네트워크에서 데이터를 받는 거 아니면서도 말이죠? 그런데 코드를 더 정확하게 살펴보니까 더 명확해졌어요: toZigbee 구성 요소는 (읽기 요청이더라도) 네트워크로 요청을 준비하는 역할을 담당하고 있어요. 장치는 나중에 읽기 속성 응답 메시지를 포함한 읽기 값이 들어있는 응답을 보내줄 거예요. 그럼 fromZigbee 구성 요소는 네트워크로부터 도착한 내용을 구문 분석하게 됩니다 (하지만 이에 대해서는 나중에 더 자세히 이야기할게요).

대부분의 변환기 구현은 한 번에 모든 속성을 가져오기 위해 일괄 요청을 사용해요 - Zigbee 사양이 이를 허용하기 때문이죠. 안타깝게도, 표준 속성('switchActions')과 제조사별 속성을 사용하고 있기 때문에 이들을 한 번에 가져오기가 불가능해요. 따라서 제 구현은 한 번에 하나의 속성을 가져올 거에요. 물론, 표준이 아닌 속성을 읽는 것은 제조사 코드가 필요할 거에요.

스니퍼에서 읽기 요청이 어떻게 보이는지 살펴보세요.

<div class="content-ad"></div>

이것이 테이블 태그이며, 이것이 답변입니다.


![이미지](/assets/img/2024-06-19-HelloZigbeeWorldPart18Customzigbee2mqttexternalconverter_4.png)


단말기에서 패킷을 수신한 코디네이터는 fromZigbee 구성 요소가 요청의 구문 분석을 수행합니다.

<div class="content-ad"></div>

```js
const getKey = (object, value) => {
    for (const key in object) {
        if (object[key] == value) return key;
    }
};

const fromZigbee_OnOffSwitchCfg = {
   cluster: 'genOnOffSwitchCfg',
   type: ['attributeReport', 'readResponse'],

   convert: (model, msg, publish, options, meta) => {

       const ep_name = getKey(model.endpoint(msg.device), msg.endpoint.ID);
       const result = {};

       // switch type
       if(msg.data.hasOwnProperty('65280')) {
           result[`switch_mode_${ep_name}`] = switchModeValues[msg.data['65280']];
       }

       // switch action
       if(msg.data.hasOwnProperty('switchActions')) { // use standard 'switchActions' attribute identifier
           result[`switch_actions_${ep_name}`] = switchActionValues[msg.data['switchActions']];
       }

       // relay mode
       if(msg.data.hasOwnProperty('65281')) {
           result[`relay_mode_${ep_name}`] = relayModeValues[msg.data['65281']];
       }


       // Maximum pause between button clicks in a multiclick
       if(msg.data.hasOwnProperty('65282')) {
           result[`max_pause_${ep_name}`] = msg.data['65282'];
       }

       // Minimal duration for the long press
       if(msg.data.hasOwnProperty('65283')) {
           result[`min_long_press_${ep_name}`] = msg.data['65283'];
       }

       return result;
   },
}
```

이 함수는 해당 보고서에서 속성 값들을 파싱하고, 이를 Z2M 구조로 `attribute_name`_`endpoint_name` 레코드로 분해하려고 노력합니다.

거의 다 끝났어요. 마지막 구조 하나만 더 남았는데, 이것은 모든 것을 함께 모을 것입니다.

```js
const device = {
    zigbeeModel: ['Hello Zigbee Switch'],
    model: 'Hello Zigbee Switch',
    vendor: 'NXP',
    description: 'Hello Zigbee Switch',
    fromZigbee: [fz.on_off, fromZigbee_OnOffSwitchCfg],
    toZigbee: [tz.on_off, toZigbee_OnOffSwitchCfg],
    exposes: genEndpoints(2),
    configure: async (device, coordinatorEndpoint, logger) => {
        device.endpoints.forEach(async (ep) => {
            await ep.read('genOnOff', ['onOff']);
            await ep.read('genOnOffSwitchCfg', ['switchActions']);
            await ep.read('genOnOffSwitchCfg', [65280, 65281, 65282, 65283], manufacturerOptions.jennic);
        });
    },
    endpoint: (device) => {
        return {button_1: 2, button_2: 3};
    },
};

module.exports = device;
```

<div class="content-ad"></div>

이 코드는 새로운 장치를 등록하고 해당 장치에 대한 컨버터를 등록합니다. On/Off 기능에는 표준 fz/tz.on_off 컨버터가 사용되며, 우리의 함수인 to/fromZigbee_OnOffSwitchCfg가 스위치 구성을 처리합니다.

이 장치는 이미 2개의 스위치 엔드포인트를 지원하므로, 컨버터는 2개의 설정 세트를 등록합니다. 또한, 기본 채널이 endpoint #1에 있고, 스위치 엔드포인트는 endpoint #2부터 시작한다는 점을 기억하십시오. 모든 것이 올바르게 보여지고 작동되도록 endpoint-to-buttons 재번호 매핑을 추가해야 했습니다.

또한 configure() 함수를 강조하고 싶습니다. Z2M을 시작할 때는 스위치의 현재 상태나 설정 값이 알려져 있지 않습니다 — 설정 섹션의 모든 필드는 비어 있을 것입니다. 제가 연구한 대부분의 컨버터는 속성 보고를 설정하며, 장치는 예를 들어 1분마다 상태와 속성을 보고합니다. 따라서 일부 장치는 시작 시 값이 즉시 표시되지 않지만 나중에 값이 나타납니다. 이는 온도 센서와 같은 장치에 적합한 옵션입니다. 저의 컨버터 버전에서는 시작 시에 실제 값을 간단히 읽기로 결정했습니다.

마지막 단계는 zigbee2mqtt에서 컨버터를 등록하는 것입니다. configuration.yaml에 다음 라인을 추가하고 Z2M을 다시 시작하면 됩니다.

<div class="content-ad"></div>

```yaml
external_converters:
  - myswitch.js
```

장치가 가입할 때, zigbee2mqtt는 장치 이름을 요청하고 해당하는 컨버터를 사용할 것입니다.

# 다중 액션 지원

기억하시다시피, 우리는 장치에 다중 입력 클러스터를 추가하여 단일/이중/삼중/긴 눌림을 보고할 수 있도록 했습니다. 이러한 이벤트들은 속성 변경 보고서로 제공됩니다. 하지만 이제는 Z2M이 이러한 보고서를 이해하고 적절한 액션을 생성할 수 있도록 가르쳐 주어야 합니다. 이를 위해 fromZigbee 컨버터를 또 추가해보죠. 이 클러스터에 뭔가를 장치에 쓰지 않을 것이므로 toZigbee 컨버터를 추가할 필요는 없습니다.

<div class="content-ad"></div>

```js
const fromZigbee_MultistateInput = {
   cluster: 'genMultistateInput',
   type: ['attributeReport', 'readResponse'],

   convert: (model, msg, publish, options, meta) => {
       const actionLookup = {0: 'release', 1: 'single', 2: 'double', 3: 'tripple', 255: 'hold'};
       const value = msg.data['presentValue'];
       const action = actionLookup[value];

       const result = {action: utils.postfixWithEndpointName(action, msg, model)};
       return result;
   },
}
```

이 컨버터는 ptvo_multistate_action 컨버터에서 영감을 받았습니다. presentValue 클러스터 속성을 간단히 추출하여 해당 작업 텍스트로 변환합니다.

이 컨버터는 장치가 생성할 수 있는 작업도 광고할 수 있어서 Home Assistant와 같은 다른 시스템이 준비할 수 있습니다.

```js
function genSwitchActions(endpoinsCount) {
   let actions = [];

   for (let i = 1; i <= endpoinsCount; i++) {
       const epName = `button_${i}`;
       actions.push(... ['single', 'double', 'triple', 'hold', 'release'].map(action => action + "_" + epName));
   }

   return actions;
}

...

const device = {
...
   fromZigbee: [fz.on_off, fromZigbee_OnOffSwitchCfg, fromZigbee_MultistateInput],
...
   exposes: [
       e.action(genSwitchActions(2)),
       ...genSwitchEndpoints(2)
   ],
...
```

<div class="content-ad"></div>

제가 원했던 것은 각 엔드포인트에서의 작업이 나머지 엔드포인트 정보와 함께 선언되기를 했지만(zigbee2mqtt 아키텍처는 이를 허용하지 않습니다), 이를 위한 genSwitchEndpoint() 함수에서 정의할 수 없습니다. 모든 작업은 exposes 필드에서 e.action() 함수를 사용하여 한 번만 정의해야 합니다(여기에 설명이 나와 있습니다).

자, 이제 버튼을 눌러서 zigbee2mqtt 쪽에서 어떻게 작동하는지 확인해 봅시다.

```js
Zigbee2MQTT:debug 2021-10-19 22:31:53: Received Zigbee message from 'TestSwitch', type 'attributeReport', cluster 'genMultistateInput', data '{"presentValue":255}' from endpoint 3 with groupID 0
Zigbee2MQTT:info  2021-10-19 22:31:53: MQTT publish: topic 'zigbee2mqtt2/TestSwitch', payload '{"action":"hold_button_2","last_seen":1634671913843,"linkquality":70,"max_pause_button_1":null,"max_pause_button_2":null,"min_long_press_button_1":null,"min_long_press_button_2":null,"relay_mode_button_1":"front","relay_mode_button_2":"unlinked","state_button_1":"OFF","state_button_2":"OFF","switch_actions_button_1":null,"switch_actions_button_2":null,"switch_type_button_1":null,"switch_type_button_2":"momentary"}'
Zigbee2MQTT:info  2021-10-19 22:31:53: MQTT publish: topic 'zigbee2mqtt2/TestSwitch', payload '{"action":"","last_seen":1634671913843,"linkquality":70,"max_pause_button_1":null,"max_pause_button_2":null,"min_long_press_button_1":null,"min_long_press_button_2":null,"relay_mode_button_1":"front","relay_mode_button_2":"unlinked","state_button_1":"OFF","state_button_2":"OFF","switch_actions_button_1":null,"switch_actions_button_2":null,"switch_type_button_1":null,"switch_type_button_2":"momentary"}'
Zigbee2MQTT:info  2021-10-19 22:31:53: MQTT publish: topic 'zigbee2mqtt2/TestSwitch/action', payload 'hold_button_2'
```

우리는 genMultistateInput 클러스터 메시지가 정상적으로 처리되고 MQTT 메시지로 전환된 것을 볼 수 있습니다. 마지막 메시지가 간결하고 중요한데, 두 번째 버튼이 눌린 이벤트가 있었습니다. MQTT 이벤트를 구독할 수 있는 어떤 시스템이든 이러한 메시지를 쉽게 처리할 수 있습니다.

<div class="content-ad"></div>

다른 두 개의 메시지가 조금 혼란스러울 수 있어요 — "action":"hold_button_2"를 보내고, 곧바로 "action":""를 보내죠. 하지만 이는 Zigbee2mqtt FAQ에 설명된 정상적인 동작인 걸 알게 된 것이죠.

팁:

이전에도 언급했듯이 Multistate 입력 클러스터는 일반적인 방식과는 조금 다르게 사용되어요 — 값 자체보다는 값 변경 이벤트에 관심이 있는 것이죠. 주요 속성이 다양한 값들을 취할 수 있는 편리한 클러스터일 뿐입니다.

하지만 Multistate 입력이 다양한 버튼 이벤트를 신호로 지시하는 유일한 방법은 아닙니다. 그래서 샤오미 WXKG01LM 스위치는 OnOff 클러스터의 비표준 확장을 구현합니다. 상태 속성의 표준 0 및 1 값 이외에도 클릭 수를 나타내는 다른 값을 사용할 수 있어요. 다른 디바이스들도 On/Off 클러스터의 비표준 확장을 구현하고 다양한 이벤트를 나타내는 추가 속성을 추가합니다.

<div class="content-ad"></div>

일부 디바이스는 펌웨어 측면에서 다중 클릭 로직을 전혀 구현하지 않을 수 있습니다. 반면, 절대 표준적인 OnOff 클러스터가 사용되며, 다중 클릭은 z2m 컨버터에서 타이머를 사용하여 계산됩니다.

마지막으로 제조업체는 매우 사용자 정의된 클러스터를 개발하여 선호하는 형식으로 정보를 전송할 수도 있습니다.

# Home Assistant 자동화

Home Assistant에 노출된 스위치는 거의 자동으로 통합되지만 몇 가지 문제점이 있습니다. 먼저, 기본적으로 대부분의 설정이 비활성화되어 Home Assistant에 숨겨져 있습니다. 각 설정을 수동으로 활성화한 후 Home Assistant를 다시 시작해야 합니다. 매개변수를 활성화한 후에는 기기 페이지가 다음과 같이 보입니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-HelloZigbeeWorldPart18Customzigbee2mqttexternalconverter_5.png" />

둘째, 숫자 매개변수는 편집할 수 없습니다. 안타깝게도 이 문제를 전혀 해결할 방법을 찾지 못했습니다. 이를 해결하기 위한 임시방편으로, 이러한 매개변수는 zigbee2mqtt 대시보드에서 편집하거나 해당 mqtt 메시지를 보내는 방법으로 편집할 수 있습니다.

작업에 대해 말하자면, 여기서는 조금 원할한 상황이 아닙니다. 변환기가 가능한 작업 목록을 광고하지만, Home Assistant는이 목록을 무시합니다. 자동화를 생성하려고 하면 HA가 더블/트리플/롱 프레스를 자동화 트리거로 제안하지 않습니다... 해당 작업이 최소한 한 번 발생할 때까지입니다. 그런 다음 해당 작업이 목록에 나타나며 자동화 마법사에서 사용할 수 있게 됩니다.

자, 이제 유용한 일을 해보고 흥미로운 자동화를 작성해 봅시다. 현재 나는 내 Xiaomi 스위치로 커튼을 부분적으로 열거나 닫을 수 있는 기능이 정말 그립습니다. 보통 매우 어렵게 깨어납니다. 커튼이 한꺼번에 완전히 열리면 눈에 매우 충격을 줍니다. 커튼의 정도를 동일한 스위치로 제어할 수 있는 기능이 있으면 좋겠습니다.

<div class="content-ad"></div>

단 몇 분 만에, 홈 어시스턴트 시각적 편집기에서 몇 가지 자동화 규칙을 만들었어요.

첫 번째 자동화는 버튼 더블 클릭으로 커튼을 완전히 열거나 닫습니다.

```js
- id: '1635018171508'
  alias: TestSwitch Open/Close curtain
  description: 'TestSwitch Open/Close curtain'
  trigger:
  - platform: mqtt
    topic: zigbee2mqtt2/TestSwitch/action
    payload: double_button_1
  condition: []
  action:
  - service: cover.toggle
    target:
      entity_id: cover.living_room_curtain
  mode: single
```

두 번째 자동화는 버튼을 세 번 클릭하면 커튼을 50%로 엽니다.

<div class="content-ad"></div>

```yaml
- id: '1635017708545'
  alias: TestSwitch Half-open curtains
  description: 'TestSwitch Half-open curtains'
  trigger:
  - platform: mqtt
    topic: zigbee2mqtt2/TestSwitch/action
    payload: triple_button_1
  condition: []
  action:
  - service: cover.set_cover_position
    target:
      entity_id: cover.living_room_curtain
    data:
      position: 50
  mode: single
```

다음 두 가지 자동화는 길게 누르는 것을 사용합니다 — 버튼을 누르면 커튼이 움직이기 시작하고, 버튼을 놓으면 멈춥니다.

```yaml
- id: '1635017908150'
  alias: TestSwitch toggle curtain on button press
  description: 'TestSwitch toggle curtain on button press'
  trigger:
  - platform: mqtt
    topic: zigbee2mqtt2/TestSwitch/action
    payload: hold_button_1
  condition: []
  action:
  - service: cover.toggle
    target:
      entity_id: cover.living_room_curtain
  mode: single

- id: '1635017981037'
  alias: TestSwitch stop curtain
  description: 'TestSwitch stop curtain'
  trigger:
  - platform: mqtt
    topic: zigbee2mqtt2/TestSwitch/action
    payload: release_button_1
  condition: []
  action:
  - service: cover.stop_cover
    target:
      entity_id: cover.living_room_curtain
  mode: single
```

위와 같이 간단한 자동화를 사용하면 단일 버튼으로 커튼을 제어할 수 있습니다 — 열기, 닫기, 특정 개도로 설정하는 것도 가능합니다. 게다가, 버튼의 일반적인 단추도 주 조명을 전환할 수 있습니다.


<div class="content-ad"></div>

# 요약

축하해요, 우리는 방금 Xiaomi Aqara 스위치를 새롭게 만들었어요! 음, 비슷한 스마트 스위치예요. 아마도 우리 장치는 좀 더 다양한 설정을 제공할지도 모르지만, 전반적으로 모든 것이 거의 같아요. 그래도 뭔가 다른 목표가 있었죠 — 사용자 정의 클러스터, genOnOffSettingCfg 및 genMultistateInput 클러스터를 생성하고 zigbee2mqtt를 위한 외부 컨버터를 작성해보는 것이었어요.

자신만의 클러스터를 만들거나 기존 클러스터를 확장하는 데 별로 어려운 점이 없다는 것이 밝혀졌어요. zigbee2mqtt를 다루는 데에는 조금 골치가 아팠지만, 그건 대부분 명쾌한 문서의 부재 때문이었어요. 이제 이 빈칸은 채워졌어요 :)

# 링크

<div class="content-ad"></div>

- JN-UG-3113 ZigBee 3.0 스택 사용자 가이드
- JN-UG-3114 ZigBee 3.0 디바이스 사용자 가이드
- JN-UG-3076 ZigBee 홈 오토메이션 사용자 가이드
- ZigBee 클래스 라이브러리 사양
- Zigbee 트래픽을 감지하는 방법
- zigbee2mqtt에 새로운 장치 추가
- 깃허브 프로젝트

# 지원

이 프로젝트는 품앗이 프로젝트로 무료로 개발 중입니다. 동시에 작은 기부로 프로젝트를 지원하는 것을 고려해볼 수 있습니다.

![HelloZigbeeWorld](/assets/img/2024-06-19-HelloZigbeeWorldPart18Customzigbee2mqttexternalconverter_6.png)