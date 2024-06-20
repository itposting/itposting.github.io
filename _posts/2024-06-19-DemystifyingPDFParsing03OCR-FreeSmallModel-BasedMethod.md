---
title: "PDF 파싱의 신비를 해부하다 03 OCR이 필요 없는 소형 모델 기반 방법"
description: ""
coverImage: "/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_0.png"
date: 2024-06-19 19:16
ogImage: 
  url: /assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_0.png
tag: Tech
originalTitle: "Demystifying PDF Parsing 03: OCR-Free Small Model-Based Method"
link: "https://medium.com/ai-advances/demystifying-pdf-parsing-03-ocr-free-small-model-based-method-c71310988129"
---


PDF 파일을 다른 형식으로 변환하는 것은 도전적일 수 있습니다. 종종 AI 애플리케이션에서 접근할 수 없는 형식에 상당한 정보를 잠그기 때문입니다. 만약 PDF 파일이나 해당 이미지를 기계가 읽을 수 있는 구조화된 또는 반구조화된 형식으로 변환할 수 있다면, 이 문제를 상당히 완화할 수 있을 것입니다. 이는 인공지능 애플리케이션의 지식 베이스를 크게 향상시킬 수도 있습니다.

이 연재는 PDF 구문 분석을 해석하는 데 전념하고 있습니다. 본 시리즈의 첫 번째 기사에서는 PDF 구문 분석의 주요 작업을 소개하고 기존 방법을 분류하며 각 방법에 대한 간략한 소개를 제공했습니다. 그리고 이 시리즈의 두 번째 기사에서는 파이프라인 기반 방법에 초점을 맞췄습니다.

본 기사는 이 시리즈의 세 번째로, PDF 구문 분석에 대한 또 다른 접근 방식을 소개합니다: OCR 없는 소형 모델 기반 방법. 접근 방식을 개괄한 다음, 다양한 대표적인 OCR 없는 소형 모델 기반 PDF 구문 분석 솔루션의 원칙을 소개합니다. 마지막으로, 얻은 통찰과 생각을 공유합니다.

본 기사에서 언급하는 "소형 모델"은 일반적으로 30억 개의 파라미터보다 적은 파라미터를 가질 정도로 상대적으로 작은 모델을 의미합니다.

<div class="content-ad"></div>

# 개요

이전에 소개된 파이프라인 기반 PDF 구문 분석 방법은 주로 텍스트 인식을 위해 OCR 엔진을 사용합니다. 그러나 이는 계산 비용이 높아지고 언어 및 문서 유형에 대한 유연성이 결여되며, 잠재적인 OCR 오류가 후속 작업에 영향을 줄 수 있습니다.

따라서 OCR 없는 방법이 개발되어야 합니다. 이는 그림 1에 설명된 대로 OCR을 명시적으로 사용하지 않습니다. 대신, 신경망을 사용하여 암묵적으로 작업을 완료합니다. 본질적으로 이러한 방법은 끝에서 끝까지 접근 방식을 채택하여 PDF 구문 분석 결과를 직접 출력합니다.

구조적 관점에서 OCR 없는 방법은 파이프라인 기반 방법보다 간단합니다. 관심을 불러일으킬 OCR 없는 방법의 주요 측면은 모델 구조의 설계와 훈련 데이터의 구축입니다.

<div class="content-ad"></div>

다음으로, 몇 가지 대표적인 OCR 미사용 소형 모델 기반 PDF 구문 분석 프레임워크를 소개하겠습니다:

- Donut: OCR 미사용 문서 이해 트랜스포머.
- Nougat: Donut 아키텍처를 기반으로 하며, PDF 문서, 수식 및 표와 같은 문서에서 특히 효과적입니다.
- Pix2Struct: 시각 언어 이해를 위한 사전 교육으로 스크린샷 파싱.

## Donut

그림 2에서 설명한 것처럼 Donut은 문서 이미지를 종합적으로 이해하기 위해 설계된 엔드투엔드 모델입니다. 그 아키텍처는 transformer 기반의 시각 인코더와 텍스트 디코더 모듈로 구성되어 간단합니다.

<div class="content-ad"></div>

도넛은 OCR과 관련된 어떤 모듈에도 의존하지 않습니다. 대신 문서 이미지에서 특징을 추출하기 위해 시각 인코더를 사용하고, 텍스트 디코더를 사용하여 토큰 시퀀스를 직접 생성합니다. 출력된 시퀀스는 JSON과 같은 구조화된 형식으로 변환할 수 있습니다.

다음은 코드입니다:

