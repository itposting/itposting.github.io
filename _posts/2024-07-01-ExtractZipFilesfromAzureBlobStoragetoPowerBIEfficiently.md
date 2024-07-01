---
title: "Azure Blob Storage에서 Power BI로 Zip 파일 효율적으로 추출하는 방법"
description: ""
coverImage: "/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_0.png"
date: 2024-07-01 17:28
ogImage: 
  url: /assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_0.png
tag: Tech
originalTitle: "Extract Zip Files from Azure Blob Storage to Power BI Efficiently"
link: "https://medium.com/bi3-technologies/extract-zip-files-from-azure-blob-storage-to-power-bi-efficiently-9f85a6f82c90"
---



![image](https://miro.medium.com/v2/resize:fit:1400/1*eeenqDzhFDi7GcVfOvqo8Q.gif)

# 소개

데이터 분석 분야에서, 원시 데이터부터 통찰력 있는 시각화물로 가기까지의 여정은 종종 복잡한 과정입니다. 이 안내서는 Power BI를 Blob Storage와 통합하고 Power Query Editor를 사용하여 파일을 압축 해제하는 방법을 탐구하여 이 과정을 설명합니다. 직접 실습하려면 이 간단한 지침을 따르십시오.

단계 1 - Azure Blob Storage와 안전한 연결 설정:


<div class="content-ad"></div>

Blob Storage와의 연결을 시작하려면 일반적으로 'Get Data' 작업을 먼저 선택합니다.

![이미지](/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_0.png)

Azure를 선택하고 옵션 목록에서 'Azure Blob Storage'를 선택합니다. 원하는 Blob과의 연결은 Blob URL 및 액세스 토큰을 사용하여 설정됩니다. 이 절차를 통해 Blob Storage와의 성공적인 연결이 용이해집니다.

![이미지](/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_1.png)

<div class="content-ad"></div>

연결이 성공적으로 설정되면 아래 이미지가 표시됩니다. 파일 추출을 진행하려면 일반적으로 추가 처리를 위해 '데이터 변환' 옵션을 선택합니다.

![이미지](/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_2.png)

단계 2 - zip 파일에서 데이터 추출:

Power Query Editor는 데이터 압축 해제 프로세스를 처리할 수 있는 기능을 보유하고 있습니다.

<div class="content-ad"></div>

아래 이미지는 변환 데이터 페이지를 보여줍니다. 왼쪽 모서리에는 새로운 쿼리를 만들기 위한 쿼리 섹션이 있습니다. 이 섹션에서 마우스 오른쪽 단추를 클릭한 후 ‘New Query’ 항목 위에 마우스를 올리고 ‘Blank Query’를 선택합니다.

![이미지](/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_3.png)

아래 이미지는 빈 쿼리의 성공적인 생성을 보여줍니다.

![이미지](/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_4.png)

<div class="content-ad"></div>

"이제 코드를 복사하고 빈 쿼리에 붙여넣은 다음 완료를 선택하세요.

단계 3 - 사용자 정의 열 생성:

현재 데이터 세트에서 '열 추가'를 선택한 다음 '사용자 정의 열 함수 호출'을 선택하세요."

<div class="content-ad"></div>

이 함수를 구성할 때는 매개변수를 설정해야 합니다. 이 매개변수에 대해 내보낸 데이터에서 내용 열을 선택하십시오. 이 내용 열에는 압축 해제해야 하는 zip 파일이 포함되어 있어야 합니다.

![이미지](/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_6.png)

새 열에 사용자 정의 함수의 결과가 채워집니다. 아래 이미지에서는 사용자 정의 함수에 의해 생성된 "Files"라는 열이 있습니다.

![이미지](/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_7.png)

<div class="content-ad"></div>

위 이미지에서, 맨 끝에 "파일"이라는 열이 있습니다. "목록"을 클릭하면 zip 폴더에 포함된 모든 파일이 표시됩니다.

아래 이미지는 이전 이미지에서 "목록"이 선택될 때 나타나는 모든 파일의 기록을 보여줍니다.

![파일 레코드](/assets/img/2024-07-01-ExtractZipFilesfromAzureBlobStoragetoPowerBIEfficiently_8.png)

아래 이미지는 zip 파일 내에 포함된 데이터를 보여줍니다.

<div class="content-ad"></div>

Step 4 - 추출된 데이터를 통찰적인 시각화로 변환하기:

데이터를 모델에 로드하고, 이후 데이터를 효과적으로 표현하는 시각화를 생성해주세요. 이 과정은 데이터에서 가치 있는 메트릭 및 중요 통찰을 추출하는 데 도움이 됩니다.

<div class="content-ad"></div>

위의 내용과 유사한 대시보드를 구축하여 데이터를 효과적으로 시각화하세요.

## 코드:

```js
(ZIP 파일) => 
let
    ushort = BinaryFormat.ByteOrder(BinaryFormat.UnsignedInteger16, ByteOrder.LittleEndian),
    uint = BinaryFormat.ByteOrder(BinaryFormat.UnsignedInteger32, ByteOrder.LittleEndian),
    EDOCfn = BinaryFormat.Record([
        ZipContent = BinaryFormat.Binary(Binary.Length(ZIP 파일) - 22),
        Magic = uint,
        DiskNum = ushort,
        CDirectoryDiskId = ushort,
        CDirectoryRecordCountOnDisk = ushort,
        CDirectoryRecordCount = ushort,
        SizeOfCentralDirectory = uint,
        CentralDirectoryOffset = uint,
        CommendLength = ushort
    ]),
    EDOC = EDOCfn(ZIP 파일),
    BeforeCentralDirectory = BinaryFormat.Binary(EDOC[CentralDirectoryOffset]),
    CentralDirectory = BinaryFormat.Length(BinaryFormat.Record(
        [
            ZipContent = BeforeCentralDirectory,
            Items = BinaryFormat.List(BinaryFormat.Record(
                [
                    Magic = uint,
                    CurrentVersion = ushort,
                    MinVersion = ushort,
                    Flags = ushort,
                    CompressionMethod = ushort,
                    FileModificationTime = ushort,
                    FileModificationDate = ushort,
                    CRC32 = uint,
                    BinarySize = uint,
                    FileSize   = uint,
                    FileInfo = BinaryFormat.Choice(
                    BinaryFormat.Record(
                        [
                            Len = ushort,
                            FieldsLen = ushort,
                            FileCommentLength = ushort,
                            Disk = ushort,
                            InternalFileAttr = ushort,
                            ExternalAttr = uint,
                            PosOfFileHeader = uint
                        ]),
                    (fileInfo) => BinaryFormat.Record(
                        [
                            FileName = BinaryFormat.Text(fileInfo[Len], TextEncoding.Ascii),
                            Fields = BinaryFormat.Binary(fileInfo[FieldsLen]),
                            FileComment = BinaryFormat.Text(fileInfo[FileCommentLength], TextEncoding.Ascii),
                            Disk = BinaryFormat.Transform(BinaryFormat.Null, each fileInfo[Disk]),
                            InternalFileAttr = BinaryFormat.Transform(BinaryFormat.Null, each fileInfo[Disk]),
                            ExternalAttr = BinaryFormat.Transform(BinaryFormat.Null, each fileInfo[InternalFileAttr]),
                            PosOfFileHeader = BinaryFormat.Transform(BinaryFormat.Null, each fileInfo[PosOfFileHeader])
                        ])
                    )
                ]), 
                EDOC[CDirectoryRecordCount]
            )
        ]), 
        EDOC[CentralDirectoryOffset] + EDOC[SizeOfCentralDirectory]),  
    Contents = List.Transform(
        CentralDirectory(ZIP 파일)[Items],
            (cdEntry) => 
                let
                    ZipEntry = BinaryFormat.Record(
                    [
                        PreviousData = BinaryFormat.Binary(cdEntry[FileInfo][PosOfFileHeader]), 
                        Magic = uint,
                        ZipVersion = ushort,
                        ZipFlags = ushort,
                        CompressionMethod = ushort,
                        FileModificationTime = ushort,
                        FileModificationDate = ushort,
                        CRC32 = uint, 
                        BinarySize = uint,
                        FileSize   = uint,
                        FileName = BinaryFormat.Choice(
                            BinaryFormat.Record(
                                [
                                    Len = ushort,
                                    FieldsLen = ushort
                                ]),
                            (fileInfo) => BinaryFormat.Record(
                                [
                                    FileName = BinaryFormat.Text(fileInfo[Len], TextEncoding.Ascii),
                                    Fields = BinaryFormat.Binary(fileInfo[FieldsLen])
                                ]) 
                        ),
                        FileContent = BinaryFormat.Transform(
                            BinaryFormat.Binary(cdEntry[BinarySize]), 
                            each Binary.Decompress(_, Compression.Deflate)
                        )
                    ])(ZIP 파일)
                in
                    [FileName=ZipEntry[FileName][FileName], Content=ZipEntry[FileContent]]
    )
in
    Contents
```

<div class="content-ad"></div>

## 코드 설명:

- ZIP 파일 추출: 이 코드는 ZIP 파일의 내용을 추출하는 데 사용됩니다.
- 이진 포맷 정의: 16비트 및 32비트 부호 없는 정수에 대한 이진 포맷을 정의합니다.
- 중앙 디렉터리의 끝 (EDOC) 레코드: 이 코드는 ZIP 파일의 EDOC 레코드를 구성합니다.
- 중앙 디렉터리 읽기: ZIP 파일의 중앙 디렉터리를 읽어 ZIP 파일의 각 파일에 대한 메타데이터를 포함합니다.
- 파일 헤더 읽기: 각 파일에 대해 코드는 파일 헤더를 읽고 파일 이름과 압축된 내용을 추출합니다.
- 내용 압축 해제: 압축된 내용은 그런 다음 Deflate 알고리즘을 사용하여 압축 해제됩니다.
- 레코드 목록 반환: 함수는 최종적으로 각 파일의 파일 이름과 압축 해제된 내용이 포함된 레코드 목록을 반환합니다.
- 효율적인 데이터 추출: 이 과정을 통해 압축 된 파일에서 데이터를 효과적으로 추출 및 변환할 수 있습니다.

# 결론:

Blob 저장소에서 파일을 추출하고 압축 해제하는 데 Power Query Editor를 사용하는 것은 초강력한 데이터 변환기를 사용하는 것과 같습니다. 이는 엉망인 데이터를 깔끔하고 조직적인 형식으로 변환하여 Power BI가 쉽게 이해할 수 있도록합니다. 이는 우리가 명확한 이야기를 전하는 아름다운 차트와 그래프를 만들 수 있도록 도와줍니다. 따라서 이 방법을 사용함으로써, 우리는 기본적으로 데이터가 더 똑똑하게, 더 열심히 일하도록 만드는 것입니다!

<div class="content-ad"></div>

# 회사 소개

Bi3는 호주에서 가장 빠르게 성장하는 기업 중 하나로 인정받고 있습니다. 저희 팀은 전 세계의 주요 기관들을 위해 상당하고 복잡한 프로젝트를 완수해 왔으며, 우수한 성과로 잘 알려진 브랜드를 빠르게 구축하고 있습니다.