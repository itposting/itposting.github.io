---
title: "SQLAlchemy MissingGreenletError"
description: ""
coverImage: "/assets/img/2024-06-20-SQLAlchemyMissingGreenletError_0.png"
date: 2024-06-20 15:44
ogImage: 
  url: /assets/img/2024-06-20-SQLAlchemyMissingGreenletError_0.png
tag: Tech
originalTitle: "SQLAlchemy: MissingGreenletError"
link: "https://medium.com/@vickypalaniappan12/sqlalchemy-missinggreenleterror-656825b3ce13"
---


SQLAlchemy은 Python을 위한 강력한 라이브러리로, Python 프로그램과 데이터베이스 간의 통신을 용이하게 해줍니다. 이는 고수준 ORM (객체-관계 매핑)과 저수준 SQL 표현 언어를 제공합니다. asyncio의 등장으로 SQLAlchemy는 비동기 작업을 지원하도록 도입되었는데, 이는 비동기 IO가 성능을 향상시킬 수 있는 웹 애플리케이션에 특히 유용합니다. SQLAlchemy에서의 MissingGreenletError는 SQLAlchemy가 asyncio나 다른 비동기 프레임워크와 함께 사용될 때 발생하는 일반적인 문제입니다. 이 오류는 SQLAlchemy의 기본 동작이 동기적이기 때문에 발생하며, 이는 데이터베이스 작업이 결과를 기다리는 동안 이벤트 루프를 차단한다는 것을 의미합니다.

이 오류의 근본 원인을 이해하기 위해서는 SQLAlchemy와 asyncio가 어떻게 함께 작동하는지 이해해야 합니다.

MissingGreenletError: 이 오류는 보통 비동기 컨텍스트 (예: async 함수 또는 코루틴 내부)에서 동기 작업(데이터베이스 작업)을 실행하려고 할 때 발생합니다. async 함수 내에서 동기 SQLAlchemy 함수나 메서드를 호출하면, 데이터베이스 작업이 완료될 때까지 이벤트 루프가 다른 작업으로 전환할 수 없습니다. 이는 이벤트 루프가 차단되어 응용 프로그램이 응답하지 않거나 성능 문제가 발생한다는 것을 의미합니다.

다음은 MissingGreenletError를 설명하는 예시입니다:

<div class="content-ad"></div>

```js
엔진: AsyncEngine = create_async_engine(DB_ENGINE, echo=True)

async_session: AsyncSession = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    """모든 ORM 모델을 위한 기본 클래스."""


class PirateCrew(Base):
    """해적 승무원의 세부 정보를 포함합니다."""

    __tablename__ = "pirate_crew"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    ship_name: Mapped[str]
    members: Mapped[List["Pirate"]] = relationship(back_populates="pirate_crew")

    def __repr__(self) -> str:
        """객체의 표현을 반환합니다."""
        return f"{self.__class__.name}({self.name})"


class Pirate(Base):
    """해적의 세부 정보를 포함합니다."""

    __tablename__ = "pirates"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    role: Mapped[str]
    devil_fruit_user: Mapped[bool]
    pirate_crew_id = mapped_column(ForeignKey("pirate_crew.id"))
    pirate_crew: Mapped["PirateCrew"] = relationship(back_populates="members")

    def __repr__(self) -> str:
        """객체의 표현을 반환합니다."""
        return f"{self.__class__.name}({self.name})"


async def create_tables():
    """모든 테이블을 생성하는 메서드입니다."""
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)


async def db_seeder():
    """PirateCrew 및 Pirate 테이블에 데이터를 시드하는 시더입니다."""
    async with async_session() as session:
        mugiwara = PirateCrew(name="Straw Hats", ship_name="Thousand Sunny")
        mugiwara_members = [
            Pirate(
                name="Monkey D Luffy",
                role="Captain",
                devil_fruit_user=True,
                pirate_crew=mugiwara,
            ),
            Pirate(
                name="Roronoa Zoro",
                role="First Mate",
                devil_fruit_user=False,
                pirate_crew=mugiwara,
            ),
            Pirate(
                name="Nami",
                role="Navigator",
                devil_fruit_user=False,
                pirate_crew=mugiwara,
            ),
        ]
        session.add(mugiwara)
        session.add_all(mugiwara_members)
        await session.commit()
```

따라서 여기에서 우리는 PirateCrew와 Pirate 두 개의 테이블을 만들었습니다. Pirate와 PirateCrew 테이블 사이에 일대다 관계가 있음을 알 수 있습니다. 또한 데이터베이스에 테이블을 생성하고 일부 데이터로 씨드하는 두 개의 비동기 함수가 있습니다.

이제 MissingGreenletError를 살펴보겠습니다.

