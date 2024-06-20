---
title: "주말 AI 프로젝트 라즈베리 파이에서 음성 인식, PTT 및 대규모 액션 모델 사용하기"
description: ""
coverImage: "/assets/img/2024-06-20-AWeekendAIProjectUsingSpeechRecognitionPTTandaLargeActionModelonaRaspberryPi_0.png"
date: 2024-06-20 17:19
ogImage: 
  url: /assets/img/2024-06-20-AWeekendAIProjectUsingSpeechRecognitionPTTandaLargeActionModelonaRaspberryPi_0.png
tag: Tech
originalTitle: "A Weekend AI Project: Using Speech Recognition, PTT, and a Large Action Model on a Raspberry Pi"
link: "https://medium.com/towards-data-science/a-weekend-ai-project-using-speech-recognition-ptt-and-a-large-action-model-on-a-raspberry-pi-ac8d839d078a"
---


![2024-06-20-AWeekendAIProjectUsingSpeechRecognitionPTTandaLargeActionModelonaRaspberryPi_0](/assets/img/2024-06-20-AWeekendAIProjectUsingSpeechRecognitionPTTandaLargeActionModelonaRaspberryPi_0.png)

2024년 초에는 거의 모든 기술 리뷰어가 Rabbit R1에 대해 썼어요. 이 제품은 가격이 $199인 첫 번째 휴대용 "AI 어시스턴트" 입니다. 작성자들에 따르면 "신경 기호 프로그래밍"과 LAM ("대규모 액션 모델")을 사용하여 다양한 작업을 수행합니다. 그런데 어떻게 작동할까요? 자신의 프로토 타입을 만드는 것이 가장 좋은 방법이죠!

이전에 Rabbit R1에 대해 듣지 못한 독자들은 이와 유사한 많은 YouTube 리뷰를 찾을 수 있습니다. 이 글은 Rabbit R1을 어떻게 만들 수 있는가에 대한 흥미로운 분석을 한 Nabil Alouani의 게시물에 영감을 받았습니다.

<div class="content-ad"></div>

저는 파이썬 코드에서 비슷한 아이디어를 구현하고, 실제 라즈베리 파이 하드웨어에서 어떻게 작동하는지 그리고 어떤 종류의 문제를 해결해야 하는지 살펴볼 것입니다.

시작하기 전에 한 가지 알림: 저는 Rabbit 팀이나 그 판매와 관련이 없습니다.

## 구성 요소

이 글에서는 여러 구성 요소를 포함한 AI 어시스턴트를 만들 것입니다.

<div class="content-ad"></div>

- 마이크와 Push-to-Talk (PTT) 버튼
- 자동 음성 인식 (ASR), 녹음된 오디오 데이터를 텍스트로 변환할 수 있습니다.
- 장치에 로컬로 실행되는 작은 언어 모델. 이 모델은 ASR에서 인식한 텍스트에서 작업을 구문 분석할 것입니다.
- 작업이 로컬 모델에서 알 수 없는 경우 장치가 공용 API를 호출합니다. 여기에서 두 가지 옵션이 제공됩니다: 키를 가진 사람들을 위해 OpenAI API를 사용할 것이고, 무료 솔루션을 원하는 사람들을 위해 LLaMA 모델을 사용할 것입니다.
- 결과(로컬 모델의 작업 또는 “큰” 모델에서의 텍스트 응답)는 장치 화면에 표시됩니다.

이 기사의 코드는 라즈베리 파이용으로 작성되었지만, 일반 PC에서도 테스트할 수 있습니다. 그럼, 시작해봅시다!

## 하드웨어

이 프로젝트에는 리눅스가 실행되는 싱글 보드 컴퓨터인 라즈베리 파이 4를 사용할 것입니다. 라즈베리 파이에는 다양한 하드웨어를 연결할 수 있도록 여러 개의 GPIO (일반 목적 입출력) 핀이 있습니다. 휴대 가능하며 5V DC 전원만 필요합니다. 또한 128x64 OLED 디스플레이와 버튼을 연결할 것이며, 연결 다이어그램은 다음과 같습니다:



<div class="content-ad"></div>


![이미지](/assets/img/2024-06-20-AWeekendAIProjectUsingSpeechRecognitionPTTandaLargeActionModelonaRaspberryPi_1.png)