```js
class DonutModel(PreTrainedModel):
    r"""
    도넛(Donut): OCR 미사용 문서 이해 트랜스포머.
    인코더는 입력 문서 이미지를 임베딩 세트로 매핑하고,
    디코더는 원하는 토큰 시퀀스를 예측합니다. 이는 구조화된 형식으로 변환될 수 있으며,
    프롬프트와 인코더 출력 임베딩이 주어질 때
    """
    config_class = DonutConfig
    base_model_prefix = "donut"

    def __init__(self, config: DonutConfig):
        super().__init__(config)
        self.config = config
        self.encoder = SwinEncoder(
            input_size=self.config.input_size,
            align_long_axis=self.config.align_long_axis,
            window_size=self.config.window_size,
            encoder_layer=self.config.encoder_layer,
            name_or_path=self.config.name_or_path,
        )
        self.decoder = BARTDecoder(
            max_position_embeddings=self.config.max_position_embeddings,
            decoder_layer=self.config.decoder_layer,
            name_or_path=self.config.name_or_path,
        )

    def forward(self, image_tensors: torch.Tensor, decoder_input_ids: torch.Tensor, decoder_labels: torch.Tensor):
        """
        입력 이미지와 원하는 토큰 시퀀스가 주어졌을 때 손실을 계산하고,
        모델은 teacher-forcing 방식으로 훈련될 것입니다.

        Args:
            image_tensors: (batch_size, num_channels, height, width)
            decoder_input_ids: (batch_size, sequence_length, embedding_dim)
            decode_labels: (batch_size, sequence_length)
        """
        encoder_outputs = self.encoder(image_tensors)
        decoder_outputs = self.decoder(
            input_ids=decoder_input_ids,
            encoder_hidden_states=encoder_outputs,
            labels=decoder_labels,
        )
        return decoder_outputs
    ...
    ...
```

## 인코더

<div class="content-ad"></div>

도넛은 초기 문서 구문 분석 연구에서 우수한 성능을 나타낸 Swin-Transformer를 이미지 인코더로 활용합니다. 이 이미지 인코더는 입력 문서 이미지를 고차원 임베딩 집합으로 변환합니다. 이러한 임베딩은 텍스트 디코더의 입력으로 사용될 것입니다.

해당 코드는 다음과 같습니다.

```js
class SwinEncoder(nn.Module):
    r"""
    SwinTransformer를 기반으로 한 도넛 인코더
    사전 훈련된 SwinTransformer를 사용하여 초기 가중치와 구성을 설정한 후, 
    도넛 인코더로 세부 구성을 수정합니다.

    매개변수:
        input_size: 입력 이미지 크기 (폭, 높이)
        align_long_axis: 높이가 폭보다 크면 이미지를 회전할지 여부
        window_size: SwinTransformer의 창 크기(=패치 크기)
        encoder_layer: SwinTransformer 인코더의 레이어 수
        name_or_path: huggingface.co에 등록된 사전 훈련된 모델 이름 또는 로컬에 저장된 모델 이름
                      그렇지 않으면 `swin_base_patch4_window12_384`가 설정될 것입니다(`timm` 사용).
    """

    def __init__(
        self,
        input_size: List[int],
        align_long_axis: bool,
        window_size: int,
        encoder_layer: List[int],
        name_or_path: Union[str, bytes, os.PathLike] = None,
    ):
        super().__init__()
        self.input_size = input_size
        self.align_long_axis = align_long_axis
        self.window_size = window_size
        self.encoder_layer = encoder_layer

        self.to_tensor = transforms.Compose(
            [
                transforms.ToTensor(),
                transforms.Normalize(IMAGENET_DEFAULT_MEAN, IMAGENET_DEFAULT_STD),
            ]
        )

        self.model = SwinTransformer(
            img_size=self.input_size,
            depths=self.encoder_layer,
            window_size=self.window_size,
            patch_size=4,
            embed_dim=128,
            num_heads=[4, 8, 16, 32],
            num_classes=0,
        )
        self.model.norm = None

        # Swin 가중치 초기화
        if not name_or_path:
            swin_state_dict = timm.create_model("swin_base_patch4_window12_384", pretrained=True).state_dict()
            new_swin_state_dict = self.model.state_dict()
            for x in new_swin_state_dict:
                if x.endswith("relative_position_index") or x.endswith("attn_mask"):
                    pass
                elif (
                    x.endswith("relative_position_bias_table")
                    and self.model.layers[0].blocks[0].attn.window_size[0] != 12
                ):
                    pos_bias = swin_state_dict[x].unsqueeze(0)[0]
                    old_len = int(math.sqrt(len(pos_bias)))
                    new_len = int(2 * window_size - 1)
                    pos_bias = pos_bias.reshape(1, old_len, old_len, -1).permute(0, 3, 1, 2)
                    pos_bias = F.interpolate(pos_bias, size=(new_len, new_len), mode="bicubic", align_corners=False)
                    new_swin_state_dict[x] = pos_bias.permute(0, 2, 3, 1).reshape(1, new_len ** 2, -1).squeeze(0)
                else:
                    new_swin_state_dict[x] = swin_state_dict[x]
            self.model.load_state_dict(new_swin_state_dict)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        매개변수:
            x: (배치 크기, 채널 수, 높이, 너비)
        """
        x = self.model.patch_embed(x)
        x = self.model.pos_drop(x)
        x = self.model.layers(x)
        return x
    ...
    ...
```

## 디코더

<div class="content-ad"></div>

도넛은 디코더로 BART를 사용합니다.

