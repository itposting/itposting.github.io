---
title: "윈도우에서 UEFI 프로그래밍을 위한 히치하이커 안내서"
description: ""
coverImage: "/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_0.png"
date: 2024-05-27 12:32
ogImage:
  url: /assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_0.png
tag: Tech
originalTitle: "A hitchhiker’s guide to UEFI programming in Windows"
link: "https://medium.com/d-classified/a-hitchhikers-guide-to-uefi-programming-in-windows-7449994a0486"
---

## 왕밍재는 Secure Boot가 활성화된 실제 시스템에 개발한 UEFI 프로그램의 전체 과정을 설명합니다. 그의 안내로 엔지니어들은 UEFI 환경의 다양한 요소를 이해하고 UEFI 프로그램의 실행과 배포에 미치는 영향을 파악할 수 있습니다. 민재는 다양한 실용적 고려 사항을 포함하여 독자들이 다양한 배포 옵션을 평가하는 데 도움을 줍니다.

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_0.png)

# 소개

UEFI (통합 확장 펌웨어 인터페이스) 개발은 대부분 EDK II (EFI 개발 키트 II) 리포를 사용하여 수행됩니다. EFI는 원래 BIOS를 대체하기 위해 Intel 내에서 시작된 프로젝트였습니다. 노력은 1998년 Tiano 프로젝트 내에서 시작되었으며 규격과 이를 구현하는 펌웨어로 이루어져 있습니다. 2004년, Intel은 EFI 펌웨어의 기본 코드를 오픈 소스로 공개했습니다. 2005년, 컴퓨터 산업의 주요 업체들이 UEFI 포럼을 결성하여 특정 규격을 소유하게 되었으며 2006년에 UEFI 2.0 규격을 발표했습니다. 이후 오픈 소스 코드는 EDK로 발전하고 마침내 오늘날의 EDK II로 이어졌습니다. 개발자 커뮤니티인 TianoCore는 GitHub에서 소스 코드를 유지보수합니다.

<div class="content-ad"></div>

Windows에서 UEFI 개발은 예전에는 복잡한 프로세스였습니다. 많은 수동 단계가 필요했죠. UEFI는 사용자 지정 빌드 도구 체인을 구현하며 IDE를 통한 개발을 지원하지 않습니다. 온라인에서 다양한 안내서를 찾을 수 있고 컨테이너를 사용하여 빌드 프로세스가 개선되었지만, 여전히 IDE의 편리함에는 미치지 못합니다. 게다가 UEFI 실행 파일을 설치/배포하는 방법에 대한 충분한 자료가 없으며, Secure Boot를 활성화한 상태에서 실행시키는 방법에 대한 정보는 더 드물죠.

그래서 이 안내서는 이러한 공백을 메우고 UEFI 실행 파일을 배포하려는 사람들에게 도움이 되기를 희망합니다. 개인적인 용도든 제품 환경에서든 UEFI 실행 파일을 배포하려는 분들에게 도움이 될 것입니다.

이 안내서를 읽는 독자들은 다음을 기본적으로 이해하고 있을 것으로 예상됩니다:

- UEFI가 무엇인지
- C 프로그래밍 언어
- Visual Studio IDE

<div class="content-ad"></div>

## 설치 및 빌드

이전에 언급된 개발 도전에 직면하던 중, Windows Internals 저자 중 한 명인 Alex Ionescu는 VisualUefi를 만들어 EDK II의 소스 코드를 Visual Studio 솔루션으로 래핑하였습니다. IDE 내에서 빌드가 이루어지며, EDK II의 사용자 정의 빌드 툴 체인을 완전히 우회합니다. 사용자의 UEFI 실행 파일을 개발하기 위해서는 두 번째 솔루션을 사용합니다.

VisualUefi 저장소의 지침에 따라 진행하세요.

## 실행

<div class="content-ad"></div>

UEFI 실행 파일은 OS에서 직접 실행되지 않고 OS 부팅 전에 있는 UEFI 환경에서만 실행될 수 있습니다. 따라서 VisualUEFI는 QEMU와 EDK II의 OVMF (Open Virtual Machine Firmware) 모듈을 사용하여 펌웨어 실행 환경을 에뮬레이트합니다. VisualUEFI는 UEFI 실행 파일이 일반적인 명령행 실행 파일과 거의 동일하게 실행될 수 있도록 QEMU와 OVMF를 통합합니다.

## EFI 셸에서 실행하기

이 섹션은 VisualUEFI의 단계와 동일하며 스크린샷이 추가되었습니다.

샘플 솔루션에서 Ctrl+F5를 눌러 QEMU를 실행하세요. 이렇게 하면 EFI 셸로 직접 부팅되며 여기서 샘플 UEFI 실행 파일을 실행할 수 있습니다:

<div class="content-ad"></div>


![Screenshot 1](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_1.png)

F5를 사용해도 되지만, 이 방법은 Visual Studio 디버거를 시작하는데 이 경우에는 QEMU 또는 UEFI 실행 파일에 연결할 수 없기 때문에 쓸모가 없습니다.

해결책의 빌드 출력 디렉토리 VisualUefi\samples\x64\Release\은 가상 볼륨으로 fs1:라는 레이블 아래로 탑재됩니다. 이 디렉토리의 내용을 나열하면 Windows에서 볼 수 있는 것과 동일한 파일과 폴더가 표시됩니다:

![Screenshot 2](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_2.png)


<div class="content-ad"></div>

첫째로, UefiDriver.efi를 로드해주세요:

`![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_3.png)`

드라이버가 로드되었는지 확인하려면 devtree -b 명령을 사용하세요. -b 플래그는 출력을 한 번에 한 화면씩 표시합니다. 로딩 전후의 출력을 비교해보세요:

동일한 방식으로 drivers 명령어를 사용할 수도 있습니다.

<div class="content-ad"></div>

어플리케이션을 실행하세요:

![application](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_4.png)

## 새 부팅 옵션에서 실행하기 — 어플리케이션 설치

큐뮤를 실행한 후, 펌웨어 메뉴로 진입할 때까지 Esc 키를 누른 채로 유지하세요. 또는 EFI 셸에서 exit 명령을 입력하여 펌웨어 메뉴로 나갈 수 있습니다.

