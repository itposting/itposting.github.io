---
title: "쿠버네티스 네트워킹 완벽 가이드 로드 밸런스, BGP, IPVS 등 핵심 기술 탐구하기"
description: ""
coverImage: "/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_0.png"
date: 2024-06-22 00:02
ogImage: 
  url: /assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_0.png
tag: Tech
originalTitle: "Deciphering the Kubernetes Networking Maze: Navigating Load-Balance, BGP, IPVS and Beyond"
link: "https://medium.com/itnext/deciphering-the-kubernetes-networking-maze-navigating-load-balance-bgp-ipvs-and-beyond-7123ef428572"
---


쿠버네티스 세계에서는 매일 ipvs 대 iptables || pureLB 대 metalLB || overlay 대 underlay || Nodeport 대 Loadbalance와 같은 용어가 자주 들려옵니다. 이런 정보들을 다양한 소스에서 얻어서 하나로 묶는 것은 정말 어렵습니다. 그래서 저는 여기서 그것을 해냈습니다.

이 질문에 대한 답을 아시나요?
네트워킹 측면이 모두 어떻게 관리되는가요?
pureLB가 CNI에 어떻게 연결되는가요?
ClusterIP 서비스가 IPVS에 어떻게 연결되는가요?
Nodeport를 사용했을 때 netstat으로 열린 포트를 볼 수 없는 이유는 무엇일까요?

# 모든 것의 큰 그림

저는 머릿 속에 20개의 웹사이트와 기사를 모두 정리해서 쿠버네티스 네트워킹을 이해하는 것이 어려웠지만, 그걸 해냈고, 여러분에게 더 쉽게 이해시킬 수 있기를 바랍니다.

<div class="content-ad"></div>

제가 말씀드릴 주제는 이러한 주제들이 Kubernetes와 어떻게 연결되어 있는지 보고 통합되어 있는지를 알아보겠습니다.
로드 밸런싱, ipvs, iptables, BGP, 브릿지, CNI, PureLB, 엔드포인트, 서비스, 오버레이, 언더레이, ipip, kube-proxy, 인그레스 컨트롤러.

빠르고 단계별로 진행해 봅시다:

# 1- CNI, LB 컨트롤러와 Kube-proxy의 관계

CNI: 각 컨테이너에 대한 네트워크 인터페이스를 생성하고 구성하여 Kubernetes 네트워킹을 구성합니다. Kubelet은 CNI를 호출하여 네트워크 인터페이스를 설정하고 IP 주소를 할당합니다.


<div class="content-ad"></div>

CNI는 2가지 모델에서 작동합니다:
- 캡슐화(overlay)
- 비캡슐화(underlay)

- 캡슐화(overlay): VXLAN 및 IPSEC와 같은 기술을 나타냅니다. 이는 여러 Kubernetes 노드에 걸칠 수 있는 레이어-3 네트워킹의 레이어-2입니다. 레이어-2는 격리되어 있어 라우팅 배포가 필요하지 않습니다. IP 패키지를 제공하는 IP 헤더를 생성합니다. 이 모델은 워커와 파드를 연결하는 브리지를 제공합니다. 통신을 관리하는 요소는 CRI입니다.

![이미지](/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_0.png)

- 비캡슐화(underlay): 컨테이너 간에 패킷을 라우팅하기 위한 L3 네트워크를 제공합니다. BGP를 사용하여 라우팅 정보를 분배하기 위해 워커가 필요합니다. 이 모델은 워커 사이에 네트워크 라우터를 확장하는 것을 포함합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_1.png)

LB-controller: MetalLB, PureLB,...은 Kubernetes의 LoadBalancer 서비스 유형의 기능을 제공합니다.
로드 밸런서(LB) 서비스를 생성할 때 할당된 외부 IP는 기본 인터페이스 아래에 보조 주소로 생성됩니다. 이는 BGP BIRD 라우터가 IP를 캡처하고 경로, 주소 및 기타 구성을 추가할 수 있게 합니다.

새로운 IP가 할당되면:

![이미지](/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_2.png)


<div class="content-ad"></div>