```js
class BARTDecoder(nn.Module):
    """
    다국어 BART 기반의 도넛 디코더
    사전 훈련된 다국어 BART 모델의 초기 가중치와 구성을 설정하고,
    이를 도넛 디코더로 수정해 세부 구성을 변경합니다.

    Args:
        decoder_layer:
            BARTDecoder의 레이어 수
        max_position_embeddings:
            훈련할 최대 시퀀스 길이
        name_or_path:
            huggingface.co에 등록되어 있거나 로컬에 저장된 사전 훈련 모델 이름,
            그렇지 않은 경우 `hyunwoongko/asian-bart-ecjk`를 사용합니다 (`transformers`)
    """

    def __init__(
        self, decoder_layer: int, max_position_embeddings: int, name_or_path: Union[str, bytes, os.PathLike] = None
    ):
        super().__init__()
        self.decoder_layer = decoder_layer
        self.max_position_embeddings = max_position_embeddings

        self.tokenizer = XLMRobertaTokenizer.from_pretrained(
            "hyunwoongko/asian-bart-ecjk" if not name_or_path else name_or_path
        )

        self.model = MBartForCausalLM(
            config=MBartConfig(
                is_decoder=True,
                is_encoder_decoder=False,
                add_cross_attention=True,
                decoder_layers=self.decoder_layer,
                max_position_embeddings=self.max_position_embeddings,
                vocab_size=len(self.tokenizer),
                scale_embedding=True,
                add_final_layer_norm=True,
            )
        )
        self.model.forward = self.forward  # 교차 어텐션을 가져오고 `generate` 함수 활용

        self.model.config.is_encoder_decoder = True  # 교차 어텐션을 가져오기 위해
        self.add_special_tokens(["<sep/>"])  # <sep/>은 JSON에서 목록을 나타내는 데 사용됨
        self.model.model.decoder.embed_tokens.padding_idx = self.tokenizer.pad_token_id
        self.model.prepare_inputs_for_generation = self.prepare_inputs_for_inference

        # asian-bart로 가중치 초기화
        if not name_or_path:
            bart_state_dict = MBartForCausalLM.from_pretrained("hyunwoongko/asian-bart-ecjk").state_dict()
            new_bart_state_dict = self.model.state_dict()
            for x in new_bart_state_dict:
                if x.endswith("embed_positions.weight") and self.max_position_embeddings != 1024:
                    new_bart_state_dict[x] = torch.nn.Parameter(
                        self.resize_bart_abs_pos_emb(
                            bart_state_dict[x],
                            self.max_position_embeddings
                            + 2,  # https://github.com/huggingface/transformers/blob/v4.11.3/src/transformers/models/mbart/modeling_mbart.py#L118-L119
                        )
                    )
                elif x.endswith("embed_tokens.weight") or x.endswith("lm_head.weight"):
                    new_bart_state_dict[x] = bart_state_dict[x][: len(self.tokenizer), :]
                else:
                    new_bart_state_dict[x] = bart_state_dict[x]
            self.model.load_state_dict(new_bart_state_dict)

    ...
    ...

    def forward(
        self,
        input_ids,
        attention_mask: Optional[torch.Tensor] = None,
        encoder_hidden_states: Optional[torch.Tensor] = None,
        past_key_values: Optional[torch.Tensor] = None,
        labels: Optional[torch.Tensor] = None,
        use_cache: bool = None,
        output_attentions: Optional[torch.Tensor] = None,
        output_hidden_states: Optional[torch.Tensor] = None,
        return_dict: bool = None,
    ):
        """
        교차 어텐션을 가져오고 `generate` 함수를 활용하기 위한 포워드 함수

        소스:
        https://github.com/huggingface/transformers/blob/v4.11.3/src/transformers/models/mbart/modeling_mbart.py#L1669-L1810

        Args:
            input_ids: (배치 크기, 시퀀스 길이)
            attention_mask: (배치 크기, 시퀀스 길이)
            encoder_hidden_states: (배치 크기, 시퀀스 길이, 히든 크기)

        Returns:
            loss: (1, )
            logits: (배치 크기, 시퀀스 길이, 히든 차원)
            hidden_states: (배치 크기, 시퀀스 길이, 히든 크기)
            decoder_attentions: (배치 크기, 헤드 수, 시퀀스 길이, 시퀀스 길이)
            cross_attentions: (배치 크기, 헤드 수, 시퀀스 길이, 시퀀스 길이)
        """
        output_attentions = output_attentions if output_attentions is not None else self.model.config.output_attentions
        output_hidden_states = (
            output_hidden_states if output_hidden_states is not None else self.model.config.output_hidden_states
        )
        return_dict = return_dict if return_dict is not None else self.model.config.use_return_dict
        outputs = self.model.model.decoder(
            input_ids=input_ids,
            attention_mask=attention_mask,
            encoder_hidden_states=encoder_hidden_states,
            past_key_values=past_key_values,
            use_cache=use_cache,
            output_attentions=output_attentions,
            output_hidden_states=output_hidden_states,
            return_dict=return_dict,
        )

        logits = self.model.lm_head(outputs[0])

        loss = None
        if labels is not None:
            loss_fct = nn.CrossEntropyLoss(ignore_index=-100)
            loss = loss_fct(logits.view(-1, self.model.config.vocab_size), labels.view(-1))

        if not return_dict:
            output = (logits,) + outputs[1:]
            return (loss,) + output if loss is not None else output

        return ModelOutput(
            loss=loss,
            logits=logits,
            past_key_values=outputs.past_key_values,
            hidden_states=outputs.hidden_states,
            decoder_attentions=outputs.attentions,
            cross_attentions=outputs.cross_attentions,
        )
    ...
    ...
```

