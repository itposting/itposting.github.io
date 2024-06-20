---
title: "Pinterest의 Ray 인프라"
description: ""
coverImage: "/assets/img/2024-06-19-RayInfrastructureatPinterest_0.png"
date: 2024-06-19 03:39
ogImage: 
  url: /assets/img/2024-06-19-RayInfrastructureatPinterest_0.png
tag: Tech
originalTitle: "Ray Infrastructure at Pinterest"
link: "https://medium.com/pinterest-engineering/ray-infrastructure-at-pinterest-0248efe4fd52"
---


| 이름 | 직급 |  
| --- | --- |  
| Chia-Wei Chen | 주임 소프트웨어 엔지니어 |  
| Raymond Lee | 주임 소프트웨어 엔지니어 |  
| Alex Wang | 소프트웨어 엔지니어 I |  
| Saurabh Vishwas Joshi | 주임 스태프 소프트웨어 엔지니어 |  
| Karthik Anantha Padmanabhan | 주임 엔지니어 관리자 |  
| Se Won Jang | 주임 엔지니어 관리자 |  

# 우리 Ray 인프라의 여정

저희 블로그 시리즈의 제1부에서는 Ray에 투자하여 비즈니스의 핵심적인 문제를 해결하기 위해 동기부여를 받았던 이유에 대해 논의했습니다. 이 블로그 포스트에서는 Pinterest와 같은 웹 규모 회사에 Ray를 통합하는 데 필요한 단계에 대해 더 자세히 설명하겠습니다. 우리는 새로운 기술을 받아들이기 위해 다양한 고유한 제약 조건과 도전에 직면한 Pinterest와 같은 기업에 Ray를 통합하는 데 필요한 것들을 논의할 것입니다. 이는 Ray 인프라 부분에 대한 더 포괄적인 버전으로, 우리가 Ray 설명에서 발표한 Last Mile Data Processing for ML Training using Ray in Ray Summit 2023의 일환입니다.

저희의 사용 사례에서 KubeRay가 제공하는 Ray 클러스터를 프로비저닝할 수 있는 능력이 Ray 인프라를 성숙화하는 일의 일부일 뿐입니다. 회사들은 Ray 및 다른 특정 요구사항을 준수해야 하며, 이는 로그, 메트릭 지속성, 네트워크 격리, 최적의 하드웨어 인스턴스 식별, 보안, 트래픽 설정 및 기타 내부 서비스 통합을 포함한 모든 다른 모베스트 관행을 따라야 합니다.

<div class="content-ad"></div>

2023년에 여정이 시작되었어요. 전문 엔지니어 한 명이 이 프로젝트에 50%의 시간을 투자했어요:

- 2023년 1분기: Anyscale 파트너의 지원을 받아 프로토타이핑 단계가 시작되었어요
- 2023년 2분기: Ray Infra MVP가 완료되었고, 시스템 로깅, 메트릭, UI, 및 애플리케이션을 위한 CLI와 같은 필수 도구들이 반복되고 향상되었어요
- 2023년 3분기: 첫 번째 프로덕션 유즈 케이스에 중점을 두어 내부 시스템을 통합하여 서비스 안정성을 향상시켰어요
- 2023년 4분기: 프로덕션 준비에 중점을 두어 보안 문제 대응, 네트워크 안정성 향상, Ray-optimized Kubernetes 환경으로의 전환 평가가 진행되었어요

![이미지](/assets/img/2024-06-19-RayInfrastructureatPinterest_0.png)

# 직면한 도전들

<div class="content-ad"></div>

핀터레스트에서 Ray 인프라를 구축할 때 몇 가지 중요한 도전 과제가 발생했습니다. 이러한 도전 과제를 해결해야 했습니다:

- K8s API 접근 제한: 핀터레스트의 일반 목적의 연합 Kubernetes 클러스터인 PinCompute에서 작동 중이었기 때문에 KubeRay와 같은 필수 오퍼레이터와 해당 사용자 정의 정의를 설치하는 것이 제한되었습니다.
- 일시적인 로깅 및 메트릭: Ray 클러스터가 활성 상태인 경우 Ray 대시보드를 통해 로깅과 메트릭을 확인할 수 있었지만, 리소스 집약적인 Ray 클러스터를 디버깅 목적으로 유지하는 것은 현실적이지 않았습니다. Ray 작업 부하의 수명 주기를 영속화하고 다시 재생하는 해결책을 찾았습니다.
- 메트릭 통합: 회사는 프로메테우스와 그라파나와 같은 인기 있는 오픈 소스 솔루션과 달리 자체의 시계열 데이터베이스와 시각화 도구를 보유하고 있었습니다.
- 인증, 권한 부여, 감사 (AAA) 가이드라인: 회사 표준에 따라 K8s에서 실행되는 서비스에 AAA를 보장해야 했고, 핀터레스트에서 AAA를 빌드하기 위해 Envoy를 서비스 메시로 사용하는 것이 권장되었습니다.
- 다양한 개발 환경: Jupyter와 CLI 액세스와 같은 상호 작용하는 옵션과 다양한 개발자 요구를 충족하기 위해 Dev 서버에서 CLI 액세스와 같은 다양한 개발 경험이 구축되었습니다.
- 비용 최적화 및 자원 낭비: 유휴 상태의 Ray 클러스터는 상당한 비용이 발생할 수 있습니다. 팀의 인식을 높이고 자원 낭비를 줄이기 위해 가비지 컬렉션 정책과 비용 할당이 필요했습니다.
- 오프라인 데이터 분석: 오프라인 분석을 위해 모든 Ray 클러스터 관련 메트릭을 대규모 데이터 형식 (예: 하이브, 파케)으로 내보내는 것이 우선되었습니다. 이 데이터에는 GPU 활용률과 같은 메트릭이 포함되어 있어 개선 영역을 식별하고 응용 프로그램 및 인프라의 안정성을 시간 경과에 따라 추적할 수 있습니다.

## 쿠버네티스 기반

K8s API 액세스 제한으로 인해 우리 환경에 KubeRay를 쉽게 설치할 수 없어 K8s에서 Ray 클러스터를 운영하기 어려웠습니다. 또한, 핀터레스트 K8s 클러스터 내에서 비밀 관리, 트래픽 처리 및 로그 회전과 같은 작업을 위해 다른 팀에서 관리되는 특정 사이드카가 필요했습니다. 버그 수정이나 보안 패치와 같은 필수 사이드카 업데이트를 중앙 제어하기 위해 특정 제한 사항에 따라 준수해야 했습니다.

<div class="content-ad"></div>

Ray 클러스터에 필요한 필수 구성 요소를 프로토타입으로 만드는 중입니다(On-Premise Cluster 가이드에서 설명된 대로), 필요한 사이드카를 통합하기 위해 Pinterest 특정 CRD를 사용하기로 결정했습니다. 이는 오픈 소스 Kubeflow PyTorchJob 위에 구축된 래퍼입니다.

최초 반복에서는 Ray 헤드 및 Ray worker를 클라이언트 측에서 만들어 간단하게 유지하기로 하였습니다. 각 구성 요소에 대해 다른 명령을 사용하고 클라이언트 측에서 실행될 사용자 정의 스크립트를 작성하는 것을 포함했습니다.

```js
def launch_ray_cluster(configs: RayClusterConfig) -> str:
    # resources, instance_type, command, envs_vars 등 정의
    configs = RayClusterAndJobConfigs()
    with ThreadPoolExecutor() as executor:  
        # 함수를 실행자에 제출
        ray_head = executor.submit(launch_ray_head(configs)).result()
        ray_workers = executor.submit(launch_ray_workers(configs).result()
    return check_up_and_running(ray_head, ray_workers)
```

이 단계에는 개선할 여지가 많이 있습니다. 주요 단점은 클라이언트 측 실행이 네트워크 오류나 만료된 자격 증명과 같은 다양한 이유로 중단될 수 있어 K8s에서 자원을 낭비하는 좀비 Ray 클러스터가 발생할 수 있다는 것입니다. 이 접근 방식은 Ray 사용자들이 Ray에서 놀 수 있도록 막는 데 충분하지만 Ray 클러스터를 효율적으로 관리하기 위해 설계된 플랫폼에 적합하지는 않습니다.

<div class="content-ad"></div>

# API Gateway & Controller