이 글을 쓰는 시점에 라즈베리파이 모델마다 (RPi 5는 더 빠르지만 더 비싸다) 및 RAM 크기에 따라 약 $80-120 정도의 비용이 듭니다 (최소 4GB RAM이 필요함). 디스플레이, 버튼 및 와이어 세트는 아마존에서 $10-15 정도로 구매할 수 있습니다. 소리 녹음을 위해서는 USB 마이크로폰이면 됩니다. 라즈베리파이 설정은 간단합니다. 이에 대한 충분한 자습서가 있습니다. 언급해야 할 점은 Raspbian의 32비트 및 64비트 버전이 모두 사용 가능하다는 것입니다. 대부분의 현대적인 Python 라이브러리는 더 이상 32비트 버전으로 제공되지 않기 때문에 64비트 버전이 필요합니다.

이제 소프트웨어 부분에 대해 이야기해 봅시다.

## Push-to-Talk (PTT)


<div class="content-ad"></div>

라즈베리 파이에서 푸시투톡 모드를 구현하는 것은 비교적 간단합니다. 배선 다이어그램에서 볼 수 있듯이 PTT(푸시투톡) 버튼은 핀 중 하나에 연결되어 있습니다 (우리의 경우 핀 21번). 그 값을 읽으려면 먼저 GPIO 라이브러리를 가져와 핀을 구성해야 합니다:

```js
try:
    import RPi.GPIO as gpio
except (RuntimeError, ImportError):
    gpio = None

button_pin = 21
gpio.setup(button_pin, gpio.IN, pull_up_down=gpio.PUD_UP)
```

여기서 저는 핀 21을 “input(입력)”으로 설정하고 pull-up 저항을 활성화했습니다. "pull-up(풀업)"이란 버튼이 눌리지 않을 때 입력이 내부 저항을 통해 "전원"에 연결되어 있고, 그 값은 "1"인 상태를 의미합니다. 버튼이 눌리면 입력 값은 "0"이 됩니다 (따라서 Python 코드에서의 값은 반대로 됩니다: 버튼이 눌리지 않으면 "1", 눌리면 "0"이 됩니다).

입력 핀이 구성되면, 그 값을 읽기 위해 필요한 코드는 한 줄뿐입니다:

<div class="content-ad"></div>

```js
value = gpio.input(button_pin)
```

코딩을 좀 더 편리하게 하기 위해, 마지막 버튼 상태를 기억할 수 있는 GPIOButton 클래스를 만들었어요. 상태를 비교해서 버튼이 눌리거나 놓였는지 쉽게 감지할 수 있게 돼요.

```js
class GPIOButton:
    def __init__(self, pin_number: int):
        self.pin = pin_number
        self.is_pressed = False
        self.is_pressed_prev = False
        if gpio is not None:
            gpio.setup(self.pin, gpio.IN, pull_up_down=gpio.PUD_UP)

    def update_state(self):
        """ Update button state """
        self.is_pressed_prev = self.is_pressed
        self.is_pressed = self._pin_read(self.pin) == 0

    def is_button_pressed(self) -> bool:
        """ Button was pressed by user """
        return self.is_pressed and not self.is_pressed_prev

    def is_button_hold(self) -> bool:
        """ Button still pressed by user """
        return self.is_pressed and self.is_pressed_prev

    def is_button_released(self) -> bool:
        """ Button released by user """
        return not self.is_pressed and self.is_pressed_prev

    def reset_state(self):
        """ Clear the button state """
        self.is_pressed = False
        self.is_pressed_prev = False

    def _pin_read(self, pin: int) -> int:
        """ Read pin value """
        return gpio.input(pin) if gpio is not None else 0
```

이 방식을 통해 라즈베리 파이가 없는 사용자들을 위해 “가상 버튼”을 만들 수도 있어요. 예를 들어, 이 “버튼”은 애플리케이션이 시작된 후 처음 5초 동안 눌린 상태일 수 있어요:

<div class="content-ad"></div>

```python
class VirtualButton(GPIOButton):
    def __init__(self, delay_sec: int):
        super().__init__(pin_number=-1)
        self.start_time = time.monotonic()
        self.delay_sec = delay_sec

    def update_state(self):
        """ Update button state: button is pressed first N seconds """
        self.is_pressed_prev = self.is_pressed
        self.is_pressed = time.monotonic() - self.start_time < self.delay_sec
```

가상 버튼을 사용하면 해당 코드를 Windows, Mac 또는 Linux PC에서 쉽게 테스트할 수 있습니다.

## 소리 녹음 및 음성 인식

PTT(푸시 투 토크) 버튼을 사용하여 소리를 녹음할 수 있습니다. 이를 위해 Python 사운드카드 라이브러리를 사용할 것입니다. 0.5초씩 오디오를 녹음하며, 이 정확도는 우리의 작업에 충분히 적합합니다:

<div class="content-ad"></div>