도넛은 공개적으로 이용 가능한 사전 훈련된 다국어 BART 모델의 가중치를 사용해 초기화합니다.

텍스트 디코더의 출력은 생성된 토큰 시퀀스입니다.

<div class="content-ad"></div>

## 훈련

사전 훈련

사전 훈련의 목표는 다음 토큰 예측의 교차 엔트로피 손실을 최소화하는 것입니다. 이는 이미지와 이전 맥락을 함께 고려함으로써 달성됩니다. 이 작업은 의사 OCR 작업과 유사합니다. 모델은 주로 문서 이미지와 같은 시각적 말뭉치를 통해 시각 언어 모델로 훈련됩니다.

사용된 훈련 데이터는 1100만 장의 스캔된 영어 문서 이미지인 IIT-CDIP입니다. 한편, 다국어 데이터를 생성하기 위해 합성 문서 생성기(SynthDoG)가 사용되었는데, 영어, 중국어, 일본어, 한국어를 포함한 데이터를 생성했습니다. 각 언어 당 50만 장의 이미지가 생성되었습니다.

<div class="content-ad"></div>


![이미지](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_0.png)

생성된 예시는 그림 3에 나와 있습니다. 샘플은 여러 구성 요소로 구성됩니다: 배경, 문서, 텍스트, 레이아웃.

- 배경 이미지는 ImageNet 샘플에서 가져옵니다.
- 문서의 질감은 수집된 종이 사진에서 파생됩니다.
- 단어와 구절은 위키피디아에서 샘플링합니다.
- 레이아웃은 그리드를 무작위로 배치하는 간단한 규칙 기반 알고리즘에 의해 생성됩니다.

또한 다양한 이미지 렌더링 기술을 사용하여 실제 문서를 흉내 냅니다.


<div class="content-ad"></div>

또한, 표 4는 상업용 CLOVA OCR API를 통해 얻은 훈련 데이터의 라벨을 표시하고 있습니다.

![이미지](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_1.png)

## 파인 튜닝

파인 튜닝의 주된 목적은 하류 작업에 적응하는 것입니다.

<div class="content-ad"></div>

예를 들어, 문서 분류 작업에서 디코더는 [START class][memo][END class] 토큰 시퀀스를 생성하는 방식으로 훈련됩니다. 이 시퀀스는 '"class": "memo"'와 같은 JSON 형식으로 직접 변환될 수 있습니다.

# Nougat

누가(Nougat)는 2023년 8월에 소개된 OCR이 필요 없는 end-to-end 작은 모델입니다. Nougat은 이미지의 내용을 직접 파싱할 수 있습니다. Nougat은 문학작품에서 스캔된 이미지나 PDF로 변환된 이미지를 입력으로 받아들이고, 결과를 마크다운 형식으로 출력합니다.

## 모델 아키텍처

<div class="content-ad"></div>

**노가(Nougat)**는 **도넛(Donut) 아키텍처** 위에 개발되었습니다. **도넛 아키텍처**를 기반으로 **신경망**을 통해 텍스트를 인식하며, 그림 5에서 시연된 것처럼 **OCR 관련 입력이나 모듈이 필요 없이** 암묵적으로 작동합니다.

## 교육 데이터셋 구축

**노가(Nougat)** 모델은 특히 혁신적이지는 않으며, 주요 초점은 **대규모 교육 데이터셋**을 구축하는 데 있습니다. 이는 매우 어려운 작업입니다.

**노가(Nougat)**는 이미지와 **마크다운**의 쌍으로 이루어진 대규모 교육 데이터를 생성하여 비용 효율적인 접근 방식을 구현했습니다. 이는 **노가(Nougat)**가 배울 수 있는 가장 중요한 측면입니다.

<div class="content-ad"></div>

데이터 소스

PDF 이미지와 마크다운 쌍을 포함한 대규모 데이터셋이 없어서, Nougat은 세 곳의 소스로부터 데이터셋을 구성했습니다: arXiv, PMC (PubMed Central) 및 IDL (Industry Documents Library), Figure 6에 나와 있습니다.

![Figure 6](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_2.png)

전반적인 프로세스

<div class="content-ad"></div>

ArXiv 데이터는 대부분 TeX 소스 코드가 포함되어 있기 때문에 주로 사용됩니다. 처리 흐름은 도표 7에 나와 있습니다.

