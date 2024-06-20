---
title: "알고리즘 세계에서 미디어의 출처를 확인하는 방법"
description: ""
coverImage: "/assets/img/2024-06-19-VerifyingtheOriginofMediainanAlgorithmicWorld_0.png"
date: 2024-06-19 04:07
ogImage: 
  url: /assets/img/2024-06-19-VerifyingtheOriginofMediainanAlgorithmicWorld_0.png
tag: Tech
originalTitle: "Verifying the Origin of Media in an Algorithmic World"
link: "https://medium.com/better-programming/verifying-the-origin-of-media-in-an-algorithmic-world-25bff92ab572"
---


## C2PA 콘텐츠 신뢰성 사양 및 Rust SDK 소개

![이미지](/assets/img/2024-06-19-VerifyingtheOriginofMediainanAlgorithmicWorld_0.png)

인간이 직접 제작한 정품 미디어를 딥페이크나 기타 알고리즘으로 생성된 미디어와 구분하는 것은 알려진 바와 같이 매우 어렵습니다. 기존 도구들은 주어진 미디어가 생성될 확률을 제시하지만 확실성을 확보하는 것은 어렵습니다. 알고리듬 미디어와 딥페이크가 온라인 공간을 덮치면서, 정치 및 선거 관련 미디어의 신뢰성을 검증하는 것이 향후 중요해질 것입니다. 온라인 오보나 디스인포메이션을 걸러내는 것 이외에도, 디지털 작품의 원본 권한을 주장하고 싶어하는 예술가들에게 신뢰성을 인정하는 것도 가치가 있습니다.

디지털 이미지나 비디오가 정품인지, 인공적으로 생성되었거나 복제된 것인지를 이해하려면 다음과 같은 것들을 알고 있어야 할 수도 있습니다:

<div class="content-ad"></div>

미디어 메타데이터의 무결성을 확인하는 암호학적으로 안전한 서명 방법이나 카메라 정보, 좌표 및 기타 정보와 같은 것들을 확인하는 방법이 필요합니다.
또한 원래 형태에서 많이 수정되지 않았음을 알 수 있는 방법이 필요할 것입니다. 수정이 있었다면 그 수정 내용 또한 알 수 있어야 합니다.

그러한 해결책이 있습니다. 아래에서 다음 내용에 대해 이야기하겠습니다:
- C2PA 명세
- 명세가 작동하는 방식
- 코드 지원
- 어떤 이점이 있는지
- 문제점
- 앞으로의 전망은?

# C2PA 명세

<div class="content-ad"></div>

콘텐츠 검증 및 출처 연동을 담당하는 콘텐츠 신뢰도 이니셔티브의 일부인 C2PA 기술 명세서가 Adobe가 주도하는 이니셔티브에서 제작되었습니다. 알고리즘으로 생성된 미디어를 감지하려는 대신, 이 명세서는 미디어의 출처와 미디어가 수명 동안 거쳐온 수정 작업들의 순서를 확인할 수 있는 시스템을 설명합니다. 이 정보는 관련 메타데이터 구조 내에서 암호화된 형태로 주장됩니다.

다른 말로 하면, 이 표준은 메타데이터에서 해당되는 클래스의 미디어가 사실 인간이 생성한 것임을 확신시켜줍니다. 이 메타데이터가 없는 미디어는 C2PA 표준에서 혜택을 받을 수 없습니다. 이 표준은 선택 사항이며, 이에 동의한 장비 제조업체(예: 카메라), 미디어 편집 소프트웨어(포토샵 등), 그리고 미디어의 출처를 확인하고 싶어하는 모든 시스템들에 의존합니다.

![이미지](/assets/img/2024-06-19-VerifyingtheOriginofMediainanAlgorithmicWorld_1.png)

이 시스템과 관련된 개념 중 하나는 미디어와 관련된 Exif 형식이며, 사진이 촬영된 지역, 하드웨어 세부 정보, 카메라 설정과 같은 정보를 포함할 수 있습니다. 그리고 이러한 Exif 데이터는 JPEG와 같은 미디어 파일에 직접 포함됩니다. 이 데이터는 일반적으로 암호화되지 않습니다.

<div class="content-ad"></div>