두 번째 반복에서는 클라이언트 측에서 Ray 클러스터를 관리하는 방식에서 KubeRay와 유사한 컨트롤러를 개발하여 서버 측 접근 방식으로 전환되었습니다. 우리의 솔루션은 사용자와 K8s 사이에 중간 계층을 생성하여 API 서버, Ray 클러스터/작업 컨트롤러 및 MySQL 데이터베이스로 구성된 여러 구성 요소를 포함했습니다.

![이미지](/assets/img/2024-06-19-RayInfrastructureatPinterest_1.png)

- API 서버: 이 구성 요소는 요청 유효성 검사, 인증 및 권한 부여를 용이하게 합니다. 클라이언트 측에서 K8s의 복잡성을 추상화하여 사용자가 플랫폼 API 인터페이스와 상호 작용할 수 있도록 하며, 특히 나중 섹션에서 TLS 관련 구현을 강화하는 데 특히 유용합니다.
- MySQL 데이터베이스: 데이터베이스는 Ray 클러스터와 관련된 상태 정보를 저장하여 K8s 측에서 필요한 일시적 상태를 다시 생성할 수 있게 합니다. 또한 API 서버와 Ray 클러스터 컨트롤러 간의 데이터 흐름을 분리하고 오프라인 분석을 위해 Hive로 데이터 덤프를 수행하는 추가 혜택이 있습니다.
- Ray 클러스터 컨트롤러: 이 구성 요소는 Ray 클러스터의 수명 주기 관리를 위해 K8s를 지속적으로 쿼리합니다. Ray 헤드 및 워커 노드 프로비저닝, Ray 클러스터 상태 모니터링 및 필요에 따른 정리 작업을 수행하는 역할을 합니다.
- Ray 작업 컨트롤러: Ray 클러스터 컨트롤러와 유사하게, Ray 작업 컨트롤러는 Ray 작업 수명 주기 관리에 초점을 맞춥니다. RayJobs를 제출하기 위한 주요 엔티티로 작용하여 시스템 내에서 적절한 인증 및 권한 부여 프로토콜을 보장합니다. 또한 컨트롤러는 동일한 Ray 클러스터에 여러 Ray 작업을 제출할 수 있도록 지원함으로써 사용자가 각 작업 제출마다 새 Ray 클러스터 프로비저닝을 기다릴 필요 없이 더 효율적으로 반복할 수 있도록 합니다.

<div class="content-ad"></div>

여기는 테이블 태그를 마크다운 형식으로 변경한 것입니다.

이 방식은 사용자와 Kubernetes 사이에 가치 있는 추상화 계층을 제공하여 사용자가 복잡한 Kubernetes 자산을 이해할 필요가 없게 합니다. 대신, 플랫폼에서 제공하는 사용자 대면 라이브러리를 활용할 수 있습니다. 클라이언트 측에서 프로비저닝 단계의 부담을 옮기면 프로세스가 간소화되어 단계가 단순화되고 전반적인 사용자 경험이 향상됩니다.

![이미지](/assets/img/2024-06-19-RayInfrastructureatPinterest_2.png)

우리 자체 컨트롤러를 구현하는 동안, 우리는 모듈화를 보장하여 나중에 KubeRay로의 원활한 전환을 가능하게 했습니다. 이 방식은 Ray 클러스터를 시작하는 데 사용되는 방법을 손쉽게 바꿀 수 있어, 내부 Kubernetes 기본 도구에서 KubeRay로의 전환이 원활하게 이루어집니다.

```python
Class Controller:
    def reconcile(self, ray_cluster: RayClusterRecord):
        # 이 부분은 내부 기본 도구에서 KubeRay로 교체 가능합니다.
        status, k8s_meta = self.launch_and_monitor_ray_cluster(ray_cluster.configs)
        db.update(ray_cluster, status=status, k8s_meta=k8s_meta)

    def run(self):
        while True:
            ray_clusters = db.get_ray_cluster_to_dispatch()
            for ray_cluster in ray_clusters:
                self.reconcile(ray_cluster)
            sleep(1)
   
    def launch_and_monitor_ray_cluster(self, configs) -> Tuple[str, Dict]:
        return get_actual_k8s_related_status(ray_identifier=configs.ray_identifier)
```

<div class="content-ad"></div>