도표 7에 설명된 대로, 주요 목표는 기존 자원, 즉 PDF 논문과 해당 TeX 소스 코드를 쌍으로 변환하는 것입니다. 각 쌍은 각 PDF 페이지에 대한 이미지와 해당 Markdown으로 구성됩니다.

입력으로 이미지 가져오기

PDF 페이지의 이미지를 얻는 과정은 비교적 간단합니다. PyPDFium2의 관련 API를 직접 사용하면 됩니다.

<div class="content-ad"></div>

```python
def rasterize_paper(
    pdf: Union[Path, bytes],
    outpath: Optional[Path] = None,
    dpi: int = 96,
    return_pil=False,
    pages=None,
) -> Optional[List[io.BytesIO]]:
    """
    PDF 파일을 PNG 이미지로 래스터화합니다.

    매개변수:
        pdf (Path): PDF 파일의 경로입니다.
        outpath (Optional[Path], optional): 출력 디렉토리입니다. None이면 PIL 이미지가 반환됩니다. 기본값은 None입니다.
        dpi (int, optional): 출력 DPI입니다. 기본값은 96입니다.
        return_pil (bool, optional): 디스크에 쓰는 대신 PIL 이미지를 반환할지 여부입니다. 기본값은 False입니다.
        pages (Optional[List[int]], optional): 래스터화할 페이지입니다. None이면 모든 페이지가 래스터화됩니다. 기본값은 None입니다.

    반환값:
        Optional[List[io.BytesIO]]: `return_pil`이 True인 경우 PIL 이미지, 그렇지 않으면 None입니다.
    """
    pils = []
    if outpath is None:
        return_pil = True
    try:
        if isinstance(pdf, (str, Path)):
            pdf = pypdfium2.PdfDocument(pdf)
        if pages is None:
            pages = range(len(pdf))
        renderer = pdf.render(
            pypdfium2.PdfBitmap.to_pil,
            page_indices=pages,
            scale=dpi / 72,
        )
        for i, image in zip(pages, renderer):
            if return_pil:
                page_bytes = io.BytesIO()
                image.save(page_bytes, "bmp")
                pils.append(page_bytes)
            else:
                image.save((outpath / ("%02d.png" % (i + 1))), "png")
    except Exception as e:
        logging.error(e)
    if return_pil:
        return pils
```

<div class="content-ad"></div>

첫 번째 과제는 각 PDF 페이지에서 이미지로 된 학습 데이터와 해당하는 마크다운 레이블이 함께 있는 것 때문에 마크다운을 페이지별로 구분하는 방법을 찾는 것입니다.

각 논문의 LaTeX 소스 파일이 다시 컴파일되지 않았기 때문에 LaTeX 컴파일러와 같은 방식으로 PDF 파일의 페이지 나누기를 자동으로 결정할 수 없습니다.

이 목표를 달성하기 위해서 현재 사용 가능한 리소스를 활용해야 합니다. 전략은 원본 PDF 페이지의 텍스트와 마크다운 텍스트를 휴리스틱하게 매칭하는 것입니다.

구체적으로는 먼저 PDFMiner를 사용하여 PDF에서 텍스트 라인을 추출하고, 그 다음 텍스트를 전처리하여 페이지 번호와 가능한 헤더 또는 푸터를 제거합니다. 그런 다음 PDF 라인을 입력으로 사용하고 페이지 번호를 레이블로 사용하여 tfidf_transformer 모델을 훈련시킵니다. 이후 훈련된 모델을 적용하여 마크다운을 단락으로 나누고 각 단락에 대해 페이지 번호를 예측합니다.

<div class="content-ad"></div>

```python
def split_markdown(
    doc: str,
    pdf_file: str,
    figure_info: Optional[List[Dict]] = None,
    doc_fig: Dict[str, str] = {},
    minlen: int = 3,
    min_num_words: int = 22,
    doc_paragraph_chars: int = 1000,
    min_score: float = 0.75,
    staircase: bool = True,
) -> Tuple[List[str], Dict]:
    ...
    ...
       if staircase:
            # train bag of words
            page_target = np.zeros(len(paragraphs))
            page_target[num_paragraphs[1:-1] - 1] = 1
            page_target = np.cumsum(page_target).astype(int)
            model = BagOfWords(paragraphs, target=page_target)
            labels = model(doc_paragraphs)

            # fit stair case function
            x = np.arange(len(labels))
            stairs = Staircase(len(labels), labels.max() + 1)
            stairs.fit(x, labels)
            boundaries = (stairs.get_boundaries().astype(int)).tolist()
            boundaries.insert(0, 0)
        else:
            boundaries = [0] * (len(pdf.pages))
    ...
    ...
```

마지막으로 마무리 작업을 합니다.

두 번째 도전 과제는 PDF의 차트가 마크다운 파일의 위치와 정렬되지 않는 것입니다.

이를 해결하기 위해 누가트는 먼저 pdffigures2를 사용하여 차트를 추출합니다. 인식된 제목은 TeX 소스 코드 내의 제목들과 Levenshtein 거리를 기반으로 일치시킵니다. 이 방법을 사용하면 각 그림 또는 표의 TeX 소스 코드 및 페이지 번호를 결정할 수 있습니다. Figure 7의 JSON 구조는 차트 제목과 해당 페이지 번호를 포함합니다.