Kube-proxy: iptables, ipvs 등에서 네트워크 규칙을 유지합니다.
네트워크 정책, NAT, 전방규칙을 추가합니다.

간단한 예를 들어보면:
svc를 생성하면 kube-proxy가 iptables에 규칙을 추가합니다.

이 부분에 대한 요약:

- Kube-proxy: IPTABLES, IPVS 등에서 규칙을 유지합니다.
- CNI: 기본 네트워크에 대한 공통 인터페이스를 제공하고, 트래픽을 원하는 대상으로 라우팅하며, 관련 기능을 수행합니다.
- LB-controller: 부하 분산 기능을 제공하고, 호스트 인터페이스를 업데이트하여 보조 IP 주소를 추가합니다.

<div class="content-ad"></div>

# 2-POD to POD / Container to Container — 단일 노드 (IP 주소 기반)

![링크와 관련된 이미지](/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_3.png)

Custom Bridge (CBR), Veth (가상 이더넷), Ethernet (eth) 및 전체 네트워킹 설정은 containerd, CRI-O, Mirantis 등의 컨테이너 런타임에 의해 처리됩니다. 대부분의 컨테이너 런타임 인터페이스 (CRI)는 Calico, Flannel, Cilium 등의 옵션을 포함하여 목적에 맞게 컨테이너 네트워킹 인터페이스 (CNI) 플러그인을 활용합니다.

Pod 내의 모든 컨테이너는 동일한 네트워크를 공유합니다. 왜냐하면 그들은 동일한 네트워크 네임스페이스 내에 있기 때문이죠.

<div class="content-ad"></div>

"일시 정지(pause) 컨테이너는 Kubernetes에서 네트워킹 및 프로세스간 통신(IPC)을 책임집니다.

각 파드마다 CBR에 Veth가 생성되며, 이 브리지에서 L-2 라우팅이 수행됩니다. 예를 들어, 파드1에서 파드2로의 패킷은 CBR을 통해 전달되며, 이 경우 NAT가 발생하지 않습니다.

# 3- POD to POD / Container to Container — multi node (IP 기반)

![이미지](/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_4.png)"

<div class="content-ad"></div>

각 노드가 동일한 네트워크에 있기 때문에 팟의 IP 주소가 노드 네트워크 전체에서 라우팅됩니다.
- 두 노드 모두 동일한 네트워크에 있습니다. (서로를 볼 수 있음)
- CNI는 각 노드의 각 팟에 대한 라우트를 생성합니다.

Node-1의 CBR에는 pod4의 Mac 주소가 없기 때문에 패킷이 지정된 라우팅 테이블이 있는 인터페이스를 통해 전달됩니다. 이것은 터널, 다른 인터페이스, eth0 등이 될 수 있습니다. 구조에 따라 실제로 달라집니다.

Kubernetes의 각 노드는 자체 CIDR을 갖고 있어 올바른 노드로 트래픽을 라우팅할 수 있습니다.

# 4- POD to POD / Container to Container — multi node (Service IP addr based)

<div class="content-ad"></div>


![Image](/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_5.png)

서비스에 관한 경우, IPTABLES/IPVS가 중요한 역할을 합니다. Netfilter에서, 서비스 IP 주소는 무작위로 관련 pod IP 주소로 변경됩니다(로드 밸런싱 알고리즘에 따라). Kube-proxy는 Netfilter 규칙을 업데이트하고 pod IP 주소를 서비스에 할당하는 책임이 있습니다.

노드가 svc 목적지를 갖는 패킷을 받을 때, Netfilter에서 규칙이 서비스와 일치하고 대상 pod IP 주소로 경유됩니다.

그렇다면, 그 과정이 어떻게 이루어지는 걸까요?


<div class="content-ad"></div>

서비스는 서비스 선택기에 지정된 파드 레이블과 일치하여 엔드포인트 슬라이스를 업데이트합니다. 선택기가 파드의 레이블과 일치하면 IP 주소, 포트, 프로토콜 등과 같은 관련 정보가 검색되어 서비스와 관련된 엔드포인트 슬라이스에 주입됩니다.