<div class="content-ad"></div>


![Boot Maintenance Manager](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_5.png)

Select Boot Options.


<div class="content-ad"></div>


![image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_7.png)

Select Add Boot Option.

![image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_8.png)

Select the first option.


<div class="content-ad"></div>


![image 1](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_9.png)

Select UefiApplication.efi.

![image 2](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_10.png)

Enter any description; this will be the display name of the new boot option. The Optional Data field specifies the arguments that are passed to the UEFI executable. Leave it blank as the sample application does not use it.


<div class="content-ad"></div>

변경 사항을 저장하고 펌웨어 메뉴 페이지로 돌아가세요. 부트 매니저 옵션을 선택하세요:

![부트 매니저](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_11.png)

새로 추가된 부팅 옵션이 마지막 항목으로 표시됩니다. 실행하려면 그냥 선택하면 됩니다. 응용 프로그램이 종료되면 사용자는 즉시 펌웨어 메뉴로 돌아가며 출력은 빠르게 지나갑니다. 출력을 유지하려면 응용 프로그램의 코드를 변경해야 합니다.

사용자가 키를 눌러야 응용 프로그램이 돌아올 때까지 기다리도록 하는 방법이 있습니다. 이는 edk2\MdeModulePkg\Library\CustomizedDisplayLib\CustomizedDisplayLibInternal.c의 WaitForKeyStroke 함수를 사용하여 달성할 수 있습니다. 그러나 EDK-II 솔루션에 이 라이브러리가 포함되어 있지 않아 사용할 수 없습니다. Visual Studio 프로젝트를 만들어 새 라이브러리를 빌드하는 것은 본 안내서의 범위를 넘어서므로 지금은 응용 프로그램에 코드를 복제하는 것만으로 충분합니다.

<div class="content-ad"></div>


EFI_STATUS
WaitForKeyStroke(
    OUT  EFI_INPUT_KEY* Key
)
{
    EFI_STATUS  Status;
    UINTN       Index;
    while (TRUE) {
        Status = gST->ConIn->ReadKeyStroke(gST->ConIn, Key);
        if (!EFI_ERROR(Status)) {
            break;
        }
        if (Status != EFI_NOT_READY) {
            continue;
        }
        gBS->WaitForEvent(1, &gST->ConIn->WaitForKey, &Index);
    }
    return Status;
}


호출하는 코드:


Print(L"Press any key to continue...\n");
EFI_INPUT_KEY keyInput;
efiStatus = WaitForKeyStroke(&keyInput);
if (EFI_ERROR(efiStatus))
{
    Print(L"Failed to get keystroke: %lx\n", efiStatus);
    goto Exit;
}


주의할 점: 샘플 응용 프로그램의 코드에 3가지 문제가 있습니다:



<div class="content-ad"></div>

- 94번 라인:

```js
efiStatus = ShellInitialize();
```

이 코드는 EFI 셸에서만 작동합니다. 셸 대신에 우리 애플리케이션을 먼저 실행하고 있기 때문에 ShellInitialize() 호출이 실패할 것입니다.

- 104번 라인:

<div class="content-ad"></div>


```js
efiStatus = ShellOpenFileByName(L"fs1:\\UefiApplication.efi",
```

볼륨 레이블 fs1:이 항상 사용 가능하고 실행 파일이 항상 거기에 저장되어 있다고 가정합니다. 그러나 볼륨 레이블을 할당하는 것은 EFI 셸의 역할이므로 EFI 셸이 없으면 fs1:이 없어지고 ShellOpenFileByName()은 실패할 것입니다.

- 134번째 줄:

```js
efiStatus = gBS->LocateProtocol(&gEfiSampleDriverProtocolGuid, NULL, &sampleProtocol);
```



<div class="content-ad"></div>

샘플 드라이버에 액세스하려고 시도되었지만, 아직 드라이버를 설치하지 않았기 때문에 이 작업도 실패합니다.

코드는 항상 실패 시에 항상 "Exit;"으로 이동하므로 사용자의 키 입력을 읽는 코드를 제일 위에 삽입해야 실행이 보장됩니다.

부트 매니저 UI를 항상 입력해야 하는 것을 피하기 위해 부팅 순서를 EFI 셸 대신 새로운 옵션을 먼저 부팅하도록 변경할 수 있습니다. 그러려면, Boot Maintenance Manager ` Boot Options ` Change Boot Order로 이동하십시오:

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_12.png)

<div class="content-ad"></div>

이 경우에는 애플리케이션이 펌웨어 메뉴 대신 EFI 셸로 종료됩니다. 부팅할 때 부팅 옵션이 EFI_SUCCESS를 반환하면 제어가 펌웨어 메뉴로 돌아가고, 그렇지 않으면 다음 부팅 옵션이 실행되며, 모든 부팅 옵션이 시도될 때까지 EFI_SUCCESS를 반환하거나 모든 부팅 옵션이 소진됩니다(UFI 사양서 섹션 3.1.1 참조). 위에서 언급한 3가지 문제로 인해 애플리케이션은 EFI_SUCCESS를 반환하지 않으므로 펌웨어는 다음 옵션인 UEFI 셸을 실행합니다.

위의 부팅 옵션 처리에 대한 예외 사항은 애플리케이션이 ExitBootServices()를 호출하는 경우에 있습니다. 그러나 이 내용은 이 안내서의 범위를 벗어납니다.

## 새 부팅 옵션에서 실행 - 드라이버 설치

부팅 유지 관리자 페이지에서 드라이버 옵션을 선택하세요:

<div class="content-ad"></div>

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_13.png)

Add Driver 옵션을 선택하세요.

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_14.png)

파일을 사용하여 Add Driver 옵션을 선택하세요.

<div class="content-ad"></div>



![image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_15.png)

Select the first option.

![image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_16.png)

Select UefiDriver.efi.



<div class="content-ad"></div>



![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_17.png)

어떤 설명을 입력하세요; 이는 새 드라이버 옵션의 표시 이름이 될 것입니다. 옵션 데이터 필드는 UEFI 실행 파일에 전달되는 인수를 지정합니다. 샘플 드라이버가 사용하지 않기 때문에 비워 두세요.