C2PA 사양은 지원되는 미디어 유형에 직접 메타데이터를 미디어 파일에 포함합니다 (다른 유형의 경우 "사이드카" 매니페스트 파일을 생성합니다). 매니페스트에는 다음과 같은 정보가 포함됩니다:

- 미디어 원본 정보 (디지턈 카메라 캡처, 다른 창작물)
- 시간 경과에 따른 미디어 수정 내역, 사용된 도구 및 작업자
- 매니페스트가 조작 방지임을 보장하는 디지털 서명
- 그 외

메타데이터 자체는 JUMBF 형식(JPEG Universal Metadata Box Format)으로 저장됩니다.

# 사양이 작동하는 방식

<div class="content-ad"></div>

해당 명세는 미디어의 원본에 대한 데이터 집합과 그에 대한 모든 후속 작업에 대한 주장을 포함하는 매니페스트를 설명합니다.

예를 들어 매니페스트는 사진이 특정 날짜와 시간에 특정 카메라로 촬영되었고, 이후 (예를 들어 자르기와 같은) 미디어 편집 도구를 통해 편집되었다는 것을 주장할 수 있습니다. 미디어에 대한 주장은 W3C 신뢰 가능 자격증서로 디지털적으로 서명될 수 있으며, 해당 주장은 (사람 또는 조직)의 Claim으로 넘어갈 수 있습니다. 이에 대한 코드 예시는 아래에서 설명하겠습니다.

![Verifying the Origin of Media in an Algorithmic World](/assets/img/2024-06-19-VerifyingtheOriginofMediainanAlgorithmicWorld_2.png)

복잡하기는 하지만, 툴의 신뢰성 같은 몇 가지 가정을 하면 (수정된 매니페스트를 업데이트한 툴에 대한 신뢰성과 같은), 이 정보는 카메라로 촬영된 미디어와 Midjourney와 같은 모델에 의해 생성된 미디어의 차이점에 대해 알려줄 수 있습니다.

<div class="content-ad"></div>

암호화 서명은 청구와 함께 제공되며, 이를 통해 주장이나 다른 메타데이터가 후속 수정되었는지를 판단할 수 있습니다. 예를 들어, 미디어의 원천을 순수 알고리즘 미디어에서 디지털 캡처로 변경하려고 시도하는 경우입니다.

# 코드 해설

여러 파일 유형에 C2PA 개념을 적용할 수 있는 Rust SDK(그리고 c2pa-js와 같은 몇 가지 다른 SDK도 있습니다)가 있습니다.

지금은 해당 SDK를 사용하는 방법에 대한 간단한 단계별 해설을 찾지 못했지만, 일부 탐험적인 코드를 사용하여 해당 SDK의 빠른 개요 데모를 여기에 게시했습니다.

<div class="content-ad"></div>

이 코드는 특정 미디어 파일을 위한 새로운 Manifest를 초기화합니다. 이 Manifest에는 작성자 세부 정보, 콘텐츠에 대한 주장, Exif 또는 사용자 지정 구조와 같은 메타데이터를 인코딩합니다.

예를 들어:

```js
// 새 미디어를 위한 새 Manifest 생성
let mut manifest = Manifest::new("mikes-c2pa-test-code/0.1".to_owned());

// 새, 독창적인 창작물로 이 미디어를 설정
let creative_work = CreativeWork::new()
    .add_author(
        SchemaDotOrgPerson::new()
            .set_name("Mike Cvet")
              .expect("set name")
            .set_identifier("mikecvet")
              .expect("set identifier")
    )?;

// 이 미디어가 생성되었고, 관련 정보가 포함된 주장
let created = Actions::new()
    .add_action(
        Action::new(c2pa_action::CREATED)
            // 이것을 원본 디지털 이미지 생성 유즈케이스로 가정
            .set_source_type("https://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture".to_owned())
            .set_software_agent("mikes-c2pa-test-code/0.1")
            .set_when(now_string.clone())
    );

// 주장을 Manifest에 추가
manifest.add_assertion(&creative_work)?;
manifest.add_assertion(&created)?;

// 서명 도구 생성
let signer = create_signer::from_files(
  signcert_path, pkey_path, SigningAlg::Ps256, None
);

// Manifest에 서명하고 미디어 파일에 삽입
manifest.embed(&source, &dest, &*signer.unwrap())?;
```