가능한 한 Observable성을 고려해보세요. Ray 클러스터의 기존 Ray 대시보드는 클러스터가 활성화된 상태에서만 접근할 수 있고 로그 또는 메트릭 재생을 위한 기능이 없습니다. 따라서 우리는 지속적인 로깅 및 메트릭 기능을 통합하는 전용 사용자 인터페이스를 개발하기로 결정했습니다. 이 사용자 인터페이스는 이전에 구축한 API Gateway에 의해 지원되며, 실시간으로 Ray 클러스터 및 Ray 작업 상태에 대한 통찰력을 제공합니다. 모든 메타데이터, 이벤트 및 로그는 데이터베이스 또는 S3에 저장되므로 이 전략은 Ray 클러스터를 유지하지 않고도 로그 분석을 가능하게 함으로써 GPU와 같은 유휴 리소스로 인한 비용을 완화할 수 있습니다.

![image](/assets/img/2024-06-19-RayInfrastructureatPinterest_3.png)

다양한 회사들이 자체 시계열 메트릭 솔루션을 가지고 있다는 것은 사실일 것입니다. Pinterest에서는 Goku라는 자체 시계열 데이터베이스를 활용하고 있으며, 이는 OpenTSDB와 호환되는 API를 가지고 있습니다. 우리는 prometheus 메트릭을 스크랩하고 내부 시스템과 호환되도록 재구성하는 추가 사이드카를 실행하고 있습니다. 로깅에 관해서는 Ray의 권고사항을 따라 로그를 AWS S3에 지속 저장하고 있습니다. 이러한 로그는 API 서버에서 소비되어 Ray 클러스터 UI에 표시됩니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-19-RayInfrastructureatPinterest_4.png" />

## Ray Application Stats

동일한 Grafana 차트를 회사 내 시각화 도구인 Statsboard로 번역했습니다. 또한 Pinterest의 ML 엔지니어에게 유용한 dcgm GPU 메트릭 및 dataloader 메트릭과 같은 더 많은 애플리케이션별 기능을 추가했습니다. 이를 통해 Ray 애플리케이션의 병목 현상과 문제를 식별할 수 있습니다.

<img src="/assets/img/2024-06-19-RayInfrastructureatPinterest_5.png" />

<div class="content-ad"></div>

## Ray Infrastructure Stats

인프라 수준의 모든 메트릭을 모니터링하는 것은 효과적인 모니터링 구현, 알림 생성, 그리고 역사적 데이터를 기반으로 한 SLO/SLA 벤치마킹을 설정하는 데 중요합니다. 예를 들어, 레이 클러스터 대기 시간의 종단 간 추적 및 레이 작업의 롤링 성공률 모니터링은 시스템 성능을 평가하고 유지하는 데 중요합니다. 또한, 레이 클러스터 프로비저닝 실패로 이어질 수 있는 플랫폼 측의 오류를 식별하는 것은 운영 효율을 유지하는 데 중요합니다.

![Ray Infrastructure](/assets/img/2024-06-19-RayInfrastructureatPinterest_6.png)

# 개발 및 운영 인터페이스

<div class="content-ad"></div>

핀터레스트에서 Ray 애플리케이션을 개발하는 세 가지 옵션을 제공합니다. Dev 서버, 주피터, Spinner 워크플로우가 있습니다. 모든 옵션은 ML 플랫폼의 RESTful API를 사용하여 구동됩니다.

![이미지](/assets/img/2024-06-19-RayInfrastructureatPinterest_7.png)

![이미지](/assets/img/2024-06-19-RayInfrastructureatPinterest_8.png)

Airflow에서 PythonOperator를 활용하여 사용자가 작업 구성을 제공하고, 우리는 그것을 MLP 서버로 향하는 RayJob 요청으로 변환하는 사용자 정의 연산자를 구성합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-RayInfrastructureatPinterest_9.png)

# 테스트

유닛 테스트 및 통합 테스트

레이 애플리케이션을 개발할 때 이용할 수 있는 두 가지 유형의 테스트를 제공합니다:


<div class="content-ad"></div>

- Unittest을 사용하는 것을 권장하는 것은 하위 수준 Ray 코어나 Ray 데이터 라이브러리를 활용하는 플랫폼 라이브러리 소유자들에게 좋습니다. 통합 테스트가 적합합니다. Ray 프로그램을 테스트하는 팁을 따르고 동일한 테스트 스위트 내에서 ray 클러스터를 가능한 한 많이 재사용하기 위해 pytest fixtures를 사용합니다.
- 완전한 Ray 작업을 실행하여 코드 변경이나 라이브러리 업데이트로 인해 발생할 수 있는 잘못된 부분을 식별하고 해결하려는 사용자들에게는 통합 테스트가 적합합니다. 비즈니스에 중요한 Ray 응용 프로그램의 건강 상태를 주기적으로 모니터링하기 위해 통합 테스트도 실행합니다.