```js
import soundcard as sc


class SoundRecorder:
    """ 사운드 레코더 클래스 """
    SAMPLE_RATE = 16000
    BUF_LEN_SEC = 60
    CHUNK_SIZE_SEC = 0.5
    CHUNK_SIZE = int(SAMPLE_RATE*CHUNK_SIZE_SEC)

    def __init__(self):
        self.data_buf: np.array = None
        self.chunks_num = 0

    def get_microphone(self):
        """ 기본 마이크 가져오기 """
        mic = sc.default_microphone()
        logging.debug(f"녹음 장치: {mic}")
        return mic.recorder(samplerate=SoundRecorder.SAMPLE_RATE)

    def record_chunk(self, mic: Any) -> np.array:
        """ 새로운 데이터 청크 녹음하기 """
        return mic.record(numframes=SoundRecorder.CHUNK_SIZE)

    def start_recording(self, chunk_data: np.array):
        """ 새로운 문구 녹음 시작하기 """
        self.chunks_num = 0
        self.data_buf = np.zeros(SoundRecorder.SAMPLE_RATE * SoundRecorder.BUF_LEN_SEC, dtype=np.float32)
        self._add_to_buffer(chunk_data)

    def continue_recording(self, chunk_data: np.array):
        """ 문구 녹음 계속하기 """
        self.chunks_num += 1
        self._add_to_buffer(chunk_data)

    def get_audio_buffer(self) -> Optional[np.array]:
        """ 오디오 버퍼 가져오기 """
        if self.chunks_num > 0:
            logging.debug(f"오디오 길이: {self.chunks_num*SoundRecorder.CHUNK_SIZE_SEC}s")
            return self.data_buf[:self.chunks_num*SoundRecorder.CHUNK_SIZE]
        return None

    def _add_to_buffer(self, chunk_data: np.array):
        """ 버퍼에 새 데이터 추가하기 """
        ind_start = self.chunks_num*SoundRecorder.CHUNK_SIZE
        ind_end = (self.chunks_num + 1)*SoundRecorder.CHUNK_SIZE
        self.data_buf[ind_start:ind_end] = chunk_data.reshape(-1)
```

PTT 버튼과 사운드 레코더로 “스마트 어시스턴트” 파이프라인의 첫 부분을 구현할 수 있습니다:

```js
ptt = GPIOButton(pin_number=button_pin)

recorder = SoundRecorder()
with recorder.get_microphone() as mic:
    while True:
        new_chunk = recorder.record_chunk(mic)
        ptt.update_state()

        if ptt.is_button_pressed():
            # 녹음 시작
            recorder.start_recording(new_chunk)
        elif ptt.is_button_hold():
            recorder.continue_recording(new_chunk)
        elif ptt.is_button_released():
            buffer = recorder.get_audio_buffer()
            if buffer is not None:
                # 녹음 종료
                # ...

            # 새 문구를 위해 준비
            ptt.reset_state()
```

전체 코드는 기사의 끝에 제공되지만, 이 부분만으로 아이디어를 이해할 수 있습니다. 여기서는 무한한 “메인” 루프가 있습니다. 마이크는 항상 활성화되어 있지만, 녹음은 버튼이 눌릴 때만 시작됩니다. PTT 버튼이 놓일 때, 오디오 버퍼를 음성 인식에 사용할 수 있습니다.

<div class="content-ad"></div>

ASR(Automatic Speech Recognition)은 이미 이전 게시물에서 설명했습니다:

이 텍스트를 간결하게 만들기 위해 코드를 다시 반복하지 않겠습니다. 독자들께서 스스로 이전 부분을 확인하시기 바랍니다.

## 디스플레이

이 프로젝트에서는 Amazon에서 $3-5에 구매할 수 있는 작은 1.4인치 128x64 OLED 디스플레이를 사용했습니다. 코드는 이미 이전 게시물에서 제시되었습니다. 저는 단지 작은 리팩토링을 수행하고 모든 메서드를 OLEDDisplay 클래스에 넣었습니다:

<div class="content-ad"></div>

