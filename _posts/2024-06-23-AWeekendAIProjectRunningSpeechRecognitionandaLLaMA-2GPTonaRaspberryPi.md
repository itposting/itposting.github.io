---
title: "주말 AI 프로젝트 라즈베리 파이에서 음성 인식과 LLaMA-2 GPT 실행하는 방법"
description: ""
coverImage: "/assets/img/2024-06-23-AWeekendAIProjectRunningSpeechRecognitionandaLLaMA-2GPTonaRaspberryPi_0.png"
date: 2024-06-23 18:01
ogImage: 
  url: /assets/img/2024-06-23-AWeekendAIProjectRunningSpeechRecognitionandaLLaMA-2GPTonaRaspberryPi_0.png
tag: Tech
originalTitle: "A Weekend AI Project: Running Speech Recognition and a LLaMA-2 GPT on a Raspberry Pi"
link: "https://medium.com/towards-data-science/a-weekend-ai-project-running-speech-recognition-and-a-llama-2-gpt-on-a-raspberry-pi-5298d6edf812"
---


<img src="/assets/img/2024-06-23-AWeekendAIProjectRunningSpeechRecognitionandaLLaMA-2GPTonaRaspberryPi_0.png" />

요즘에는 클라우드에서 딥 러닝 모델을 실행하는 것에는 누구도 놀라지 않을 것입니다. 그러나 엣지나 소비자 기기 세계에서는 상황이 훨씬 복잡해질 수 있습니다. 이에는 여러 가지 이유가 있습니다. 먼저, 클라우드 API를 사용하려면 기기가 항상 온라인 상태여야 합니다. 이는 웹 서비스에는 문제가 되지 않지만 인터넷 액세스 없이 기능을 유지해야 하는 기기에는 결정적인 문제가 될 수 있습니다. 둘째, 클라우드 API는 비용이 들며, 고객들은 또 다른 구독료를 지불하기를 좋아하지 않을 것입니다. 마지막으로 몇 년 후에 프로젝트가 완료되고 API 엔드포인트가 종료되면 비싼 하드웨어는 벽돌처럼 변할 수 있습니다. 이는 고객, 생태계 및 환경에게 친숙하지 않습니다. 그래서 사용자 하드웨어가 완전히 오프라인에서 작동해야 하고 추가 비용 없이 또는 온라인 API를 사용하지 않고 (옵션일 수 있지만 의무적이어서는 안 됨) 이 살기 좋은 상황이 되어야 한다고 확신합니다.

이 기사에서는 Raspberry Pi에서 LLaMA GPT 모델과 자동 음성 인식 (ASR)을 실행하는 방법을 보여드리겠습니다. 이를 통해 Raspberry Pi에 질문을 하고 답변을 받을 수 있게 될 겁니다. 약속한 대로, 이 모든 것이 완전히 오프라인에서 작동할 것입니다.

시작해 보겠습니다!

<div class="content-ad"></div>

이 기사에 제시된 코드는 라즈베리 파이에서 작동되도록 의도되었습니다. 그러나 "디스플레이" 부분을 제외한 대부분의 메소드는 윈도우, OSX 또는 리눅스 노트북에서도 작동할 것입니다. 따라서 라즈베리 파이를 갖고 있지 않은 독자들도 어떠한 문제없이 코드를 쉽게 테스트할 수 있습니다.

## 하드웨어

이 프로젝트에서는 라즈베리 파이 4를 사용할 것입니다. Linux를 실행하는 싱글 보드 컴퓨터로, 작고 팬 및 액티브 쿨링 없이 5V DC 전원만 필요합니다:

![라즈베리 파이](/assets/img/2024-06-23-AWeekendAIProjectRunningSpeechRecognitionandaLLaMA-2GPTonaRaspberryPi_1.png)

<div class="content-ad"></div>

2023년 신제품 라즈베리 파이 5는 더 좋을 것으로 예상됩니다. 벤치마크에 따르면 거의 2배 빨라졌다고 합니다. 하지만 거의 50% 더 비싸며, 저희 테스트에는 모델 4가 충분합니다.

RAM 크기에 대해 두 가지 옵션이 있습니다:

- 8GB RAM이 장착된 라즈베리 파이는 7B LLaMA-2 GPT 모델을 실행할 수 있게 해줍니다. 4비트 양자화 모드에서의 메모리 사용량은 약 5GB입니다.
- 2 또는 4GB 장치는 TinyLlama-1B와 같은 더 작은 모델을 실행할 수 있습니다. 이 모델은 빠르지만, 나중에 살펴볼 것처럼 답변이 약간 덜 "스마트"할 수 있습니다.

두 모델 모두 HuggingFace에서 다운로드할 수 있으며, 일반적으로 코드 변경이 거의 필요하지 않습니다.

<div class="content-ad"></div>

라즈베리 파이는 완전한 리눅스 컴퓨터이며 SSH를 통해 터미널에서 쉽게 출력을 볼 수 있습니다. 하지만 이것은 로봇과 같은 모바일 장치에 적합하지 않아 재미있지 않을 수 있습니다. 라즈베리 파이에는 단색 128x64 I2C OLED 디스플레이를 사용할 것입니다. 이 디스플레이는 연결하기 위해 단지 4개의 전선이 필요합니다:

![Image](/assets/img/2024-06-23-AWeekendAIProjectRunningSpeechRecognitionandaLLaMA-2GPTonaRaspberryPi_2.png)

디스플레이와 전선은 아마존에서 5달러에서 10달러에 구할 수 있으며, 납땜 기술이 필요하지 않습니다. 라즈베리 파이 설정에서 I2C 인터페이스를 활성화해야 합니다. 이에 대한 충분한 자습서가 있습니다. 간단함을 위해 하드웨어 부분은 생략하고 Python 코드에만 집중하겠습니다.

## 디스플레이

<div class="content-ad"></div>

화면 테스트 중에 무언가를 화면에서 확인하는 것이 좋습니다. Adafruit_CircuitPython_SSD1306 라이브러리를 사용하면 OLED 디스플레이에 어떤 이미지든 표시할 수 있습니다. 이 라이브러리는 Low-level 인터페이스를 가지고 있어서 픽셀을 그리거나 메모리 버퍼에서 모노크롬 비트맵만을 그릴 수 있습니다. 스크롤 가능한 텍스트를 사용하기 위해 텍스트 버퍼를 저장하는 배열과 텍스트를 그리는 `_display_update` 메서드를 작성했습니다:

```js
from PIL import Image, ImageDraw, ImageFont
try:
    import board
    import adafruit_ssd1306
    i2c = board.I2C()
    oled = adafruit_ssd1306.SSD1306_I2C(pixels_size[0], pixels_size[1], i2c)
except ImportError:
    oled = None

char_h = 11
rpi_font_poath = "DejaVuSans.ttf"
font = ImageFont.truetype(rpi_font_poath, char_h)
pixels_size = (128, 64)
max_x, max_y = 22, 5
display_lines = [""]

def _display_update():
    """화면에 텍스트를 표시합니다."""
    global oled
    image = Image.new("1", pixels_size)
    draw = ImageDraw.Draw(image)
    for y, line in enumerate(display_lines):
        draw.text((0, y*char_h), line, font=font, fill=255, align="left")

    if oled:
        oled.fill(0)
        oled.image(image)
        oled.show()
```

여기서 (22, 5) 변수는 표시할 수 있는 행과 열의 수를 나타냅니다. oled 변수는 ImportError가 발생하는 경우 None일 수도 있습니다. 예를 들어, 랩톱에서 라즈베리 파이 대신에 이 코드를 실행하는 경우입니다.

또한 텍스트 스크롤링을 에뮬레이션하기 위해 두 개의 도우미 메서드도 작성했습니다.

<div class="content-ad"></div>

```js
def add_display_line(text: str):
    """ 새로운 줄을 추가하고 스크롤링합니다. """
    global display_lines
    # 화면 너비에 따라 텍스트를 청크로 분할합니다.
    text_chunks = [text[i: i+max_x] for i in range(0, len(text), max_x)]
    for text in text_chunks:
        for line in text.split("\n"):
            display_lines.append(line)
            display_lines = display_lines[-max_y:]
    _display_update()

def add_display_tokens(text: str):
    """ 새 토큰을 추가하고 줄바꿈 유무를 선택합니다. """
    global display_lines
    last_line = display_lines.pop()
    new_line = last_line + text
    add_display_line(new_line)
```