<div class="content-ad"></div>

마크다운이 개별 페이지로 분할되면 이전에 추출한 차트가 각 해당 페이지의 끝에 다시 삽입됩니다.

```js
def split_markdown(
    doc: str,
    pdf_file: str,
    figure_info: Optional[List[Dict]] = None,
    doc_fig: Dict[str, str] = {},
    minlen: int = 3,
    min_num_words: int = 22,
    doc_paragraph_chars: int = 1000,
    min_score: float = 0.75,
    staircase: bool = True,
) -> Tuple[List[str], Dict]:
    ...
    ...

    # 도표, 표 및 각주 다시 삽입
    figure_tex = list(doc_fig.keys()), list(doc_fig.values())
    if len(doc_fig) > 0:
        iterator = figure_info.values() if type(figure_info) == dict else [figure_info]
        for figure_list in iterator:
            if not figure_list:
                continue
            for i, f in enumerate(figure_list):
                if "caption" in f:
                    fig_string = f["caption"]
                elif "text" in f:
                    fig_string = f["text"]
                else:
                    continue
                ratios = []
                for tex in figure_tex[1]:
                    if f["figType"] == "Table":
                        tex = tex.partition(r"\end{table}")[2]
                    ratios.append(Levenshtein.ratio(tex, fig_string))
                k = np.argmax(ratios)
                if ratios[k] < 0.8:
                    continue
                if f["page"] < len(out) and out[f["page"]] != "":
                    out[f["page"]] += "\n\n" + remove_pretty_linebreaks(
                        figure_tex[1][k].strip()
                    )

    for i in range(len(out)):
        foot_match = re.findall(r"\[FOOTNOTE(.*?)\]\[ENDFOOTNOTE\]", out[i])
        for match in foot_match:
            out[i] = out[i].replace(
                "[FOOTNOTE%s][ENDFOOTNOTE]" % match,
                doc_fig.get("FOOTNOTE%s" % match, ""),
            )

        out[i] = re.sub(r"\[(FIGURE|TABLE)(.*?)\](.*?)\[END\1\]", "", out[i])
    return out, meta
```

# Pix2Struct

Pix2Struct은 순수한 시각 언어 이해를 위해 특별히 설계된 사전 훈련된 이미지 - 텍스트 모델입니다. 또한 많은 하향 작업에 대해 세밀하게 조정할 수 있습니다.

<div class="content-ad"></div>

## 모델 구조

Pix2Struct은 ViT를 기반으로 한 이미지 인코더-텍스트 디코더입니다.

Pix2Struct의 구조는 논문에 그림으로 표시되어 있지 않으며 온라인에서도 찾을 수 없기 때문에, ViT 구조를 기반으로 한 참조 다이어그램을 제공합니다. Figure 8에 나와있는 것과 같이.


![Pix2Struct Architecture](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_3.png)


<div class="content-ad"></div>

일반적인 ViT 방법을 사용할 때 입력 이미지를 미리 정의된 해상도로 조정한 후 고정 크기 블록을 추출하면 두 가지 부정적인 영향을 줄 수 있습니다:

- 문서, 모바일 UI 및 그래픽과 같이 실제 종횡비가 크게 다를 수 있습니다.
- 전달 작업으로 모델을 고해상도로 이동하는 것이 어렵습니다. 이는 모델이 사전 학습 중에 특정 해상도만 본다는 점에서 나타납니다.

따라서 Pix2Struct는 Figure 9에서 보여지는 것처럼 입력 이미지의 종횡비를 보존하는 스케일링을 가능하게 하는 소규모 향상을 도입했습니다.

<img src="/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_4.png" />

<div class="content-ad"></div>

## 사전 훈련 작업

Pix2Struct은 웹 페이지의 가림막이 적용된 스크린샷으로부터 HTML 기반 파싱을 예측하는 작업을 제안합니다.

- 입력을 가리는 것은 그들의 동시 발생에 대한 공동 추론을 장려합니다.
- 간소화된 HTML을 출력으로 사용하는 것은 텍스트, 이미지 및 레이아웃에 대한 명확한 신호를 제공하기 때문에 유리합니다.

![이미지](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_5.png)

<div class="content-ad"></div>

Figure 10에 표시된 것처럼, Pix2Struct에 의해 제안된 스크린샷 구문 분석은 여러 잘 알려진 사전 학습 전략에서 신호를 효과적으로 결합합니다:

- 미권한 부분 복원. 이 작업은 OCR과 유사하며 언어 이해를 위한 기본 기술입니다. Donut에서는 OCR 사전 학습을 위해 합성 렌더링이나 OCR 출력 사용이 제안되었습니다. Figure 10에서 `C++`을 예측하는 것이 이러한 학습 신호의 예입니다.
- 가리기된 부분 복원. 이 작업은 BERT의 가리기된 언어 모델링과 유사합니다. 그러나 시각적 맥락은 종종 추가적인 강력한 단서를 제공합니다. Figure 10에서 `Python`을 예측하는 것은 이러한 유형의 신호의 예입니다.
- 이미지에서 대체 텍스트 복원. 이미지 제목 전략의 사전 학습에 널리 사용되는 방법입니다. 이 접근 방식에서 모델은 웹 페이지를 추가적인 맥락으로 사용할 수 있습니다. Figure 10에 나타난 대로 img alt=C++를 예측하는 것이 이러한 학습 신호를 보여줍니다.