Manifest 내용에는 주장 및 일부 서명 정보에 대한 섹션이 포함됩니다.

<div class="content-ad"></div>

실제 서명 암호 해시는 Manifest 표시 출력에서 삭제되었습니다.

```js
  "manifests": {
    "urn:uuid:5772a32a-777e-46d5-b65e-50426d95e84e": {
      "claim_generator": "mikes-c2pa-test-code/0.1 c2pa-rs/0.25.2",
      "title": "제목",
      "format": "image/jpeg",
      "instance_id": "xmp:iid:56beb158-2cde-4ef4-b111-5a5a4aea7bef",
      "ingredients": [],
      "assertions": [
        {
          "label": "stds.schema-org.CreativeWork",
          "data": {
            "@context": "http://schema.org/",
            "@type": "CreativeWork",
            "author": [
              {
                "@type": "Person",
                "identifier": "mikecvet",
                "name": "Mike Cvet"
              }
            ]
          },
          "kind": "Json"
        },
        {
          "label": "c2pa.actions",
          "data": {
            "actions": [
              {
                "action": "c2pa.created",
                "digitalSourceType": "https://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture",
                "softwareAgent": "mikes-c2pa-test-code/0.1",
                "when": "2023-08-21T08:46:18.159790+00:00"
              }
            ]
          }
        },

       /* 더 많은 섹션 */

      "signature_info": {
        "issuer": "C2PA Test Signing Cert",
        "cert_serial_number": "720724073027128164015125666832722375746636448153"
      },
      "label": "urn:uuid:5772a32a-777e-46d5-b65e-50426d95e84e"
  }
}
```

ManifestStore는 Manifest 및 이들의 직렬화, 역직렬화, 유효성 검사를 관리합니다.

ManifestStore의 서식이 있는 보기 구조를 조사하면 다음이 표시됩니다:

<div class="content-ad"></div>

```js
{
  "active_manifest": "uuid:5772a32a-777e-46d5-b65e-50426d95e84e",
  "manifests": {
    // 현재 manifest로 식별되는 것에 유의하세요; 다른 manifest들도 존재할 수 있습니다.
    "urn:uuid:5772a32a-777e-46d5-b65e-50426d95e84e": {

      // 이 상자에 설명된 manifest에 포함된 모든 내용입니다.
    }
  }
}
```

활성 manifest는 미디어에 적용되는 가장 최근의 주장 집합을 가리킵니다. 미디어 파일과 연결된 많은 manifest가 있을 수 있으며, 과거 버전에 대한 주장을 나타냅니다.

파생 자산은 기존 미디어나 콘텐츠에서 만들어진 것입니다. 예를 들어 편집 도구에 로드되어 수정된 이미지 등이 있습니다. 새 Manifest를 생성할 때는 이전 주장을 부모 구성요소로 포함시킵니다. Rust SDK에서는 미디어 파일로부터 기존 Manifest를로드하여 편집하는 것이 불가능하며, 새로운 Manifest가 생성되어야 합니다. 예를 들어, 미디어 편집 소프트웨어가 부모 미디어가 잘린 주장을 추가하려면 다음과 같이 보일 수 있습니다:

```js
// Manifest를 편집할 수 없습니다. manifest 저장소의 내용을 수정하려면, 이전 버전의 콘텐츠와 해당 manifest를 ingredient로 가져와야 합니다.
let parent = Ingredient::from_file(file_path).expect("source file");

let mut manifest = Manifest::new("mikes-c2pa-test-code/0.1".to_owned());

let actions = Actions::new()
    // 이 미디어는 지정된 사용자 에이전트에 의해 열렸습니다.
    .add_action(
        Action::new(c2pa_action::OPENED)
            .set_parameter("identifier", parent.instance_id().to_owned())
            .expect("set id")
            .set_reason("editing")
            .set_software_agent("mikes-c2pa-test-code/0.1")
            .set_when(now_string.clone())
    )
    // 이 미디어는 지정된 사용자 에이전트에 의해 잘렸습니다.
    .add_action(
        Action::new(c2pa_action::CROPPED)
            .set_parameter("identifier", parent.instance_id().to_owned())
            .expect("set id")
            .set_reason("editing")
            .set_source_type("https://cv.iptc.org/newscodes/digitalsourcetype/minorHumanEdits".to_owned())
            .set_software_agent("mikes-c2pa-test-code/0.1")
            .set_when(now_string.clone())
    );
```