로드 옵션 Reconnect 필드는 펌웨어 부팅 관리자 실행 전에로드된 모든 드라이버를 무시하도록 드라이버에게 허용합니다 (UEFI 사양 섹션 3.1.3 참조). devtree 및 drivers 명령의 출력을 상기하세요 - 샘플 드라이버를 제외한 모든 항목은 펌웨어와 함께 제공된 드라이버이며 펌웨어 부팅 관리자 실행 전에 로드되었습니다. 호환성 문제가 발생할 수 있으므로 장치는 하나의 드라이버로 관리되어야 합니다. 샘플 드라이버는 기존 드라이버를 무시하지 않으므로 옵션을 활성화하는 것은 필요하지 않으며 순수한 효과가 없을 것입니다. 이 페이지를 저장하고 나가세요.

펌웨어 부팅 관리자는 부팅 시 부트와 드라이버 옵션을 자동으로 실행하는 펌웨어 구성 요소를 가리킵니다; 사용자가 수동으로 실행할 부트 옵션을 선택하는 부팅 관리자 UI와 혼동하면 안 됩니다. 또한 드라이버 오버라이드를 적용하려면 마지막 드라이버 옵션이 처리된 후 모든 UEFI 드라이버가 시스템에서 연결 해제되고 다시 연결되어야 합니다.




<div class="content-ad"></div>

펌웨어 부트 매니저는 부팅 옵션을 처리하기 전에 모든 드라이버 옵션을 자동으로 처리합니다. 그러므로 부팅 옵션과는 달리 펌웨어 메뉴는 명시적으로 특정 드라이버 옵션을 로드할 수 있는 방법을 제공하지 않습니다. 또한 필요하지 않습니다. 설치된 모든 드라이버 옵션이 로드됩니다.

## EFI 쉘을 통한 수동 설치

펌웨어 메뉴를 사용하는 것 외에도, EFI 쉘에서 bcfg 명령을 사용하여 새로운 부팅 및 드라이버 옵션을 설치할 수 있습니다. 자세한 내용은 도움말 bcfg의 결과를 확인하세요.

펌웨어가 새로운 부팅 옵션 및/또는 드라이버 옵션을 추가할 수 있는 능력을 제공하지 않는 시스템에서 유용합니다. 이는 UEFI 사양 섹션 3에서 정의된 메커니즘 (NVRAM 변수, UEFI 변수로도 불리는)에 따라 옵션이 구현된 방식 때문입니다. 즉, 모든 UEFI 호환 펌웨어는 설명된 방식으로 옵션을 구현하고 처리해야합니다. bcfg는 동일한 메커니즘으로 작동하기 때문에, 펌웨어가 명시적으로 이를 지원하지 않더라도 옵션을 수정할 수 있습니다.

<div class="content-ad"></div>

사실 NVRAM 변수를 직접 수정하여 부팅 및 드라이버 옵션을 설치하거나 수정할 수 있습니다. 그러나 이것은 이 안내서의 범위를 벗어납니다.

## 기존 부팅 옵션에서 실행

부팅 매니저 페이지에서 샘플 애플리케이션 옵션의 장치 경로 설명을 볼 수 있습니다. 그러나 EFI 셸 옵션에는 실행 파일의 이름이 누락되어 있을 수 있습니다:

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_18.png)

<div class="content-ad"></div>

해당 옵션의 Device Path(UEFI 셸에서 fs0: 볼륨 레이블로 할당)로 가리키는 파티션 내용을 나열하면 EnrollDefaultKeys.efi라는 유일한 UEFI 실행 파일만 있는 것을 알 수 있습니다. 이것이 EFI 셸처럼 들리지 않는 것이 분명합니다.

이것이 일어나는 것은 펌웨어 부트 관리자가 모든 탈착 가능 미디어 및 고정 미디어 장치를 열거하고, 각 장치에 대한 부팅 옵션을 만드는 것입니다(UEFI 사양 섹션 13.3에 자세히 설명된 것처럼, 파일 시스템이 FAT인 경우). 이러한 항목을 부팅할 때 펌웨어가 장치 경로에 다음을 추가합니다: \EFI\BOOT\BOOT'machine type short-name'.EFI 여기서 machine type short-name은 PE32+ 이미지 형식 아키텍처를 정의합니다. 가능한 값은:


<div class="content-ad"></div>

PE(Portable Executable) 실행 파일 머신 유형은 Microsoft Portable Executable and Common Object File Format Specification, Revision 6.0에서 정의된 COFF 파일 헤더의 machine 필드에 지정됩니다.

여러 CPU 아키텍처를 지원하기 위해 장치는 \EFI\BOOT\ 하위 디렉터리에 서로 다른 아키텍처용으로 구축된 여러 실행 파일을 저장할 수 있습니다. 자세한 내용은 UEFI 명세의 섹션 3.1.2 및 3.5를 참조하십시오.

따라서 fs0: 내의 모든 .efi를 나열하면 FS0:\efi\boot\ 내에 bootx64.efi가 나타납니다. 이것이 EFI 셸입니다:

![EFI Shell](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_21.png)

<div class="content-ad"></div>

따라서 샘플 애플리케이션에 대해 동일한 방법을 적용할 수 있습니다. VisualUefi\samples\x64\Release\ 하위에 \EFI\BOOT\ 하위 디렉토리를 만들고 샘플 애플리케이션을 복사하여 BOOTx64.efi로 이름을 바꿉니다. 실행하려면 부트 매니저 UI에서 기존 UEFI Misc 장치 옵션을 선택하면 됩니다. 또는 부팅 옵션을 재정렬하여 QEMU가 먼저 부팅하도록 할 수도 있습니다.

이 접근 방식은 UEFI가 탈착식 미디어에서 부팅하는 방법을 지원하는 방식입니다. 예를 들어 Windows 설치 플래시 드라이브를 만들 때 설치 프로그램 실행 파일을 \EFI\BOOT\BOOTx64.efi에 저장합니다. 설치하려면 펌웨어 메뉴에 들어가서 플래시 드라이브에서 부팅 옵션을 선택합니다. 또는 이미 플래시 드라이브를 첫 번째 부팅 옵션으로 구성했다면 시스템은 자동으로 설치 프로그램으로 부팅합니다.

## EFI 셸