![Ray Infrastructure at Pinterest](/assets/img/2024-06-19-RayInfrastructureatPinterest_10.png)

## 네트워크 및 보안

Ray는 컴퓨팅 플랫폼으로 개발자가 API를 통해 쉽게 워크로드를 실행할 수 있는 유연성을 제공하지만, 이는 보안 취약점(CVE-2023-48022)으로 이어질 수 있습니다. Shadowray 기사에서 강조하는 것과 같이 Ray 자체가 적절한 인증 및 권한 부여 방법을 제공하지 않기 때문에 Ray 대시보드 API에 액세스 권한이 있는 모든 사용자가 유효성 검사나 제어 없이 원격으로 코드를 실행할 수 있습니다.

<div class="content-ad"></div>

핀터레스트에서는 이 보안 문제를 심각하게 취급하고 적절히 대응했습니다. 우리는 레이 클러스터에 올바른 인증 및 권한 부여가 적용되어야 한다는 것을 확실히 하기 위해 한 발 더 나아갔습니다. 따라서 사용자가 적절한 권한을 갖고 있지 않은 경우 해당 Ray 클러스터를 사용할 수 없도록 했습니다.

그러나 이 문제의 복잡성은 핀터레스트의 연방 쿠버네티스 클러스터 아키텍처로 인해 더욱 악화되었는데, 이는 군집 간 기능을 군집 내 환경에 적용하는 데 어려움을 겪게 했습니다. 예를 들어 K8s 클러스터 간의 입력 및 출력 흐름을 제어하기 위해 NetworkPolicy를 사용할 수 없기 때문에, 하드웨어 가용성을 극대화하기 위해 Pod가 K8s 클러스터 전체에 흩어질 수 있는 경우, 네트워크 격리를 실현하기 위한 대안적인 방법이 필요합니다.

- HTTP: 핀터레스트에서는 쿠버네티스 환경에서 서비스 메쉬로 Envoy를 사용합니다. 레이 대시보드를 Envoy 뒤의 localhost에 배포하고 핀터레스트에서의 인증 및 권한 부여 표준 방식을 따릅니다. 이를 통해 UI에서 사용자를 위한 OAuth 또는 서비스를 위한 mTLS로 레이 대시보드에 액세스 범위를 제한할 수 있습니다.

![이미지](/assets/img/2024-06-19-RayInfrastructureatPinterest_11.png)

<div class="content-ad"></div>

2. gRPC: K8s 환경에서 임의의 Pod이 활성 상태의 Ray Cluster에 연결하는 것을 방지하기 위해, Ray 클러스터 부트스트랩 시에 Ray TLS를 일부 사용자 정의와 함께 이용합니다. 자세히 말하면, 각 Ray 클러스터마다 고유한 쌍(개인 키, 인증서) 인증서 기관(CA)를 생성합니다. 이를 통해 CA와 특정 Ray 클러스터 간에 1:1 매핑을 보장합니다. 상호 인증의 첫 번째 단계는 클라이언트(Ray Pods)의 접근을 해당 CA로 제한하여 서버 측에서 적절한 AuthN / AuthZ로 수행함으로써 완료됩니다. 이렇게 함으로써 특정 Ray 클러스터를 나타내는 해당 CA에 의해 서명된 인증서를 수령할 수 있는 Pod의 하위 집합만 이를 수행할 수 있습니다. 두 번째 단계는 발급된 인증서를 사용하여 통신하는 Pod들이 예상된 Ray 클러스터에 해당하는 CA에 의해 서명되었는지 확인하는 것입니다. 게다가, Ray Pods에 대한 잎 인증서의 서명 및 발급에 대한 모든 암호화 작업은 클라이언트, 즉 Ray head 및 worker pods이 CA 개인 키에 액세스할 수 없도록 서버 측(MLP 서버)에서 수행되어야 합니다.

![이미지](/assets/img/2024-06-19-RayInfrastructureatPinterest_12.png)

# 교훈

점진적 개선:

<div class="content-ad"></div>

-  단순한 방식으로 Ray 클러스터를 배포한 후에는 프로덕션 환경이나 클라우드 환경에서 자동화 및 확장 프로세스에 초점을 맞추세요.
- MVP 개발 시 휠을 재발명할 필요를 최소화하기 위해 회사의 기존 인프라를 활용하세요. 저희는 Kubeflow 오퍼레이터를 활용하며 기존의 ML 특화 인프라 논리는 개발 프로세스를 간소화할 수 있습니다.
- 프로토 타입이 완료된 후 회사 전체의 최고 권고 사항에 따라 보안 문제 및 다른 규정 준수 문제 등 인프라를 개선하세요.
- 고객과 정기적으로 회의를 진행하여 도전 과제 및 개선 영역에 대한 초기 피드백을 수집하세요.
- Pinterest의 Ray 이니셔티브의 현재 성공을 고려할 때, ML 전용 K8s 클러스터로 이동할 때 KubeRay 통합과 같은 더 많은 개선 사항을 찾고 있습니다.

클라이언트와 Kubernetes 클러스터 사이의 중간 계층:

- API 서버는 클라이언트와 Kubernetes 간의 다리 역할을 하는 추상화 계층을 제공합니다.
- Ray 클러스터의 생애 주기 이벤트가 Kubernetes에서 사용자 정의 리소스가 제거된 후에도 지속적으로 기록되도록 보장하세요.
- 플랫폼은 비즈니스 로직, 즉 추가 유효성 검사 및 사용자 인증, 인가, 사용자를 위한 Ray 대시보드 API 액세스 제한과 같은 사용자 지정을 구현할 수 있는 기회가 있습니다.
- Ray 클러스터를 제공하는 실제 방법을 분리함으로써 KubeRay 및 전용 K8s 클러스터로 전환하는 것이 훨씬 쉬워지며 앞으로 계획하는 것과 같이 필요에 따라 다른 노드 제공자로 전환할 수 있습니다.

<div class="content-ad"></div>

- 사용자에게 충분한 인프라 관련 정보를 제공하지 않으면 Ray 클러스터 프로비저닝의 실패 또는 지연과 관련된 혼란이 발생할 수 있습니다.
- 동시에 수십 개 또는 수백 개의 Ray 클러스터를 운영하려면 플랫폼 측에서 모니터링 및 경보가 중요합니다. Ray 인프라의 초기 단계에 있으며 신속한 변화로 애플리케이션 측에 장애가 발생할 수 있으므로 경보 설정에 성실해야 하며 프로덕션 환경으로 배포하기 전에 스테이징 환경에서 철저한 테스트를 수행해야 합니다.

# 사용법

우리는 2023년 2분기부터 Ray 인프라 사용량을 수집하기 시작했고, 지난 마일스톤 데이터 처리 응용 프로그램 GA 및 추가 사용자들이 Ray 프레임워크에 참여하면서 2023년 4분기에 급증을 관찰했습니다. 우리는 현재 배치 추론 및 adhoc Ray Serve 개발과 같은 다양한 Ray 응용 프로그램을 탐색하기 위해 Ray 기반으로 이전한 사용자들에게 도움을 주고 있습니다. 우리는 아직 네이티브 PyTorch 기반 애플리케이션에서 Ray 기반 애플리케이션으로 이동하는 초기 단계에 있으나, 더 고급화된 사용 사례로 전환하기 위해 고객들과 열심히 협력하고 있습니다.

<img src="/assets/img/2024-06-19-RayInfrastructureatPinterest_13.png" />

<div class="content-ad"></div>

아래는 Markdown 형식으로 표로 변환하였습니다.


| 파일 | 이미지 |
|:-------------------------:|:-------------------------:|
| 2024-06-19-RayInfrastructureatPinterest_14.png | <img src="/assets/img/2024-06-19-RayInfrastructureatPinterest_14.png" /> |
| 2024-06-19-RayInfrastructureatPinterest_15.png | <img src="/assets/img/2024-06-19-RayInfrastructureatPinterest_15.png" /> |


# 사용 사례

Ray 인프라는 제품 ML 사용 사례에 대해 배포되었으며 새로운 응용 프로그램의 신속한 실험을 위해 사용되었습니다.

<div class="content-ad"></div>

## Ray Train