<div class="content-ad"></div>

이것은 콘텐츠에 대한 새로운 주장 세트를 포함하는 새로운 Manifest를 설정합니다:

```js
{
  "claim_generator": "mikes-c2pa-test-code/0.1 c2pa-rs/0.25.2",
  "title": "test_file.jpg",
  "format": "image/jpeg",
  "instance_id": "xmp:iid:996edb05-fdf0-4d28-93a2-4e8bf3db3684",
  "ingredients": [
    {
      "title": "test_file.jpg",
      "format": "image/jpeg",
      "instance_id": "xmp:iid:56beb158-2cde-4ef4-b111-5a5a4aea7bef",
      "relationship": "parentOf",
      "active_manifest": "urn:uuid:5772a32a-777e-46d5-b65e-50426d95e84e"
    }
  ],
  "assertions": [
    {
      "label": "c2pa.actions",
      "data": {
        "actions": [
          {
            "action": "c2pa.opened",
            "parameters": {
              "identifier": "xmp:iid:56beb158-2cde-4ef4-b111-5a5a4aea7bef"
            },
            "reason": "editing",
            "softwareAgent": "mikes-c2pa-test-code/0.1",
            "when": "2023-08-22T05:08:19.134866+00:00"
          },
          {
            "action": "c2pa.cropped",
            "digitalSourceType": "https://cv.iptc.org/newscodes/digitalsourcetype/minorHumanEdits",
            "parameters": {
              "identifier": "xmp:iid:56beb158-2cde-4ef4-b111-5a5a4aea7bef"
            },
            "reason": "editing",
            "softwareAgent": "mikes-c2pa-test-code/0.1",
            "when": "2023-08-22T05:08:19.134866+00:00"
          }
        ]
      }
    }
  ],
```

이 새로운 주장 세트는 서명되어 있으며 새로운 액티브 Manifest로 미디어에 포함됩니다.

# 이것이 우리에게 무엇을 제공합니까?

<div class="content-ad"></div>

적재소를 이런식으로 불러와 보겠다면:

```js
  let manifest_store = ManifestStore::from_file("./out/test_file.jpg")?;

  match manifest_store.validation_status() {
      // 주의: 오류가 있는 경우에만 상태가 나타남
      Some(statuses) if !statuses.is_empty() => {
          
          println!("매니페스트를 불러오는 중 유효성 검사 오류 발생:");
          for status in statuses {
              println!("유효성 검사 코드: {}", status.code());
          }

          panic!("데이터 유효성 오류 발생");
      },
      _ => ()
  }
```

이렇게 출력됩니다:

<div class="content-ad"></div>

```js
매니페스트 로딩 중 유효성 검사 오류가 발생했습니다:

유효성 상태 코드: assertion.dataHash.mismatch
```

ManifestStore가 자산의 해시(매니페스트 포함)가 매니페스트 자체에 저장된 해시와 일치하지 않음을 감지했습니다. 따라서 데이터 해시 불일치를 통해 이미지 또는 매니페스트가 변경되었음이 명백해졌습니다.

그러므로 이론적으로, 모든 것이 예상대로 작동한다면, 주어진 미디어 파일의 생성 및 수정 이력이 완전히 고려되고 실제임을 완전히 이해하는 데 이 데이터를 사용할 수 있습니다.

<img src="/assets/img/2024-06-19-VerifyingtheOriginofMediainanAlgorithmicWorld_3.png" />


<div class="content-ad"></div>

# 문제들

C2PA 표준도 만병통치약은 아닙니다. 미디어 유형의 신뢰성을 확립할 수 있는 좋은 기회가 있을 것 같지만 다른 고려 사항이 있습니다.

## 개인정보

이 표준은 개인의 고유 식별 데이터를 미디어의 원천 또는 조작과 연결함으로써 작동합니다. 이 데이터의 널리 퍼지는 것은 아마도 산업이 나아가는 방향에 따라 기본적으로 그렇게 될 수 있으며, 미디어 제작자나 저자에게는 의도하지 않았거나 바람직하지 않은 일일 수도 있습니다.