셸은 본질적으로 UEFI 펌웨어의 명령 프롬프트 / bash 셸 버전입니다. bash와 동일한 명령어를 지원하며 모든 지원되는 명령을 나열하려면 help 명령을 사용하면 됩니다. 이를 통해 사용자는 OS에 부팅하지 않고 시스템의 파일에 접근하거나 수정할 수 있습니다. UEFI 펌웨어는 기본적으로 FAT 파일 시스템만 지원하므로 셸이 액세스할 수 있는 파일 시스템도 FAT 파일 시스템뿐입니다. 다른 파일 시스템의 지원은 관련 UEFI 드라이버가 설치되고 로드되어 있는지에 따라 달라집니다.

<div class="content-ad"></div>

startup.nsh
쉘을 실행하면 다음과 같은 프롬프트가 나타납니다:

```js
Press ESC in 5 seconds to skip startup.nsh, any other key to continue.
```

셸은 실행할 때마다 startup.nsh를 실행합니다. 셸을 첫 번째 부팅 옵션으로 구성하면(이미 QEMU의 기본값으로 설정되어 있음), 이를 통해 OS에 부팅하지 않고 시스템에서 자동으로 스크립트 작업을 실행할 수 있습니다.

기본적으로 스크립트 파일이 없지만 ESP(EFI 시스템 파티션)의 루트 디렉터리에 직접 만들 수 있습니다. 시험해보려면 셸에서 다음 명령을 입력하세요:

<div class="content-ad"></div>


echo "@echo test startup script" > fs0:\startup.nsh


여기서 ESP의 볼륨 라벨인 fs0:에 스크립트 파일을 만들었어요.

exit 명령어로 셸을 종료하고 다시 실행하세요:

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_22.png)



<div class="content-ad"></div>

## EFI 시스템 파티션 (ESP)

이것은 UEFI 사양에 의해 정의된 특수 파티션이며 UEFI 펌웨어에서 액세스할 수 있습니다. 이것이 무엇인지 궁금하다면, 파티션에 액세스하는 것은 기본 작업이므로 이것이 운영 체제에만 해당되었다는 것을 알아두세요. UEFI가 대체하는 BIOS는 디스크의 전체 파티션에 액세스할 수 없었습니다. BIOS가 디스크에서 액세스 할 수 있는 유일한 요소는 MBR (마스터 부트 레코드) 및 VBR (볼륨 부트 레코드)였는데, 이들은 UEFI에 의해 대체되었습니다.

ESP에는 일반적으로 OS 부트로더 및 / 또는 부트 매니저가 위치합니다. Windows에서는 이 파티션은 디스크 관리.msc에서 볼 수 있듯이 기본적으로 드라이브 문자가 할당되지 않으므로 직접 액세스 할 수 없습니다:

![파티션 예시](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_23.png)

<div class="content-ad"></div>

접근하려면 고정된 명령 프롬프트를 열고 명령 mountvol X: /S를 사용하여 드라이브 문자를 할당하십시오. 여기서 X는 사용되지 않는 드라이브 문자입니다.

Windows 부트 매니저의 위치를 확인하려면:

```js
X:\>dir /b/s *.efi
X:\EFI\Microsoft\Boot\bootmgr.efi
X:\EFI\Microsoft\Boot\memtest.efi
X:\EFI\Microsoft\Boot\bootmgfw.efi
X:\EFI\Microsoft\Boot\SecureBootRecovery.efi
X:\EFI\Boot\bootx64.efi
```

bootmgfw.efi가 Windows 부팅 매니저입니다. 또한 EFI\Boot\bootx64.efi 항목에 주목하세요. 이것은 bootmgfw.efi의 사본이며, bootmgfw.efi가 없거나 손상된 경우 대비 용도로 제공됩니다.

<div class="content-ad"></div>

# Secure Boot

지금까지 모든 UEFI 실행 파일은 Secure Boot가 비활성화된 상태로 실행되었습니다. Secure Boot는 UEFI 펌웨어의 보안 기능으로 신뢰할 수 있는 UEFI 실행 파일만을 실행할 수 있게 합니다. 이를 통해 시스템이 악성 UEFI 실행 파일(예: 부트킷)로부터 안전하게 보호되며, 제품 환경에서 항상 활성화되어야 합니다. 신뢰는 실행 파일의 서명이 승인된 서명 데이터베이스에 있고 금지된 서명 데이터베이스에 없는 것으로 정의됩니다. 서명은 다음 중 하나로 정의됩니다:

- 실행 파일의 SHA-1 Authenticode 해시
- 실행 파일의 SHA-256 Authenticode 해시
- 실행 파일의 SHA-224 Authenticode 해시
- 실행 파일의 SHA-384 Authenticode 해시
- 실행 파일의 SHA-512 Authenticode 해시
- 실행 파일의 SHA-256 Authenticode 해시에 대한 RSA-2048 서명
- 실행 파일의 SHA-1 Authenticode 해시에 대한 RSA-2048 서명
- 실행 파일을 서명한 RSA-2048 키의 모듈러스 (공개 키 지수는 0x10001로 가정)
- 실행 파일을 서명한 키의 DER로 인코딩된 X.509 인증서
- 타임스탬프를 포함하는 더 복잡한 것들

Authenticode 해시가 어떻게 계산되는지에 대한 정보는 Windows Authenticode Portable Executable Signature Format에서 "PE 이미지 해시 계산" 섹션을 참조하십시오. X.509 인증서의 경우에는 UEFI 사양 섹션 8.2.6 및 32.6.3.3에 따라 실행 파일의 서명 인증서가 X.509 인증서 체인의 모든 수준에 존재하는 한 일치가 발견됩니다.

<div class="content-ad"></div>

따라서 샘플 실행 파일이 안전 부팅이 활성화된 상태에서 실행되도록 하려면 이 중 하나의 서명을 안전 부팅 승인된 데이터베이스로 가져와야 합니다. 인증서를 사용하는 것이 더 유연한 옵션이며 해당 개인 키로 서명된 모든 실행 파일을 실행할 수 있습니다. 이로 인해 개발 및 테스트 중에 유용한 반복적인 수정 및 실행 파일 재구축이 가능해집니다. 그러나 해시를 사용하는 것보다 안전하지 않습니다. 왜냐하면 개인 키 침해의 위험이 있기 때문입니다.