첫 번째 메소드는 새로운 줄을 디스플레이에 추가합니다. 문자열이 너무 길면 자동으로 여러 줄로 나눠집니다. 두 번째 메소드는 "개행 없이" 텍스트 토큰을 추가합니다. 이것은 GPT 모델의 답변을 표시할 때 사용할 것입니다. add_display_line 메소드를 사용하여 위와 같은 코드를 작성할 수 있습니다:

```js
for p in range(20):
    add_display_line(f"{datetime.now().strftime('%H:%M:%S')}: Line-{p}")
    time.sleep(0.2)
```

모든 것이 제대로 되었다면, 출력은 다음과 같아야 합니다:

<div class="content-ad"></div>


![image](https://miro.medium.com/v2/resize:fit:1400/1*e9u31X5qtrbHccByJAA8pw.gif)

외부 디스플레이용 Luma-oled와 같은 특별한 라이브러리도 있지만, 우리의 솔루션은 이 작업에 충분히 좋습니다.

## 자동 음성 인식 (ASR)

ASR에 대해, 저희는 HuggingFace 🤗의 Transformers 라이브러리를 사용할 것입니다. 이를 통해 몇 줄의 Python 코드로 음성 인식을 구현할 수 있습니다:


<div class="content-ad"></div>

```js
from transformers import pipeline
from transformers.pipelines.audio_utils import ffmpeg_microphone_live

asr_model_id = "openai/whisper-tiny.en"
transcriber = pipeline("automatic-speech-recognition",
                       model=asr_model_id,
                       device="cpu")
```

여기서는 680K 시간의 음성 데이터로 학습된 Whisper-tiny-en 모델을 사용했어요. 이 모델은 가장 작은 Whisper 모델로, 파일 크기가 151MB에요. 모델을 로드하면 ffmpeg_microphone_live 메서드를 사용하여 마이크에서 데이터를 가져올 수 있어요:

```js
def transcribe_mic(chunk_length_s: float) -> str:
    """ 마이크에서 오디오를 인식합니다 """
    global transcriber
    sampling_rate = transcriber.feature_extractor.sampling_rate
    mic = ffmpeg_microphone_live(
            sampling_rate=sampling_rate,
            chunk_length_s=chunk_length_s,
            stream_chunk_s=chunk_length_s,
        )
    
    result = ""
    for item in transcriber(mic):
        result = item["text"]
        if not item["partial"][0]:
            break
    return result.strip()
```

실제로 구문을 말하기에는 5-10초가 충분해요. 라즈베리 파이에는 마이크가 없지만 USB 마이크를 사용할 수 있어요. 이 코드는 노트북에서도 테스트할 수 있어요; 이 경우 내장 마이크가 사용될 거예요.

<div class="content-ad"></div>

## 대형 언어 모델 (LLM)

이제 대형 언어 모델을 추가해 봅시다. 먼저, 필요한 라이브러리를 설치해야 합니다:

```js
pip3 install llama-cpp-python
pip3 install huggingface-hub sentence-transformers langchain
```

LLM을 사용하기 전에 해당 모델을 다운로드해야 합니다. 이전에 논의했던 것처럼, 두 가지 옵션이 있습니다. 8GB 라즈베리 파이의 경우 7B 모델을 사용할 수 있습니다. 2GB 장치의 경우 1B "작은" 모델이 유일한 선택지이며, 더 큰 모델은 RAM에 들어가지 않습니다. 모델을 다운로드하려면 huggingface-cli 도구를 사용할 수 있습니다:

<div class="content-ad"></div>

```js
huggingface-cli 다운로드 TheBloke/Llama-2-7b-Chat-GGUF llama-2-7b-chat.Q4_K_M.gguf --local-dir . --local-dir-use-symlinks False
OR
huggingface-cli 다운로드 TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf --local-dir . --local-dir-use-symlinks False
```

우리는 Llama-2-7b-Chat-GGUF와 TinyLlama-1.1B-Chat-v1.0-GGUF 모델을 사용하고 있습니다. 더 작은 모델은 빠르게 작동하지만, 더 큰 모델은 잠재적으로 더 나은 결과를 제공할 수 있습니다.

모델을 다운로드하고 나면, 사용할 수 있습니다:

```js
from langchain.llms import LlamaCpp
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser

llm: Optional[LlamaCpp] = None
callback_manager: Any = None

model_file = "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf"  # OR "llama-2-7b-chat.Q4_K_M.gguf"
template_tiny = """<|system|>
                   You are a smart mini computer named Raspberry Pi. 
                   Write a short but funny answer.</s>
                   <|user|>
                   {question}</s>
                   <|assistant|>"""
template_llama = """<s>[INST] <<SYS>>
                    You are a smart mini computer named Raspberry Pi.
                    Write a short but funny answer.</SYS>>
                    {question} [/INST]"""
template = template_tiny


def llm_init():
    """ 큰 언어 모델 로드 """
    global llm, callback_manager

    callback_manager = CallbackManager([StreamingCustomCallbackHandler()])
    llm = LlamaCpp(
        model_path=model_file,
        temperature=0.1,
        n_gpu_layers=0,
        n_batch=256,
        callback_manager=callback_manager,
        verbose=True,
    )


def llm_start(question: str):
    """ LLM에게 질문하기 """
    global llm, template

    prompt = PromptTemplate(template=template, input_variables=["question"])
    chain = prompt | llm | StrOutputParser()
    chain.invoke({"question": question}, config={})
```

<div class="content-ad"></div>

흥미로운 점은 두 모델이 동일한 LLaMA 이름을 갖고 있지만, 다른 프롬프트 형식을 사용하여 훈련되었다는 것입니다.

모델 사용은 간단하지만 여기가 까다로운 부분입니다: OLED 화면에 대답 토큰을 한 번에 하나씩 표시해야 합니다. 이를 위해 사용자 정의 콜백을 사용할 것인데, 이 콜백은 LLM이 새로운 토큰을 생성할 때마다 실행됩니다:

```js
class StreamingCustomCallbackHandler(StreamingStdOutCallbackHandler):
    """ LLM 스트리밍을 위한 콜백 핸들러 """

    def on_llm_start(
        self, serialized: Dict[str, Any], prompts: List[str], **kwargs: Any
    ) -> None:
        """ LLM이 실행을 시작할 때 실행됩니다 """
        print("<LLM 시작>")
        
    def on_llm_end(self, response: Any, **kwargs: Any) -> None:
        """ LLM이 실행을 끝낼 때 실행됩니다 """
        print("<LLM 종료>")
        
    def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        """ 새로운 LLM 토큰이 있을 때 실행됩니다. 스트리밍이 활성화된 경우에만 사용 가능합니다 """
        print(f"{token}", end="")
        add_display_tokens(token)
```

여기서는 이전에 만들었던 add_display_tokens 메서드를 사용했습니다. 출력 메서드도 사용되었기 때문에 똑같은 코드가 라즈베리 파이 없이 일반 PC에서도 실행될 수 있습니다.

<div class="content-ad"></div>

## 테스트

마침내, 모든 부분을 결합할 때입니다. 코드는 간단합니다:

```js
if __name__ == "__main__":
    add_display_line("Init automatic speech recogntion...")
    asr_init()

    add_display_line("Init LLaMA GPT...")
    llm_init()

    while True:
        # Q-A loop:
        add_display_line("Start speaking")
        add_display_line("")
        question = transcribe_mic(chunk_length_s=5.0)
        if len(question) > 0:
            add_display_tokens(f"> {question}")
            add_display_line("")

            llm_start(question)
```

여기서 Raspberry Pi는 오디오를 5초 동안 기록한 후, 음성 인식 모델이 오디오를 텍스트로 변환하고, 마지막으로 인식된 텍스트를 LLM으로 보냅니다. 끝나면 프로세스가 반복됩니다. 이 접근 방식은 예를 들어 자동 오디오 수준 임계값을 사용함으로써 개선할 수 있지만, "주말 프로젝트" 목적으로 충분히 좋습니다.

<div class="content-ad"></div>

실제로는 다음과 같은 출력이 나타납니다:

![image](https://miro.medium.com/v2/resize:fit:1400/1*78EMd_4kEMduoLN8z_pwdA.gif)

여기에서 라즈베리 파이 4에서의 1B LLM 추론 속도를 확인할 수 있습니다. 이전에 언급한 바와 같이, 라즈베리 파이 5는 30~40% 더 빠를 것으로 예상됩니다.

"BLEU"나 "ROUGE"와 같은 "공식적인" 벤치마크를 사용하여 1B와 7B 모델의 품질을 비교하지는 않았습니다. 주관적으로 7B 모델은 더 정확하고 정보를 많이 제공하는 답변을 제공하지만, 더 많은 RAM이 필요하며, 로딩하는 데 더 많은 시간이 걸립니다(파일 크기는 각각 4.6GB와 0.7GB입니다) 그리고 3~5배 더 느리게 작동합니다. 전력 소비에 관해서는, 라즈베리 파이 4는 평균 3~5W를 소비하며, 실행 중인 모델, 연결된 OLED 스크린, USB 마이크로폰이 있는 상태에서 필요합니다.

<div class="content-ad"></div>

## 결론

이 글에서는 라즈베리 파이(Raspberry Pi)에서 자동 음성 인식 및 대형 언어 모델을 실행할 수 있었습니다. 라즈베리 파이는 완전히 자율적으로 실행할 수 있는 휴대용 리눅스 컴퓨터입니다. 클라우드에서 다른 모델을 사용할 수도 있지만, 실제로 만질 수 있고 작동 방식을 볼 수 있는 것이 더 재미있는 것 같아요.

이러한 프로토타입은 GPT 모델 사용에 있어 흥미로운 이정표가 됩니다. 1~2년 전에는 저렴한 소비자용 하드웨어에서 대형 언어 모델을 실행하는 것이 상상도 할 수 없었죠. 우리는 인간의 음성을 이해하고 텍스트 명령에 응답하거나 다양한 작업을 수행할 수 있는 스마트 기기 시대로 진입하고 있습니다. 아마도 향후 TV나 전자레인지 같은 기기에는 아예 버튼이 없을 것이고 우리는 그냥 말로 소통할 것입니다. 영상에서 보듯이 LLM은 아직 조금 느리게 작동하지만, 우리는 모든 사람이 알고 있는 무어의 법칙을 알고 있습니다. 분명히, 5~10년 뒤에는 동일한 모델이 현재 1달러 칩에서 쉽게 실행될 것이며, 현재 우리가 5달러의 ESP32 보드에서 완전한 PDP-11 에뮬레이터(80년대 10만달러 대의 컴퓨터였던 PDP)를 실행할 수 있는 것처럼요.

다음 파트에서는 음성 인식을 위해 푸시 투 토크(Push-to-Talk) 버튼을 사용하는 방법 및 "Rabbit" 스타일의 데이터 처리 인공지능 파이프라인을 구현하는 방법을 소개할 예정이에요. 기대해주세요.

<div class="content-ad"></div>

이야기를 즐겼다면 Medium에 구독해보세요. 나의 새로운 기사가 발행되면 알림을 받을 수 있을 뿐만 아니라, 다른 작가들의 수천 개의 이야기에도 전체 액세스할 수 있습니다. 또한 LinkedIn을 통해 연락할 수도 있습니다. 이 및 다른 게시물의 전체 소스 코드를 얻고 싶다면 Patreon 페이지를 방문해주세요.

언어 모델과 자연어 처리에 관심이 있는 분들은 다른 기사를 읽어보시기를 환영합니다:

- 모두를 위한 LLMs: LangChain 및 MistralAI 7B 모델을 Google Colab에서 실행하기
- 모두를 위한 LLMs: LLaMA-13B 모델과 LangChain을 Google Colab에서 실행하기
- 모두를 위한 LLMs: HuggingFace 텍스트 생성 추론을 Google Colab에서 실행하기
- 완전 초보자를 위한 자연어 처리
- 16, 8 및 4비트 부동 소수점 형식 - 어떻게 작동하는 것인가?

읽어 주셔서 감사합니다.