<div class="content-ad"></div>

## 동등한 신뢰할 수 있는 정보에 대한 접근

미래에서 우리가 미디어를 창작자의 검증된 자격 증명과 함께 서명할 때에 미디어가 더 신뢰할 만하다고 생각한다면, 그 자격 증명이 없는 사람들이 만든 미디어의 가치는 감소될 것입니다.

## 표준 준수

기술 표준은 규제가 아니며, 중요한 것은 기업들과 그와 연관된 소프트웨어가 적용해야만 영향을 미칩니다. 대부분의 수혜자가 일반적으로 사용할 수 있도록 하기 위해서는 대부분의 미디어가 C2PA 매니페스트를 가져야 할 것입니다. 예를 들어, Apple이 관심을 갖지 않는다고 결정하거나, 미래의 인기 있는 비디오 편집 도구가 동일한 결정을 내린 경우, 이는 생태계에서 일상적으로 생성된 막대한 양의 사용자 생성 미디어를 제외시킵니다.

<div class="content-ad"></div>

## 표준 남용

C2PA는 오픈 표준이기 때문에 누군가가 해당 표준을 준수하는 도구를 만들지 못하게 막는 것은 거의 불가능합니다. 그러나 예를 들어, 모든 알고리즘으로 생성된 미디어를 디지털 캡처로 레이블링하고 해당 내용으로 서명하는 도구를 만들 수 있습니다. 이로 인해 사용 가능한 C2PA 매니페스트 집합이 오염되며, 신뢰할 수 있다면 이를 검증하기 위해 매니페스트 기록에 포함된 사용자 에이전트를 검사해야 할 것입니다.

# 미래에 대한 전망은?

이 표준이 기술 산업에 보다 깊게 자리 잡고 기업들이 계속해서 이를 엄격히 준수한다는 것을 가정한다면, 미디어를 세 가지 그룹으로 나누어 생각할 수 있습니다:

<div class="content-ad"></div>

- 신뢰할 만한 출처 정보를 갖춘 미디어는 미디어의 생성 및 수정의 연대기에 대한 맥락을 제공하며 디지털 서명에 의한 암호 보증이 일부 제공됩니다.
- 출처 데이터에 수정 또는 모순이 감지되는 미디어(예: 순수 알고리즘 미디어의 원본을 디지털 캡처로 대체하거나 수정된 타임스탬프 또는 배우 식별자의 경우와 같이 언급된 경우). 관심 있는 또는 숙련된 관찰자에게 변조가 명백하게 드러나고, 그런 후, 그들 스스로 미디어의 정당성에 대한 결론을 내릴 것입니다.
- 출처 정보가 전혀 없는 미디어는 그 출처에 대해 확신하기 어렵고, 우리는 확률적 기법에 의존하여 그 신빙성을 결정하려고 합니다.

기자, 미디어 기관 및 소셜 플랫폼은 이러한 범주의 발행에 대해 서로 다른 기준을 적용할 수 있습니다. 첫 번째로, 그들은 증명의 요구를 매우 신뢰할 만한 것으로 다룰 수 있습니다. 둘째로, 그 반대로 할 수 있습니다.

세 번째로, 이러한 기관들은 위험 허용성, 배우들의 신임성 및 생성적 미디어를 감지하려는 도구의 결과를 기반으로 기자적인 결정을 내려야 할 것입니다. 법정에서 제시된 증거, 교실에서 사용된 미디어, 그리고 다른 맥락에서도유사한 고려사항이 해당됩니다.

이것이 어떻게 전개될지, 그리고 어떤 위험이 있는지 아직 일러 알 수 없습니다. 그러나 이 사양 및 그 흐름이 온라인 공간에서 미디어 출처의 검증을 표준으로 만드는 데 중요한 역할을 할 수 있다고 보입니다. 산업의 충분한 약속과 지원이 제공된다면,이 시스템은 미디어 출처 투명성을 온라인 공간의 표준으로 만드는 잠재력을 지닙니다.

<div class="content-ad"></div>

CAI는 광범위한 산업 관심을 받고 있지만, 이러한 출처 규격을 활용하기 위해 산업 전반에서 어떤 구체적인 기술적 약속이 이뤄질지 기다리고 있습니다.