- 여러 추천 시스템 모델 교육이 Ray로 이관되었으며, 나머지 사용 사례를 적극적으로 도입 중입니다.
- 현재 Ray를 사용하여 매월 5000개 이상의 교육 작업을 실행 중입니다.
- 이러한 교육 실행은 이질적인 CPU / GPU 클러스터를 활용합니다.

## 핵심 이점:

확장성:

<div class="content-ad"></div>

- Ray는 교육 실행을 가능한 서로 다른 교육기 인스턴스를 넘어 데이터 로딩 및 전처리를 확장할 수 있도록 합니다.
- p4d.24xlarge와 같은 단일 GPU 노드는 고정된 12:1 CPU:GPU 비율을 가지고 있어 데이터 로더를 확장하고 GPU를 포화시키는 것을 방해합니다.
- Ray를 사용하면 p4d 인스턴스 외부에서 데이터 로더를 확장할 수 있습니다. 이는 CPU만 있는 인스턴스를 사용하여 더 저렴하게 처리할 수 있습니다.

Dev-velocity

- 확장성 이외에도 Ray는 개발 속도를 크게 높일 수 있습니다.
- 머신 러닝 엔지니어들의 일상적인 작업 중 상당 부분은 모델 변경을 구현하고 로컬 코드를 사용하여 개발 훈련을 실행하는 것입니다.
- Ray를 사용하면 Ray 컴퓨팅 클러스터를 상호작용적으로 사용하여 주피터 노트북을 통해 작업을 제출할 수 있습니다.

## 일괄 추론

<div class="content-ad"></div>

- Pinterest는 과거 PySpark 기반의 일괄 추론 솔루션을 활용했습니다.
- Ray를 사용하여, ray.data.Dataset에서 map_batches 구현으로 설계된 새 BatchInference 솔루션을 재구현했습니다.
- 우리는 현재 이 솔루션을 세 가지 프로덕션 유즈 케이스에 사용하고 있습니다.
- 현재 우리는 Ray를 사용하여 매달 300개 이상의 일괄 추론 작업을 실행 중입니다.

## 핵심 이점:

효율성:

- 이전 구현과는 달리, Ray는 전처리, GPU 추론 및 출력 파일 쓰기의 파이프라이닝을 가능케 합니다.
- 더불어, 자동으로 이 세 단계를 이종 CPU 및 GPU 노드에서 실행할 수 있게 분리할 수 있습니다.
- 이들을 합쳐, 우리의 프로덕션 GPU 추론 작업의 작업 실행 시간이 4배 감소했습니다 (1시간 → 15분).

<div class="content-ad"></div>

Unlocked Opportunity:

- Ray와 함께 프로그래밍하는 쉬움과 파이프라이닝으로 얻는 효율성 덕분에 GPU 기반 모델에 대한 특성 소거 도구를 채택할 수 있었습니다.

## 실험적 워크로드

- Ray는 Ray Serve를 포함한 다양한 도구 생태계를 제공합니다.
- Ray Serve는 모델 서빙을 위한 내장된 라우팅 및 자동 스케일링 기능을 제공하며, 모델을 빠르게 평가하기 위해 매우 편리합니다.
- Ray Serve가 없는 경우 클라이언트는 RPC 서버, 배포 파이프라인, 서비스 검색 및 자동 스케일링을 수동으로 설정해야 합니다.

<div class="content-ad"></div>

## 주요 성과:

- 내부 해커톤에서 팀이 몇 시간 만에 오픈 소스 대규모 모델을 설정하고 사용할 수 있었습니다.
- Ray가 없었다면 이러한 인프라를 구축하는 데 몇 일에서 몇 주가 걸렸을 것입니다.

# 다음 계획

- Pinterest에서 Ray Batch Inference에 대해 깊이 파고들기
- Pinterest에서 Ray Tune
- Pinterest에서 Ray 어플리케이션의 독특한 도전 현황

<div class="content-ad"></div>

# 인사말

Cloud Runtime Team: Jiajun Wang, Harry Zhang

Traffic Team: James Fish, Bruno Palermo, Kuo-Chung Hsu

Security Team: Jeremy Krach, Cedric Staub

<div class="content-ad"></div>

ML 플랫폼: Qingxian Lai, Lei Pan

Anyscale: Zhe Zhang, Kai-Hsun Chen, SangBin Cho