Pix2Struct는 두 가지 모델 변형을 사전 학습했습니다:

- 282백만 개의 매개변수로 구성된 기본 모델.
- 13억 개의 매개변수로 구성된 대형 모델.

<div class="content-ad"></div>

## 사전 훈련 데이터셋

사전 훈련의 목표는 Pix2Struct가 입력 이미지의 기본 구조를 나타내는 능력을 갖추는 것입니다. 이를 달성하기 위해 Pix2Struct는 C4 말뭉치의 URL을 기반으로 자체 감독적인 방식으로 입력 이미지와 대상 텍스트의 쌍을 생성합니다.

Pix2Struct는 HTML 소스 파일과 쌍을 이루는 8000만 개의 스크린샷을 수집했습니다. 이는 총 문서 수의 약 1/3에 해당합니다. 각 스크린샷은 폭이 1024 픽셀이며, 높이는 콘텐츠의 높이에 맞게 조정됩니다. 또한 얻어진 HTML 소스 파일은 단순화된 HTML로 변환될 것입니다.

도표 11은 사전 훈련 데이터의 스크린샷을 보여주며, 실제 값과 예측된 파싱을 함께 제시합니다.

<div class="content-ad"></div>


![image](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_6.png)

## Fine-tuning

Fine-tuning Pix2Struct starts with preprocessing the downstream data. This step guarantees that the image input and text output precisely reflect the task.

![image](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_7.png)


<div class="content-ad"></div>

다운스트림 작업의 예는 그림 12에 나와 있습니다.

전처리에 대해:

- Screen2Words 캡션 작업의 경우 입력 이미지와 출력 텍스트를 직접 사용할 수 있습니다.
- DocVQA 시각적 질문 응답 작업의 경우, Pix2Struct는 다중 모달 모델이 일반적으로 질문을 위한 특수 텍스트 채널을 예약하는 반면 질문을 원본 이미지의 맨 위에 제목으로 직접 제시합니다.
- AI2D와 같은 객관식 답변의 경우, Pix2Struct는 제목의 일부로 질문에 포함하여 제시하기로 선택합니다.

# 통찰과 생각

<div class="content-ad"></div>

대표적인 OCR 무료 솔루션에 대한 소개는 여기까지입니다. 이제 통찰과 생각에 대해 이야기해 봅시다.

## 사전 훈련 작업에 관하여

이미지나 PDF에서 레이아웃, 텍스트, 의미 정보를 종합적으로 이해하기 위해, Donut, Nougat, 그리고 Pix2Struct는 유사한 훈련 작업을 개발했습니다:

- Donut: 이미지 → JSON 형식
- Nougat: 이미지 → Markdown
- Pix2Struct: 마스크 처리된 이미지 → 간소화된 HTML

<div class="content-ad"></div>

우리만의 OCR이 필요 없는 PDF 구문 분석 도구를 개발하려면, 먼저 훈련 작업을 설계해야 합니다. 원하는 출력 형식과 관련된 훈련 데이터를 획득하는 데 어려움이 있는 과제를 고려하는 것이 중요합니다.

## 사전 훈련 데이터에 대해

훈련 데이터는 OCR이 필요 없는 방법에서 중요합니다.

Donut 및 Nougat의 훈련 데이터 획득은 (이미지, JSON) 및 (이미지, Markdown) 쌍이 쉽게 이용 가능하지 않기 때문에 도전적입니다.

<div class="content-ad"></div>

반면에, Pix2Struct은 공개 데이터셋에서 제공된 웹 페이지를 직접 적용하여 데이터 획득을 더 편리하게 만든 것입니다. 그러나 Pix2Struct의 훈련 데이터는 웹 페이지에서 가져왔기 때문에 유해한 콘텐츠를 도입할 수도 있습니다. 이는 특히 다중 모달 모델에 민감할 수 있습니다. Pix2Struct은 아직 이러한 유해 콘텐츠를 다루기 위한 조치를 시행하지 않았습니다.

만일 OCR 없는 PDF 구문 분석 도구를 개발하려고 한다면, 하나의 전략은 훈련을 위한 (입력, 출력) 쌍을 점진적으로 구축하는 데 공개 데이터를 활용하는 것입니다.

뿐만 아니라, 입력 이미지의 적절한 해상도와 하나의 이미지에 포함할 PDF 페이지 수를 결정하는 것도 중요한 고려 사항입니다.

## 성능 관련

<div class="content-ad"></div>

도넛(Donut)과 Pix2Struct은 모두 다양한 하향 작업을 지원하는 일반 사전 학습 모델입니다. 따라서 그들의 평가 방법은 이러한 작업들의 벤치마크에 기반을 두고 있습니다.