서명을 설치하려면 펌웨어 메뉴로 이동하십시오:

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_24.png)

장치 관리자를 선택하십시오.

<div class="content-ad"></div>


![Image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_25.png)

Select Secure Boot Configuration.

![Image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_26.png)

The Current Secure Boot State is set to Disabled. This entry is not configurable and is only meant to display the current state. The Attempt Secure Boot option itself is disabled (explained later), and the only option that can be changed is Secure Boot Mode. Change this from Standard Mode and Custom Mode which is the only other option available:


<div class="content-ad"></div>

<table>
  <tr>
    <td><img src="/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_27.png" /></td>
  </tr>
</table>

친구 안전 부팅 옵션을 선택하십시오.

<table>
  <tr>
    <td><img src="/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_28.png" /></td>
  </tr>
</table>

다섯 가지 옵션 각각이 안전 부팅 키 유형에 해당합니다. DB는 승인된 서명 데이터베이스이며 DBX는 금지된 서명 데이터베이스입니다. UEFI 명세서에서 "키"라는 용어를 사용하고 있지만, 각 유형의 "키"에 저장된 항목은 실제로 앞서 언급한 유형의 서명 중 하나입니다. 명세서를 따라서 "키"를 일반적인 서명을 가리키는 용어로 사용하겠습니다. 각 항목을 살펴보면:

<div class="content-ad"></div>

새 키를 등록하거나 기존 키를 삭제할 수 있는 옵션을 볼 수 있습니다. 기존 키 목록을 표시할 옵션은 없지만 삭제 옵션을 사용하여 삭제할 수 있습니다. 이렇게 하면 모든 키가 비어 있는 것을 확인할 수 있습니다. 이것이 안전 부팅을 활성화할 수 없는 이유입니다 — 안전 부팅을 활성화하려면 PK(플랫폼 키)가 있어야 합니다. 우리는 직접 하나 만들 수 있지만, 앞서 EnrollDefaultKeys.efi를 본 것을 기억해보세요.

## 기본 안전 부팅 키 설치

기본 안전 부팅 키를 설치하려면 EFI 셸에서 EnrollDefaultKeys.efi를 실행하십시오. 이 작업은 모든 기존 키를 덮어씁니다:

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_29.png)

<div class="content-ad"></div>

Secure Boot은 PK가 없는 경우 설정 모드에 있습니다. PK를 설치하면 자동으로 Secure Boot가 사용자 모드로 전환됩니다 (UEFI 사양 섹션 32.3 참조, 이에 대해 나중에 자세히 논의할 예정입니다).

셸을 종료하고 다시 Secure Boot 구성을 확인하십시오:

![Secure Boot Configuration](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_30.png)

이제 Secure Boot가 활성화되고 "Attempt Secure Boot" 옵션이 활성화되어 설정되어 있습니다.

<div class="content-ad"></div>

안녕하세요! 다시 Secure Boot Mode를 Custom으로 변경하고 키를 나열해 보겠습니다:

- PK: 이전에 활성화되었던 Enroll PK 옵션이 이제 비활성화되었습니다. 시스템에는 하나의 PK만 있을 수 있기 때문에 그렇습니다.
- KEK: GUID로 명명된 두 항목이 있습니다. 모든 Secure Boot 키는 키의 소유자를 나타내는 SignatureOwner GUID와 연결됩니다:
  - d5c1df0b-1bac-4edf-ba48-08834009ca5a: 이 소유자는 알 수 없습니다.
  - 77fa9abd-0359-4d32-bd60-28f4e78f784b: 이것은 Microsoft입니다 (나중에 설명될 것입니다).
- DB: Microsoft에 속한 두 항목이 있습니다 (나중에 설명될 것입니다).
- DBX: 여기서 키는 유형에 따라 목록으로 그룹화됩니다. 유형이 SHA256인 목록만 한 개 존재합니다. Secure Boot 키의 모든 유형은 유형별 목록에 저장되는데, 이 펌웨어에서는 이 정보를 DBX에 대해서만 보여주기로 결정했습니다. 목록을 선택하면:

  ![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_31.png)

  KEK에 있는 알 수 없는 GUID와 같은 GUID가 나오며, 해시 E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855는 비어 있는 파일의 해시입니다. 이는 아마도 예제로 제공된 것일 것입니다. 최신 시스템에서는 DBX에 알려진 취약한 UEFI 실행 파일의 항목이 포함됩니다. 이러한 실행 파일 및 DBX를 업데이트하기 위한 이진 blob의 목록은 UEFI Forum에서 관리됩니다. Microsoft는 GitHub repo에서 이 목록의 미러를 유지합니다.

<div class="content-ad"></div>

- DBT: 여전히 비어 있습니다.

이제 부팅을 시도해 봅시다:

![부팅 이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_32.png)

EFI 쉘 또는 샘플 응용 프로그램은 서명되지 않았으며, 그 서명 또한 DB에 없기 때문에 이는 예상대로입니다.

<div class="content-ad"></div>

# EFI 서명 인증서 생성

샘플 애플리케이션을 서명하기 위해 먼저 인증서를 생성할 것입니다. Windows SDK에 포함된 명령줄 도구를 사용할 것입니다. 이 도구들은 %programfiles(x86)%\Windows Kits\10\bin\10.0.22621.0\x64\에 위치해 있습니다. 설치된 SDK 버전에 따라 하위 디렉토리의 이름이 다를 수 있습니다.

먼저, 다음 명령을 명령 프롬프트에서 사용하여 개인 키와 해당 인증서를 생성해 보세요:

```js
MakeCert.exe -a sha256 -n "CN=SampleEfiSigner" -r -sv SampleEfiSigner.pvk SampleEfiSigner.cer
```

<div class="content-ad"></div>

출력 파일은 DER 인코딩된 X.509 형식으로 제공되며, 이는 지원되는 DB 서명 유형 중 하나입니다.

옵션에 대한 설명:

- -a 서명의 다이제스트 알고리즘(기본값은 SHA1)
- -n 인증서 소유자 X509 이름
- -r 자체 서명된 인증서 생성
- -sv 서브젝트의 PVK 파일, 존재하지 않는 경우 생성됩니다.