```python
class OLEDDisplay:
    """ I2C OLED 화면에 정보 표시 """
    def __init__(self):
        self.pixels_size = (128, 64)
        ...
        self.app_logo = Image.open("bunny.png").convert('1')
        if adafruit_ssd1306 is not None and i2c is not None:
            self.oled = adafruit_ssd1306.SSD1306_I2C(self.pixels_size[0],
                                                     self.pixels_size[1],
                                                     i2c)
        else:
            self.oled = None        

    def add_line(self, text: str):
        """ 스크롤링되는 새로운 라인 추가 """

    def add_tokens(self, text: str):
        """ 추가 줄바꿈 여부에 따라 새로운 토큰 추가 """

    def draw_record_screen(self, text: str):
        """ 로고와 텍스트를 그림 """
        logging.debug(f"Draw_record_screen: \033[0;31m{text}\033[0m")
        if self.oled is None:
            return

        image = Image.new("1", self.pixels_size)
        img_pos = (self.pixels_size[0] - self.image_logo.size[0])//2
        image.paste(self.image_logo, (img_pos, 0))
        draw = ImageDraw.Draw(image)
        text_size = self._get_text_size(text)
        txt_pos = (self.pixels_size[0]//2 - text_size[0]//2,
                   self.pixels_size[1] - text_size[1])
        draw.text(txt_pos, text, font=self.font, fill=255, align="center")

        self._draw_image(image)

    def _get_text_size(self, text):
        """ 텍스트 크기 가져오기 """
        _, descent = self.font.getmetrics()
        text_width = self.font.getmask(text).getbbox()[2]
        text_height = self.font.getmask(text).getbbox()[3] + descent
        return (text_width, text_height)

    def _draw_image(self, image: Image):
        """ 디스플레이에 이미지 그리기 """
``` 

또한 PTT 버튼이 눌렸는지 여부를 나타내는 "rabbit" 로고와 텍스트를 표시하는 draw_record_screen 메서드를 추가했습니다. 텍스트는 다른 상태 메시지에도 유용합니다. 라즈베리 파이에 연결된 디스플레이는 다음과 같이 보입니다:

<img src="https://miro.medium.com/v2/resize:fit:1400/1*o863KNDptmNqkTmz1kBamw.gif" />

깜박임은 비디오 녹화의 부작용이며, 인간 눈에는 보이지 않습니다. 미술가가 아니라서 제 그림 실력이 죄송합니다 ;)

<div class="content-ad"></div>

지난 글에서 언급한 것처럼 이 코드는 라즈베리 파이 없이 일반 PC에서 테스트할 수 있어요. 이 경우 oled 변수가 None이 되며 표준 logging.debug 출력만 사용하게 됩니다.

## 대형 액션 모델

이제 재밌는 부분에 다가가고 있어요 — LLMs와 놀아보죠. 우리 AI 어시스턴트의 논리는 간단해요:

- 마이크로폰에서 문구를 가져옵니다.
- 이 문구를 장치 내에서 실행되는 작은 언어 모델로 구문 분석합니다.
- 문구가 특정 작업에 해당하는 경우, 어시스턴트가 해당 작업을 수행합니다 (예: 스마트 LED 전구에 명령을 보내어 등을 켤 수 있습니다). 작업이 알려지지 않은 경우에만 어시스턴트가 "큰" 모델에 도움을 요청합니다.

<div class="content-ad"></div>

장치에서 모델을 로컬에서 실행하는 것은 간단한 이유로 매우 중요합니다: 클라우드 API는 무료가 아닙니다. 예를 들어, 이 글을 쓰는 시점에서, Rabbit R1의 가격은 $199이며, 그들의 웹사이트에서 약속한 대로 "구독이 필요하지 않습니다." 가능한 한 많은 작업을 로컬에서 실행하는 것이 가능하게 만드는 것이 중요합니다. 저희의 스마트 어시스턴트에게도 같은 방식을 사용할 것입니다.

장난감 예시로, 하나의 작업만 있는 경우를 가정해보겠습니다. 저희의 스마트 어시스턴트는 불을 켜고 끌 수밖에 없다고 가정해봅시다. 이 작업을 감지하기 위한 가능한 LLM 프롬프트는 다음과 같이 보일 수 있습니다:

```js
당신은 사용자 어시스턴트입니다.
사용자가 불을 켜고 싶다면 라이트 온리를 작성하십시오.
사용자가 불을 끄고 싶다면 라이트 오프만 작성하십시오.
다른 경우에는 알 수 없음이라고만 작성하십시오.
예시.
사용자: 불을 켜주세요. 어시스턴트: 라이트 온.
사용자: 불을 끄세요. 어시스턴트: 라이트 오프.
사용자: 문을 열어주세요. 어시스턴트: 알 수 없음.
이제 다음 사용자 텍스트를 읽으세요. 간단한 답변만 작성하십시오.
사용자: {질문}
어시스턴트:
```

실제 사용 사례에서는 많은 작업이 있을 수 있고, 사용자 요청에 가장 잘 맞는 프롬프트를 얻기 위해 작은 RAG 데이터베이스가 사용되지만, 테스트를 위해서는 충분합니다.

<div class="content-ad"></div>

라즈베리 파이에서 언어 모델을 사용하려면 LLM 클래스를 만들어 봅시다. 또한 3가지 가능한 동작을 포함한 LLMAction 클래스를 만들었습니다:

```js
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain_community.llms import LlamaCpp

class LLMAction:
    """ 가능한 동작 """
    UNKNOWN = 0
    LIGHTS_ON = 1
    LIGHTS_OFF = 2

    @staticmethod
    def get_action(response: str) -> int:
        """ 텍스트 응답에서 동작을 가져옵니다 """
        
        actions = [(LLMAction.LIGHTS_ON, "LIGHT ON"),
                   (LLMAction.LIGHTS_OFF, "LIGHT OFF")]
        for action, action_text in actions:
            if action_text.lower() in response.lower():
                return action
        return LLMAction.UNKNOWN

class LLM:
    """ LLM 상호작용 """
    def __init__(self):
        self.model_file = "..."
        self.llm = LlamaCpp(
            model_path=self.model_file,
            temperature=0.1,
            max_tokens=8,
            n_gpu_layers=0,
            n_batch=256,
            callback_manager=CallbackManager([StreamingStdOutCallbackHandler()]),
            verbose=True,
        )

    def get_action_code(self, question: str) -> int:
        """ LLM에게 질문하고 동작 코드를 반환합니다 """
        res_str = self._inference(question)
        return LLMAction.get_action(res_str)

    def _inference(self, question: str) -> str:
        """ LLM에게 질문합니다 """
        template = self._get_prompt_template()
        prompt = PromptTemplate(template=template, input_variables=["question"])
        chain = prompt | self.llm | StrOutputParser()
        resp = chain.invoke({"question": question}, config={}).strip()
        return resp
      
    def _get_prompt_template(self) -> str:
        """ 다른 모델에 대한 프롬프트를 가져옵니다 """
        if "tinyllama" in self.model_file:
            return """<|system|>
                사용자 보조 기능입니다. 사용자가 빛을 켜려면 LIGHT ON이라고만 적어주세요. 
                빛을 끄려면 LIGHT OFF라고만 적어주세요. 다른 경우에는 I DON'T KNOW이라고만 적어주세요.
                예시.
                사용자: 불을 켜줘. 보조 기능: "LIGHT ON". 
                사용자: 불을 끄어줘. 보조 기능: "LIGHT OFF".
                사용자: 문을 열어줘. 보조 기능: "I DON'T KNOW".
                이제 이 사용자 질문에 답해주세요. LIGHT ON, LIGHT OFF 또는 I DON'T KNOW 중에 선택해 적어주세요.
                </s>
                <|user|>
                {question}</s>
                <|assistant|>"""
        ...
```

여기서 LlamaCpp를 사용하여 언어 모델을 로드하고 응답을 얻기 위한 _inference 메서드를 만들었습니다. 서로 다른 모델은 서로 다른 프롬프트 구문을 갖기 때문에, 모델 이름에 따라 다른 프롬프트를 선택합니다. LlamaCpp 라이브러리는 라즈베리 파이에 쿠다 GPU가 없어도 작동할 수 있고 평범한 C/C++로 작성되어 있어 우리의 작업에 탁월합니다.

어떤 모델을 사용해야 할까요? 라즈베리 파이는 계산 자원이 제한적이기 때문에 답은 그리 쉽지 않습니다. GPU가 없고 CPU 추론 속도가 느립니다. 실제로 라즈베리 파이에서 모델을 실행할 때, 1–2B 모델에만 제한됩니다. 그 외에는 추론에 너무 많은 시간이 걸립니다. "작은 대형 언어 모델"은 모순적으로 들릴 수 있지만, 우리의 경우 선택지가 매우 제한적입니다. HuggingFace에서 라즈베리 파이에 적합한 1B Tiny Vicuna, 1.1B Tiny Llama, 그리고 2.7B Phi-2 모델을 찾을 수 있었습니다.

<div class="content-ad"></div>

가장 좋은 작은 모델을 찾기 위해 작은 벤치마크를 만들어 봅시다. 우리의 3가지 액션을 테스트하기 위해 4개씩 총 12개의 문구를 만들었습니다.

```python
qa_pairs = [("Switch on the light", LLMAction.LIGHTS_ON),
            ("Switch on the light please", LLMAction.LIGHTS_ON),
            ("Turn on the light", LLMAction.LIGHTS_ON),
            ("Turn on the light please", LLMAction.LIGHTS_ON),
            ("Switch off the light", LLMAction.LIGHTS_OFF),
            ("Switch off the light please", LLMAction.LIGHTS_OFF),
            ("Turn off the light", LLMAction.LIGHTS_OFF),
            ("Turn off the light please", LLMAction.LIGHTS_OFF),
            ("Buy me the ticket", LLMAction.UNKNOWN),
            ("Where is the nearest library?", LLMAction.UNKNOWN),
            ("What is the weather today?", LLMAction.UNKNOWN),
            ("Give me a receipt of an apple pie", LLMAction.UNKNOWN)]
```