```js
async def missing_greenlet_error():
    """MissingGreenletError 예제입니다."""
    async with async_session() as session:
        pirate_crew = (await session.execute(select(PirateCrew))).all()[0][0]
        # 이제 해적 승무원의 멤버에 액세스하려고 시도해 보겠습니다 (members는 관련된 객체입니다).
        members = pirate_crew.members
        print(members)
```

<div class="content-ad"></div>

이 함수를 실행하면 콘솔에서 다음과 같은 오류가 발생합니다.

```js
sqlalchemy.exc.MissingGreenlet: greenlet_spawn has not been called; can't call await_only() here. Was IO attempted in an unexpected place? (Background on this error at: https://sqlalche.me/e/20/xd2s)
```

이 오류는 members 속성이 관계 속성이기 때문에 발생합니다. SQLAlchemy의 기본 동작은 관련된 객체를 동기적으로 게으르게 로드하는 것입니다. members 속성에 액세스할 때 SQLAlchemy가 관련 Pirate 객체를 동기적으로 로드하려고 하면, 이는 비동기 함수와 호환되지 않습니다. 동기적으로 작동하는 SQLAlchemy가 기대하는 것은 동기 작업에 대해 사용 가능한 greenlet이 있기 때문에 MissingGreenletError가 발생하게 되는 것입니다. 그러나 비동기적인 컨텍스트에서는 greenlet은 사용할 수 없습니다.

이와 같은 상황에서 MissingGreenletError를 피하려면 두 가지 옵션이 있습니다.

<div class="content-ad"></div>

- 관련 객체를 초기 쿼리에서 함께 로드하려면
- AsyncAttrs

Eager load 접근 방식: Eager loading은 SQLAlchemy와 같은 객체-관계 매핑(ORM) 라이브러리에서 사용되는 기술로, 부모 객체와 관련된 객체를 동일한 쿼리에서 로드하여 필요할 때 게으르게로 로드하는 것이 아니라 한 번에 로드합니다. 이 방식은 관련 객체를 비동기적으로 처리할 때 MissingGreenletError를 피하는 데 도움이 될 수 있습니다.

다음은 Eager load 방식으로 MissingGreenletError를 해결하는 예시입니다.

```js
async def loading_techniques로 수정해주세요():
    """로딩 기술을 사용하여 MissingGreenletError를 해결하는 예시."""
    async with async_session() as session:
        pirate_crew = (
            await session.execute(
                select(PirateCrew).options(selectinload(PirateCrew.members))
            )
        ).all()[0][0]
        # 이곳에서 selectinload()를 사용하여 Pirate Table을 조인했습니다
        members = pirate_crew.members
        print(members)
```

<div class="content-ad"></div>

여기서 selectinload() 로더 전략을 사용하여 관련된 객체를 즉시 로드했습니다. 더 자세한 설명은 이전 게시물을 참고해주세요,

AsyncAttrs: AsyncAttrs은 SQLAlchemy에서 제공하는 내장 mixin으로, awaitable_attrs 엑세서를 소개하여 어떤 속성도 awaitable로 취급할 수 있게 하며, 관련된 객체 또는 다른 속성에 대한 비동기 로딩 및 액세스를 용이하게 합니다.

다음은 AsyncAttrs를 사용하여 MissingGreenletError를 해결하는 예시입니다.

```js
class Base(DeclarativeBase, AsyncAttrs):
    """모든 ORM 모델의 기본 클래스"""

async def fix_with_async_attrs():
    """AsyncAttrs로 MissingGreenletError를 해결하는 예시"""
    async with async_session() as session:
        pirate_crew = (await session.execute(select(PirateCrew))).all()[0][0]
        members = await pirate_crew.awaitable_attrs.members
        print(members)
```

<div class="content-ad"></div>

여기서 우리는 AsyncAttrs를 Base 클래스에 추가했습니다. 이제 awaitable_attrs 액세서를 사용하여 관련 객체에 액세스할 수 있습니다. AsyncAttrs를 추가함으로써 이제 pirate_crew.members에 직접 액세스하는 대신 pirate_crew.awaitable_attrs.members를 사용할 수 있습니다. awaitable_attrs 부분은 SQLAlchemy에게 관련 Pirate 객체를 블로킹하지 않고 비동기적으로 로드하도록 지시합니다.

참고: AsyncAttrs은 MissingGreenletError를 피하는 데 도움이 되지만 N+1 쿼리 문제나 불필요한 데이터 로딩과 같은 다른 잠재적인 문제를 반드시 예방하는 것은 아닙니다. 여전히 적절한 로딩 전략(예: joinedload 또는 selectinload)을 사용하고 데이터 액세스 패턴을 신중히 고려하여 성능을 최적화하고 불필요한 부하를 피하는 것이 좋습니다.

참고 자료:

코드 참조:

<div class="content-ad"></div>

https://github.com/vickypalani/sqlalchemy_missing_greenlet_error