# 큰 그림에 대비 준비 되셨나요? 준비 되셨다면 이제 시작하세요.

<img src="/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_7.png" />

<div class="content-ad"></div>

이 그림에는 CNI (Calico), IPVS, PURELB, IPIP (overlay) 및 인그레스 컨트롤러가 모두 함께 구현되어 있으며 각각의 역할이 있습니다.

Calico: Calico에 의해 모든 네트워킹이 처리됩니다. 오버레이 (IPIP) 및 언더레이 (BGP).

- 이전에 언급한 바와 같이 모든 파드 IP 주소는 이 경우에는 kube-ipvs 브리지 인터페이스인 CBR에 할당됩니다.
- 각 파드는 자체 가상 인터페이스를 갖습니다.
- tunl0 (IPIP)은 가상 인터페이스로, 오버레이 아키텍처로 노드를 서로 연결합니다. 이는 모든 파드의 IP 주소가 이 터널을 통과한다는 것을 의미합니다.
- PureLB는 로드 밸런서(LB) 컨트롤러이며 kube-lb0를 가상 인터페이스로 구현하여 호스트 네트워크를 관리하며, 호스트 기본 인터페이스에 LB IP 주소를 추가로 할당합니다.
- PureLB는 BGP, OSPF와 같은 라우팅 프로토콜과 호환됩니다. 이미 Calico에 의해 구현된 BGP BIRD 라우터가 있기 때문에, PureLB는 이를 인식하고 다른 BGP 라우터를 구현하지 않습니다.
- BGP는 인터페이스에 할당된 모든 IP 주소를 수집하고 이를 라우팅 테이블에서 정의합니다.

지금까지, 파드-1에서 다른 노드의 파드-5에 도달하려는 패킷이 있을 때, kube-ipvs가 알지 못하는 것에 대한 답변을 할 수 없어서, 다음 단계는 BGP에 의해 업데이트된 라우팅 테이블입니다. 오버레이 네트워크 아키텍처를 갖고 있기 때문에, 원하는 대상으로 라우팅될 것입니다. 서비스를 호출하면 ipvs 규칙이 작동합니다.

<div class="content-ad"></div>

이제는 IPVS에서 Endpoints, 서비스, NodePort 및 LB가 유일한 규칙임을 알고 있습니다. 그것을 염두에 두고:

![이미지](/assets/img/2024-06-22-DecipheringtheKubernetesNetworkingMazeNavigatingLoad-BalanceBGPIPVSandBeyond_8.png)

저희는 인그레스 컨트롤러를 위한 로드밸런서 유형의 서비스를 가지고 있습니다. 이는 외부에서 인그레스에 접근 가능함을 의미합니다. 이 IP를 호출하면 패킷이 적절한 노드로 이동한 후, IPVS가 그것을 NodePort(NAT)로 전달하여 노드를 통해 경로를 찾아 해당 노드로 이동합니다.

그 후에, NodePort는 ClusterIP와 연관되는데, 이는 인그레스 컨트롤러 팟의 IP 주소를 알고 있습니다. 이 설정은 유용한데, 인그레스 컨트롤러가 패킷을 받는 즉시 정의된 규칙을 기반으로 원하는 서비스로 경로를 설정하고, 그 후 목적지 팟으로 이동하기 때문입니다.

<div class="content-ad"></div>

이 기사의 목표는 각 구성 요소에 대한 철저한 설명을 제공하는 것이 아니었습니다. 대신, 이미 각 개념에 익숙한 사람들을 위해 정보를 통합하여 한 곳에서 포괄적인 개요를 제공하는 데 초점을 맞추었습니다.

저는 여러 출처를 사용했고, 더 많은 정보를 위해 여기에 언급합니다:

https://medium.com/thermokline/comparing-k8s-load-balancers-2f5c76ea8f31

https://medium.com/@seifeddinerajhi/kube-proxy-and-cni-the-hidden-components-of-kubernetes-networking-eb30000bf87a

<div class="content-ad"></div>

[Calico Networking](https://docs.tigera.io/calico/latest/networking/)

[Overview of PureLB](https://purelb.gitlab.io/docs/how_it_works/overview/)