코드를 실행하기 전에 huggingface-cli 도구를 사용하여 모델을 다운로드해야 합니다:

```python
huggingface-cli download afrideva/Tiny-Vicuna-1B-GGUF tiny-vicuna-1b.q4_k_m.gguf --local-dir . --local-dir-use-symlinks False
huggingface-cli download TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf --local-dir . --local-dir-use-symlinks False
huggingface-cli download TheBloke/phi-2-GGUF phi-2.Q4_K_M.gguf --local-dir . --local-dir-use-symlinks False
huggingface-cli download TheBloke/Llama-2-7b-Chat-GGUF llama-2-7b-chat.Q4_K_M.gguf --local-dir . --local-dir-use-symlinks False
```

<div class="content-ad"></div>

여기, 더 나은 성능을 위해 7B Llama-2 모델을 "참조"로 다운로드했습니다.

라즈베리 파이 4에서의 시험 결과는 다음과 같습니다:

```js
Tiny Vicuna 1B: 정확도: 66%, 평균 응답 시간: 4.2초
Tiny Llama 1.1B: 정확도: 0%, 평균 응답 시간: 4.9초
Phi-2 2.7B: 정확도: 75%, 평균 응답 시간: 24.6초
Llama-2 7B: 정확도: 83%, 평균 응답 시간: 19.3초
```

결과는 흥미로웠습니다. 첫째, Tiny Llama 모델의 0% 정확도에 놀랐습니다. 여전히 응답을 제공할 수는 있었지만 정확하지 않았습니다. 예를 들어, Tiny Llama는 "불을 켜라"라는 문구에 "사용자: 불 켜기"라는 답변을 할 수 있고, 이는 "어느 정도" 정확하며 핵심 문구를 쉽게 찾을 수 있습니다. 둘째, 7B Llama-2가 2.7B Phi-2보다 더 빠르게 작동하는 것을 보는 것이 흥미로웠습니다. 셋째, 모델들에게 가장 "어려웠던" 것은 마지막 질문 그룹이었습니다. 거의 모든 모델이 "모르겠다." 대신에 스스로 답을 만들려고 시도했습니다. 재미있게도 "작은" 모델뿐만 아니라 Google Bard도 이 실수를 범했습니다.

<div class="content-ad"></div>

<img src="/assets/img/2024-06-20-AWeekendAIProjectUsingSpeechRecognitionPTTandaLargeActionModelonaRaspberryPi_2.png" />

어쨌든 라즈베리 파이에서 1-2B 모델을 사용할 수 있지만 두 가지 문제점이 있습니다. 첫째, 라즈베리 파이 4가 충분히 빠르지 않다는 것을 알 수 있습니다. 모델은 작동하지만 추론하는 데 4초는 다소 느립니다. 라즈베리 파이 5는 거의 2배 빠를 것으로 예상되지만, 심지어 2초도 상당한 지연입니다. 둘째, 작은 LLM은 종종 충분히 정확하지 않습니다. 우리의 프로토타입에는 문제가 되지 않지만, 생산 장치의 경우 세밀한 조정이 필요할 것입니다.

테스트 결과를 얻은 후 Rabbit R1 개발자들이 LLM을 구현한 방법을 생각해 보는 것도 흥미롭습니다. R1 설명에서 "500ms" 응답 시간을 본 적이 있습니다. 결과에서 볼 수 있듯이 이 시간 제한은 정말 도전적입니다. 당연히 실제 답변을 모르지만, 몇 가지 교육된 추측을 할 수 있습니다.

- 사용자 조작에만 초점을 맞춘 작은 0.1-0.5B 언어 모델을 만들어 실제 데이터셋에서 학습했을 것입니다.
- 더 빠른 처리를 위해 별도의 칩을 사용했을 것입니다. "Intel Neural Compute Stick"과 같은 장치들이 여러 년 동안 알려져 왔으며, 현대의 coprocessors가 LLM 계산을 수행할 수 있는 수단이 있을지도 모릅니다 (이 방법은 새로운 것은 아닙니다; 저와 같은 세대의 사람들은 Intel 8087 수학 coprocessors를 기억할 수 있습니다.).
- LLM 이외에도 더 많이 사용할 수 있습니다. 텍스트 파싱은 "클래식" 파이썬 도구인 정규 표현식, 코딩된 규칙 등을 사용하여 수행할 수 있으며, 모든 방법을 결합하는 것이 유익할 수 있습니다.

<div class="content-ad"></div>