이 명령은 비공개 키 파일을 사용할 비밀번호를 요청하는 팝업 프롬프트를 생성합니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_33.png)

다음으로 임의의 암호를 설정하고 확인을 누르세요.

이렇게 하면 이전 단계에서 설정한 암호를 요청하는 두 번째 프롬프트가 생성됩니다. 이는 자체 서명 작업을 위한 것입니다:

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_34.png)


<div class="content-ad"></div>

MakeCert 명령어의 결과는 다음과 같아야 합니다:

```js
Succeeded;
```

그런 다음 .pvk 파일을 .pfx로 변환하여 signtool에서 UEFI 실행 파일에 서명할 수 있도록 합니다:

```js
pvk2pfx.exe -pvk SampleEfiSigner.pvk -pi <password> -spc SampleEfiSigner.cer -pfx SampleEfiSigner.pfx
```

<div class="content-ad"></div>

`password`를 개인 키 파일의 비밀번호로 바꾸세요. 이 명령은 출력물이 없습니다.

옵션 설명:

- -pvk 입력 PVK 파일 이름
- -pi PVK 파일의 비밀번호
- -spc 입력 SPC 파일 이름
- -pfx 출력 PFX 파일 이름

## UEFI 실행 파일에 서명하기

<div class="content-ad"></div>

이전 도구와 동일한 디렉토리에 있는 signtool을 사용해보세요:

```js
signtool.exe sign /fd sha256 /ac SampleEfiSigner.cer /f SampleEfiSigner.pfx /p <비밀번호> <서명할 efi 파일>
```

`비밀번호`를 개인 키 파일의 비밀번호로 대체하세요. `서명할 efi 파일`은 대상 파일 이름으로 대체하세요. 이 명령은 다음을 출력해야 합니다:

```js
Done Adding Additional Store
Successfully signed: <efiToSign>
```

<div class="content-ad"></div>

옵션 설명:

- /fd 파일 서명에 사용할 파일 다이제스트 알고리즘 (기본값은 SHA1)
- /ac 서명 블록에 추가 인증서 추가
- /f 서명 인증서의 파일. 파일에 개인 키가 없는 경우 "/csp" 및 "/kc"를 사용하십시오.
- /p PFX 파일의 암호

파일의 속성 창을 열어 서명되었는지 확인하세요. 새로운 디지털 서명 탭이 있어야 합니다:

![서명 확인](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_35.png)

<div class="content-ad"></div>

## DB에 인증서 설치하기

SampleEfiSigner.cer 파일을 VisualUefi\samples\x64\Release\ 폴더로 이동하세요. 우리는 이후 펌웨어 메뉴에서 이 파일에 접근해야 합니다. 펌웨어 메뉴에서 DB 옵션으로 이동하고 Enroll Signature를 선택하세요:

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_36.png)

Select Enroll Signature Using File.

<div class="content-ad"></div>

<img src="/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_37.png" />

첫 번째 옵션을 선택하세요.

<img src="/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_38.png" />

SampleEfiSigner.cer를 선택하세요. 여기서 펌웨어는 DER로 인코딩된 X.509 인증서와 UEFI 실행 파일만 지원합니다. 후자의 경우 실행 파일의 SHA-256 Authenticode 해시를 계산하여 서명으로 저장할 것입니다.

<div class="content-ad"></div>

UI가 등록 서명 페이지로 돌아갑니다. 서명 GUID 필드는 서명 소유자의 서명과 일치합니다. 임의의 값 입력하거나 기본값으로 모든 0의 GUID로 남겨 둡니다:

![Enroll Signature](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_39.png)

서명은 이제 삭제 서명 메뉴에 표시됩니다:

![Delete Signature](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_40.png)

<div class="content-ad"></div>

UEFI 실행 파일 자체를 선택했을 경우, 항목 설명은 PKCS7_GUID가 아니라 SHA256_GUID가 됩니다.

다음으로 부팅을 시도해보세요:

![부팅 시도 이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_42.png)

<div class="content-ad"></div>

## 안전한 부팅 보안

펌웨어 UI를 사용하여 서명을 등록하는 것 외에도 UEFI 런타임 서비스 함수 SetVariable()를 통해 프로그래밍 방식으로도 이를 수행할 수 있습니다. 이는 UEFI 실행 파일 및 OS 실행 파일 모두에서 호출할 수 있습니다 (Windows에서는 SetFirmwareEnvironmentVariable()로 노출됩니다). 그런데 여기서 의문이 생깁니다 - 이것이 안전한 방법인가요? Secure Boot가 활성화된 경우, 신뢰할 수 있는 UEFI 실행 파일만 실행되도록 허용되므로 서명을 수정할 수 있어야 합니다. 그러나 OS는 안전하지 않은 코드를 실행할 수 있으며, 악성 코드는 이에 대표적인 예시입니다 - 그들은 그들의 부트킷을 화이트리스트에 추가하거나 DBX에서 취약한 실행 파일을 제거할 수 있습니다. Windows는 SetFirmwareEnvironmentVariable()을 호출하는 것을 특권있는 사용자 (예: 관리자)만 허용하도록 제한하지만, 특권 상승 공격을 통해 여전히 우회될 수 있습니다. 이 때 PK와 KEK가 필요합니다.

Secure Boot가 설정 모드인 경우 (즉, PK가 없는 경우), 사용자는 PK가 없는 제약 없이 펌웨어 UI 또는 SetVariable()을 통해 모든 Secure Boot 키를 수정할 수 있습니다. Secure Boot가 사용자 모드로 진입하면 (즉, PK가 설치된 경우), 사용자는 Secure Boot 키를 계속 펌웨어 UI를 통해 수정할 수 있지만, SetVariable()의 경우, 펌웨어는 쓰여질 데이터가 서명되어야 한다고 요구할 것입니다. 대상 Secure Boot 키는 어떤 서명 키가 필요한지를 결정합니다:

- DB, DBX: PK 또는 KEK에 해당하는 개인 키로 서명
- PK, KEK: PK에 해당하는 개인 키로 서명

<div class="content-ad"></div>