Pix2Struct의 실험에 따르면, 그의 성능은 여러 작업에서 도넛보다 크게 우수하며 대부분의 작업에서 최신 기술(SOTA)을 초과합니다. 이는 아래 그림 13에서 보여집니다:

![Figure 13](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_8.png)

그러나, 그림 13에 표시된 작업들은 앞서 우리가 정의한 PDF 구문 분석 작업과는 다릅니다. 이 부분에서 누가(Nougat)가 더 전문적입니다.

<div class="content-ad"></div>

누가트는 마크다운의 전체 생산 과정에 초점을 맞추고 있습니다. 그래서 그 평가 체계는 Figure 14에 나와 있는 편집 거리, BLEU, METEOR 및 F-측정에 의존합니다.

![이미지](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_9.png)

게다가, 누가트는 다른 도구보다 수식과 테이블과 같은 복잡한 요소를 LaTeX 소스 코드로 더 정확하게 파싱할 수 있습니다. 이를 Figures 15와 16에서 확인할 수 있습니다.

![이미지](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_10.png)

<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_11.png)

Furthermore, Nougat can conveniently acquire table captions and associate them with corresponding tables.

## Pipeline-Based vs. OCR-Free

Figure 17 compares the overall architecture and performance of two methods. The upper left illustrates the pipeline-based method, while Donut model is represented on the lower left.


<div class="content-ad"></div>


![Image](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_12.png)

Figure 17의 오른쪽에 나타난 것처럼, 도넛은 파이프라인 기반 방법에 비해 저장 공간을 적게 사용하고 더 높은 정확성을 제공합니다. 그러나 느린 속도로 작동합니다. 다른 OCR 무료 솔루션이 도넛과 유사합니다.

## OCR-Free Small Model-Based Method의 제한사항

- 파이프라인 기반 방법은 여러 모델을 사용하지만 각 모델은 가벼워요. 총 매개변수 수는 OCR 무료 모델보다 중요하게 적을 수 있습니다. 이 요소는 대규모 배포에 대해 도전을 제공할 수 있으며 OCR 무료 모델의 느린 구문 분석 속도로 이어질 수 있습니다. 예를 들어, 작은 모델이지만 Nougat의 매개변수 양은 250MB 또는 350MB입니다. 그러나 Nougat 논문에 명시된대로 생성 속도가 느립니다:


<div class="content-ad"></div>

![이미지](/assets/img/2024-06-19-DemystifyingPDFParsing03OCR-FreeSmallModel-BasedMethod_13.png)

- 이 방법론을 위한 훈련 데이터셋을 구축하는 것은 비용이 많이 듭니다. 큰 규모의 이미지-텍스트 쌍을 구축해야하기 때문입니다. 더구나 더 많은 GPU와 더 오랜 훈련 기간이 필요해 기계 비용이 증가합니다.
- 게다가 엔드 투 엔드 방법은 특정한 나쁜 케이스를 최적화하는 데 어려움이 있어 최적화 비용이 높아집니다. 파이프라인 기반 솔루션에서는 테이블 처리 모듈이 성능을 발휘하지 못할 경우 이 모듈만 최적화가 필요합니다. 그러나 엔드 투 엔드 솔루션에서는 모델 구조를 변경하지 않고 새로운 파인튜닝 데이터를 만들어야 합니다. 이로 인해 다른 시나리오에서 새로운 나쁜 케이스가 발생할 수 있습니다.

# 결론

본 글은 PDF 파싱에서의 OCR을 사용하지 않는 소형 모델 기반 방법에 대한 개요를 제공했습니다. 세 가지 대표적인 모델을 사용해 이 접근 방식을 탐구하며 상세한 소개와 도출된 통찰을 제공했습니다.

<div class="content-ad"></div>

일반적으로 OCR을 사용하지 않는 작은 모델 기반 PDF 구문 분석 방법의 장점 중 하나는 중간 단계에서 발생할 수 있는 잠재적인 손상을 피할 수 있는 일괄 처리 과정입니다. 그러나 그 효과는 다중 모달 모델의 구조와 훈련 데이터의 품질에 크게 의존합니다. 또한 훈련 및 추론 속도가 느려 파이프라인 기반 방법보다는 실용적이지 않습니다. 이 방법의 해석 가능성 역시 파이프라인 기반 방법만큼 강하게 나타나지는 않습니다.

개선이 필요하지만 OCR을 사용하지 않는 접근 방식은 표 및 수식 인식과 같은 영역에서 잘 수행됩니다. 이러한 강점은 우리가 자체 PDF 구문 분석 도구를 구축하는 데 유용한 통찰력을 제공합니다.

PDF 구문 분석이나 문서 인텔리전스에 관심이 있다면 다른 기사를 확인해 보세요.

그리고 최신 기사는 뉴스레터에서 찾을 수 있습니다.

<div class="content-ad"></div>

이 문서에 오류나 빠진 점이 있거나 공유하고 싶은 생각이 있다면 댓글 섹션에서 언급해 주세요.