마지막으로 Rabbit R1은 꽤 좋은 MediaTek MT6765 옥타코어 프로세서를 갖추고 있으며 몇 가지 테스트에서 Raspberry Pi 4보다 상당히(4-8배) 빠르다고 명시되어 있습니다. 따라서 이 CPU에서는 심지어 1B 모델이 충분히 빠르게 작동할 수도 있습니다.

## 클라우드 모델

이전에 토론한 대로 로컬 모델이 답을 알지 못하는 경우 "모르겠어요"라는 응답을 반환하고 이 경우 질문을 "큰 동생"에게 전달할 것입니다. 시작해봅시다!

라즈베리 파이에서 클라우드 모델을 사용하는 것은 간단합니다. OpenAILLM 클래스를 생성하고, 이름에서 알 수 있듯이 OpenAI API를 사용할 것입니다:

<div class="content-ad"></div>

```js
from langchain_openai import OpenAI

OPENAI_BASE_URL = "..."
OPENAI_API_KEY = "여기에 키를 입력하세요"

class OpenAILLM:
    """ OpenAI API Handler """
    def __init__(self):
        self.llm = OpenAI(openai_api_key=OPENAI_API_KEY,
                          base_url=OPENAI_BASE_URL)
        self.template = """도와드리는 어시스턴트입니다.
                           질문에 대한 간단한 답변을 작성해주세요.
                           질문: {question}
                           답변:"""

    def inference(self, question: str, callback: Callable):
        """ OpenAI 모델에 질문하기 """
        prompt = PromptTemplate(template=self.template,
                                input_variables=["question"])

        chain = prompt | self.llm | StrOutputParser()
        for token in chain.stream({"question": question}):
            callback(token)
```

여기서 OLED 디스플레이를 업데이트하기 위해 스트리밍 모드와 콜백 핸들러를 사용했기 때문에 답변은 토큰 단위로 즉시 표시됩니다.

코드에서 OPENAI_API_KEY 변수를 볼 수 있습니다. OpenAI 구독이 없는 경우 어떻게 할 수 있을까요? LlamaCPP는 훌륭한 라이브러리이며 이를 해결해 줍니다. 이것을 통해 로컬 인스턴스로 OpenAI API를 모사할 수 있어서 다른 PC에서 실행할 수 있습니다. 예를 들어, 다음 명령을 사용하여 데스크탑에서 7B Llama-2 모델을 실행할 수 있습니다:

```js
python3 -m llama_cpp.server --model llama-2-7b-chat.Q4_K_M.gguf --n_ctx 16192 --host 0.0.0.0 --port 8000
```

<div class="content-ad"></div>

그런 다음 코드에서 OPENAI_BASE_URL을 "http://192.168.1.10:8000/v1"과 같은 것으로 조정하면 됩니다. 흥미롭게도 OpenAI 라이브러리는 여전히 키가 필요합니다(키가 비어 있으면 내부적으로 확인하도록 되어 있습니다), 그러나 일반적인 숫자 "42"도 충분합니다 ;)

그런데 우리의 프로토타입에서는 먼저 로컬 모델을 사용하여 클라우드 비용을 줄이지만, OpenAI 키를 가지고 있고 가격에 신경 쓰지 않는 독자들은 API 호출을 사용하여 로컬 작업을 분석할 수도 있습니다. 무료는 아니지만 더 빠르고 정확할 것입니다. 이 경우 LLM 클래스를 LlamaCPP 모델 대신 OpenAI로 작업 프롬프트를 보낼 수 있도록 약간 수정할 수 있습니다.

## 결과

마지막으로, 모든 부분을 결합할 때가 왔습니다! 최종 코드는 다음과 같이 보입니다:

<div class="content-ad"></div>

```js
if __name__ == "__main__":
    display = OLEDDisplay()
    display.add_line("자동 음성 인식 초기화 중...")    
    asr = ASR()

    display.add_line("GPT 모델 초기화 중...")
    llm = LLM()

    ptt = GPIOButton(pin_number=button_pin)
    if gpio is None:
        ptt = VirtualButton(delay_sec=5)

    def on_recording_finished(audio_buffer: np.array):
        """ 녹음이 완료되었으며 오디오 데이터를 처리합니다 """
        question = asr.transcribe(audio_buffer)
        display.add_line(f"> {question}\n")

        # 처리
        action = llm.get_action_code(question)
        if action != LLMAction.UNKNOWN:
            process_action(action)
        else:
            process_unknown(question)

        display.add_line("\n5초 후에 다시 이동합니다...\n")
        time.sleep(5)

    def process_action(action: int):
        """ 더미 작업을 처리합니다 """
        ...

    def process_unknown(question: str):
        """ OpenAI에 질문합니다 """
        display.add_line("\n")
        # 대답을 스트리밍
        openai_llm = OpenAILLM()
        openai_llm.inference(question=question,
                             callback=display.add_tokens)

      # 메인 루프
      recorder = SoundRecorder()
      with recorder.get_microphone() as mic:
          ptt.reset_state()
          display.draw_record_screen("PTT 준비됨")
          while True:
              new_chunk = recorder.record_chunk(mic)
              ptt.update_state()

              if ptt.is_button_pressed():
                  display.draw_record_screen("PTT 활성화")
                  recorder.start_recording(new_chunk)
              elif ptt.is_button_hold():
                  recorder.continue_recording(new_chunk)
              elif ptt.is_button_released():
                  display.draw_record_screen("잠시 기다려주세요...")
                  buffer = recorder.get_audio_buffer()
                  on_recording_finished(buffer)

                  # 다시 준비
                  ptt.reset_state()
                  display.draw_record_screen("PTT 준비됨")
```