단일 유형의 키로 DB 및 DBX를 안전하게 보호하는 것이 충분했겠지만, Secure Boot 키의 소유권 수준을 구분하기 위해 PK와 KEK 사이에 차이를 두었습니다. PK는 컴퓨터 하드웨어의 OEM이 소유하며 컴퓨터 당 하나뿐입니다. HP 및 Dell의 경우:

![Image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_43.png)

PK의 역할은 KEK의 설치를 제어하는 것입니다. 컴퓨터 당 여러 KEK가 있을 수 있으며, 각각이 DB 및 DBX로 서명을 설치하는 데 신뢰되는 엔티티에 해당합니다. 일반적으로 OEM 및 운영 체제만 해당됩니다. HP 및 Dell의 경우:

![Image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_44.png)

<div class="content-ad"></div>

Windows 시스템의 경우, Microsoft의 KEK는 다음과 같습니다:

- Microsoft Corporation KEK CA 2011
- Microsoft Corporation KEK 2K CA 2023

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_45.png)

2023 CA는 2026에 만료되는 2011 CA를 대체하기 위해 사용됩니다.

<div class="content-ad"></div>

Secure Boot에 대한 자세한 내용은 UEFI 명세서 32장과 Microsoft의 Secure Boot 키 생성 및 관리 문서를 참조하세요.

## 기본값으로 Microsoft 키

웹 사이트 인증서의 경우 신뢰 여부는 Trusted Root 또는 중간 인증서에서의 체인 여부를 확인하는 것만으로 결정됩니다. 이러한 인증서는 종종 OS에 미리 설치되어 있으며 업데이트도 OS에서 처리됩니다.

그러나 Secure Boot와 호환되는 UEFI 실행 파일을 배포하고 싶다면, 서명 인증서를 얻기 위해 찾아갈 수 있는 CA도 없고 실행 파일에 서명할 수 있는 CA도 없습니다.

<div class="content-ad"></div>

Windows의 부팅 관리자(UEFI 애플리케이션)는 기본적으로 세계 제조사들과 협력하여 제품을 제조하는 모든 소매용 PC와 마더보드에 Microsoft의 KEK 및 DB 키가 설치되어 있기 때문에 Secure Boot가 활성화된 상태에서 즉시 실행될 수 있습니다. 모든 사람이 마찬가지로 할 수 있는 능력을 갖고 있는 것은 아니지만, 다행히도 Microsoft는 Windows 드라이버 서명 서비스와 유사한 UEFI 서명 서비스를 제공합니다. 서명된 후에 UEFI 실행 파일은 Windows와 동일한 하드웨어 범위와 호환되는 Secure Boot가 가능해집니다.

이러한 협정은 마이크로소프트가 이름만 다르지 CA 등록인 Secure Boot CA인 것처럼 되어 있고, 이것이 또한 Microsoft의 키가 기본값으로 처리되는 이유이기도 합니다. 앞서 말한 KEK 외에도 Windows 시스템의 DB에는 다음과 같은 인증서가 설치되어 있습니다:

- Microsoft Windows Production PCA 2011
- Windows UEFI CA 2023

![image](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_46.png)

<div class="content-ad"></div>

위의 두 개의 키 중 하나로 Windows 부팅 관리자가 서명되었습니다.

- Microsoft Corporation UEFI CA 2011
- Microsoft UEFI CA 2023

![이미지](/assets/img/2024-05-27-AhitchhikersguidetoUEFIprogramminginWindows_47.png)
모든 타사 UEFI 실행 파일은 위의 두 키 중 하나로 서명됩니다.

<div class="content-ad"></div>

EnrollDefaultKeys.efi를 실행한 후 DB에는 2011년 인증서인 두 개의 항목이 생성되었습니다. 2026년에 만료되는 2011년 인증서를 대체할 2023년 인증서가 있습니다.

UEFI 실행 파일을 직접 서명하는 것 외에도 Microsoft가 할 수 있는 옵션은 다음과 같습니다:

- Microsoft가 UEFI CA 인증서에 연결되는 인증서를 발행하고 이를 OS 업데이트를 통해 DB에 설치합니다.
- 개발자가 제출한 DB 업데이트를 Microsoft가 수락하여 원하는 서명을 설치할 수 있도록 KEK를 사용합니다.

그러나 이러한 옵션들은 악의적인 사용자들이 부팅 킷을 모든 Windows 시스템에 배포하는 더 많은 길을 제공할 수 있습니다 (Microsoft에 요청을 제출할 때 합법적인 개발자로 위장하거나 신뢰할 수 있는 개발자들의 서명 키를 도난당할 수 있음). Microsoft는 분명히 제출자들을 심사하는 책임을 지기를 원하지 않으며, 시스템의 보안과 안정성에서 부팅 모듈의 중요성을 고려할 때 Microsoft에게 중요한 것은 다음을 보증하는 것입니다:

<div class="content-ad"></div>

- 해로운 저작물이 아니며 Secure Boot를 우회하는 수단을 제공하지 않습니다 (즉, 서명되지 않은 코드를 실행하지 않음)
- Microsoft의 부팅 모듈과의 호환성 문제를 일으키지 않습니다.

이것이 마이크로소프트가 실행 파일을 제출하도록 요청하는 유일한 옵션인 이유입니다.

이러한 규정은 마이크로소프트가 서명한 UEFI 실행 파일에서 취약점이 발견된 경우 해당 취약성을 차단하는 유일한 방법은 해당 파일의 Authenticode 해시를 DBX에 추가하는 것입니다. 마이크로소프트의 UEFI CA 인증서는 DBX에 추가할 수 없습니다. 그렇게 되면 다른 취약하지 않은 실행 파일도 차단됩니다. Windows 부팅 매니저 (BlackLotus) 및 shim/GRUB2 (Boot Hole)의 취약성으로 인해 DBX에는 수백 개의 항목이 추가되었습니다.

## 키 사용자 정의하기

<div class="content-ad"></div>

더 많은 통제와 보안을 위해, 필요없는 기본 키를 제거하거나 사용자 정의 키를 설치하고 싶을 수 있습니다. UEFI 실행 파일을 Microsoft에 제출하지 않고 싶을 수도 있거나, 단순히 제출할 수 없을 수도 있습니다:

이 모든 것은 대상 컴퓨터의 Secure Boot 키를 사용자 정의하는 것을 의미합니다. 그러나 소매 시스템의 기본 Secure Boot 모드는 사용자 모드(예: PK가 설치됨)이므로, 이러한 변경을 수동으로 접근하는 것이 유일한 방법일 것입니다. 일부 제한된 배포에 대해서는 실행 가능하지만, 대규모 배포(예: 기업)에 대해서는 비현실적할 것입니다 — 모든 시스템을 직접 방문하거나 다시 수집하는 것은 너무 많은 시간과 노력이 필요할 것입니다. 원격으로 변경하는 것은 해당 키 업데이트가 관련 키(PK 또는 KEK)로 서명된 경우에만 가능할 것입니다. 그러나 위에서 설명했듯이, 이러한 요청을 OEM 또는 이 키를 소유한 Microsoft가 보안 문제로 인해 받아들일 가능성은 없을 것입니다.

대안으로 OEM이 키를 사용자 정의하거나 시스템을 전달하기 전에 PK를 제거하는 것이 가능할 수 있습니다; 그러나 이는 추가 비용이 발생하고 이미 전달된 시스템에 해당하지 않을 수 있습니다.

마지막으로, 기본 PK 또는 KEK를 사용자 정의로 대체한다면, 이후 OEM/Microsoft에 의한 KEK 또는 DB/DBX의 모든 업데이트는 실패할 것입니다. 따라서 해당 업데이트를 원한다면, 영향을 받는 컴퓨터에 배포되기 전에 해당 사용자 정의 PK/KEK에 해당하는 개인 키로 서명해야 합니다. 업데이트의 서명 및 설치는 앞서 언급한 signtool.exe 및 PowerShell 명령 Format-SecureBootUEFI 및 Set-SecureBootUEFI를 사용하여 수행할 수 있습니다. 이를 수행하는 방법에 대한 세부 내용은 이 가이드의 범위를 벗어납니다.

<div class="content-ad"></div>

## 실제 시스템에서 실행

QEMU에서 UEFI 실행 파일을 실행하는 데 사용한 모든 방법은 실제 물리적 시스템에서도 적용됩니다. 주의해야 할 차이점은 다음과 같습니다:

- 솔루션의 출력 디렉토리는 시스템에서 볼륨으로 마운트되지 않습니다. 따라서 실행할 실행 파일은 펌웨어에서 액세스 가능한 볼륨에 저장해야 합니다. 이는 ESP, 로컬 FAT 볼륨 또는 FAT 이동식 미디어가 될 수 있습니다.
- BitLocker가 활성화되어 TPM을 키 보호자로 사용하도록 구성되어 있는 경우, Secure Boot를 비활성화하면 시스템이 BitLocker 복구 모드로 이동해야 할 수 있습니다. BitLocker 키를 봉인할 PCR 뱅크가 구성되어 있는 경우에는 심지어 서명된 UEFI 실행 파일이라도 BitLocker 복구 모드가 발생할 수 있습니다. 이는 이 안내서의 범위를 벗어난 이슈입니다. BitLocker 복구 키를 오프라인으로 가용하게 하고 펌웨어 설정을 변경하고 UEFI 실행 파일을 테스트하기 전에 BitLocker를 일시 중지하세요.
- EFI 셸의 가용성은 시스템의 브랜드와 모델에 따라 다릅니다. 존재하는 경우 펌웨어 메뉴에서 액세스할 수 있어야 합니다. 없는 경우, 공식 edk2 릴리스 범위에서 다음과 같은 범위에서 얻을 수 있습니다: [edk2-stable201905, edk2-stable202002]. 이전 버전의 셸은 edk2 리포지토리의 ShellBinPkg 폴더의 일부로 커밋되었습니다. 해당 폴더는 2019년 4월 24일에 제거되었으며 내용은 릴리스 페이지로 이전되었습니다. 최신 버전의 경우 직접 빌드하거나 pbatard/UEFI-Shell과 같은 타사 소스에서 다운로드할 수 있습니다. 모든 edk2 릴리스는 서명되지 않았으며 펌웨어에 내장된 EFI 셸도 서명되지 않을 수 있으므로 이를 실행하려면 Secure Boot를 비활성화하거나 이들의 서명을 DB에 설치해야 합니다.
- 펌웨어 UI 및 사용 가능한 구성은 시스템의 브랜드와 모델에 따라 다를 수 있으므로 Secure Boot를 비활성화하고 새 부팅 및 드라이버 옵션을 추가하는 등 설정을 변경하는 단계도 다를 것입니다.

## 기타 주의 사항

<div class="content-ad"></div>

- VisualUefi 저장소는 더 이상 활발하게 유지되지 않으며 심각하게 오래되었습니다 — 동기화된 edk2 커밋은 2019년이며 openssl의 경우 2018년입니다. 누군가는 수동으로 서브모듈을 원격 최신 커밋으로 업데이트해야 하며, 그런 다음 서브모듈 소스 트리의 변경으로 인해 Visual Studio 프로젝트를 업데이트해야 합니다.
- VisualUefi는 선택된 edk2 라이브러리만 빌드하며 모든 edk2 소스 코드를 포함하지 않습니다. 추가 라이브러리를 포함하려면 새 Visual Studio 프로젝트를 만들어야 합니다.
- UEFI 실행 파일의 디버깅은 라이브 디버깅을 위한 디버거를 연결할 방법이 없어 어려울 수 있습니다. 콘솔에 로깅하는 것이 도움이 될 수 있지만, 대량 로깅이 있는 대규모 프로그램에는 실용적이지 않을 수 있습니다. 로그 파일에 쓰는 것도 해결책이지만, 프로그램이 실행을 완료할 때까지 로그 파일을 조사하기 전까지 기다려야 합니다. 다른 해결책으로는 UEFI 실행 파일을 가상 머신에서 실행하고 호스트에 연결된 파이프로 로깅하는 것이 있습니다. 호스트에서는 파이프의 내용을 읽고 콘솔에 인쇄하는 프로그램을 실행하여 로그를 실시간으로 검토할 수 있습니다. 이를 위해서는 VisualUefi를 수정하여 새 edk2 라이브러리를 빌드하고 edk2 소스 코드를 수정해야 합니다.