실제로는 이렇게 동작합니다.

로컬 동작을 실행하는 중:

<img src="https://miro.medium.com/v2/resize:fit:1400/1*Qmwb-hB7Hyd4dCxd37e8-w.gif" />

<div class="content-ad"></div>

여기서, 나는 더미 작업을 사용 중이에요; 스마트 램프에 연결하거나 라즈베리 파이에 릴레이 쉴드를 사용하는 것은 이 기사의 범위를 벗어날 것입니다.

원격 LLM에서 답변을 받는 중입니다:

![image](https://miro.medium.com/v2/resize:fit:1400/1*8jaqi_8ld923YcuZNO6iuQ.gif)

여기서, 저는 데스크톱에서 실행되는 LLaMA-2 모델을 OpenAI 대체재로 사용하고 있어요. 이 모델은 라즈베리 파이에서 로컬로 실행되는 모델과 비교해서 응답이 훨씬 빠르다는 것을 알 수 있어요.

<div class="content-ad"></div>

## 결론

이번 "주말" 프로젝트에서는 라즈베리 파이를 기반으로 한 스마트 어시스턴트를 만들었습니다. 이 스마트 어시스턴트는 다양한 기능을 수행할 수 있습니다:

- 푸시 투 토크 버튼과 음성 인식을 사용할 수 있습니다.
- 다양한 사용자 동작을 감지할 수 있는 로컬 언어 모델을 실행할 수 있습니다.
- 만약 사용자의 요청이 로컬 LLM에 알려지지 않은 경우 더 강력한 원격 모델을 요청할 수 있습니다. 이 경우 OpenAI API나 호환 가능한 로컬 서버를 사용할 수 있습니다.

우리는 이와 같은 프로젝트를 만드는 데 많은 도전이 있다는 것을 알 수 있습니다. 대규모 언어 모델은 많은 계산 능력이 필요하며, 휴대용 장치에는 도전적입니다. 좋은 결과를 얻기 위해서는 조정된 모델 뿐만 아니라 그 모델을 빠르게 실행할 충분히 강력한 하드웨어도 필요합니다 (20초의 지연 후에 "스마트 어시스턴트" 응답을 받은 사용자는 아무도 관심을 갖지 않을 것입니다). 클라우드 API는 빠릅니다만 무료가 아니며, 하드웨어 비용, 계산 속도, 판매 가격 및 클라우드 비용 사이의 균형을 찾는 것은 까다로울 수 있습니다.

<div class="content-ad"></div>

만약 이 이야기를 즐기셨다면 Medium에 구독해 주시고, 새로운 기사가 발행될 때 알림을 받으며 다른 저자들의 수천 개 이야기에 완전한 액세스 권한을 얻을 수 있습니다. 또한 LinkedIn을 통해 연락하실 수도 있습니다. 이와 함께 이와 다른 게시물의 전체 소스 코드를 받고 싶다면 Patreon 페이지를 방문해주세요.

언어 모델과 자연어 처리에 관심이 있는 분들은 다른 기사들을 읽어보시기를 환영합니다:

- 주말 AI 프로젝트 (제1부): 라즈베리 파이에서 음성 인식 및 LLaMA-2 GPT 실행
- 모든 사람을 위한 LLMs: LangChain 및 MistralAI 7B 모델을 Google Colab에서 실행
- 모든 사람을 위한 LLMs: LLaMA-13B 모델 및 LangChain을 Google Colab에서 실행
- 모든 사람을 위한 LLMs: Google Colab에서 HuggingFace 텍스트 생성 추론 실행
- 절대 초보자를 위한 자연어 처리
- 16, 8 및 4비트 부동 소수점 형식 - 어떻게 동작하는가?

읽어 주셔서 감사합니다.