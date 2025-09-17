import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

// components
import Card from "@components/ui/Card";
import SubCard from "@components/ui/SubCard";
import InputNumber from "@components/InputNumber";
import Header from "@components/Header";
import Footer from "@components/Footer";
import CheckBox from "@components/CheckBox";
import Toggle from "@components/Toggle";
import ComputedDeductionForm from "@components/computedDeduction/Form";
import ComputedDeductionResult from "@components/computedDeduction/Result";
import ComputedDeductionFix from "@components/computedDeduction/Fix";
import TaxResult from "@components/TaxResult";
import Category from "@components/text/Category";
import Result from "@components/text/Result";
import Tag from "@components/Tag";
import AdFitBannerWrapper from "@components/AdFit/BannerWrapper";

// utils
import 기납부세액 from "@utils/기납부세액";
import 근로소득공제 from "@utils/소득공제/근로소득";
import 연금보험료공제 from "@utils/소득공제/연금보험료";
import 주택청약소득공제 from "@utils/소득공제/주택청약";
import 산출세액 from "@utils/산출세액";
import 근로소득세액공제 from "@utils/세액공제/근로소득";
import 연금저축세액공제 from "@utils/세액공제/연금저축";
import 사대보험자동계산 from "@utils/사대보험자동계산";
import 보험료세액공제 from "@utils/세액공제/보험료";
import 의료비세액공제 from "@utils/세액공제/의료비";
import 교육비세액공제 from "@utils/세액공제/교육비";
import 카드소득공제 from "@utils/소득공제/카드";
import 중소기업취업자소득감면 from "@utils/소득공제/중소기업취업자소득감면";
import 월세세액공제 from "@utils/세액공제/월세";
import 고향사랑기부금세액공제 from "@utils/세액공제/고향사랑기부금";
import 정치기부금 from "@utils/세액공제/정치기부금";
import 지정기부금세액공제 from "@utils/세액공제/지정기부금";
import 출산입양공제 from "@utils/세액공제/출산입양";
import 자녀세액공제 from "@utils/세액공제/자녀";
import useSalaryDetail from "@hooks/useSalaryDetail";

// constants & interfaces
import {
  초기교육비,
  초기급여세부내역,
  초기기부금,
  초기보험료,
  초기의료비,
  초기카드,
} from "constants/initialValues";
import { T보장성보험, T의료비, T교육비, T카드, T기부금 } from "@interface";

/**
 * 연말정산 미리보기 — MVP 단일 파일 React 앱
 *
 * ⚠️ 본 계산기는 참고용입니다. 실제 세액은 국세청 기준과 회사 원천징수 내역, 연말정산 간소화 자료에 따라 달라질 수 있습니다.
 */
export default function CalculatorScreen() {
  // 소득공제
  const [카드, set카드] = useState<T카드>(초기카드);
  const [부양가족수, set부양가족수] = useState<number | undefined>(1);
  const [주택청약, set주택청약] = useState<number | undefined>(undefined);
  // 세액공제
  const [중소기업감면적용, set중소기업감면적용] = useState(false);
  const [결혼, set결혼] = useState(false);
  const [연금저축, set연금저축] = useState<number | undefined>(undefined);
  const [irpDc, setIrpDc] = useState<number | undefined>(undefined);
  const [보험료, set보험료] = useState<T보장성보험>(초기보험료);
  const [의료비, set의료비] = useState<T의료비>(초기의료비);
  const [교육비, set교육비] = useState<T교육비>(초기교육비);
  const [연간월세, set연간월세] = useState<number | undefined>(undefined);
  const [기부금, set기부금] = useState<T기부금>(초기기부금);
  const [출산입양, set출산입양] = useState<number | undefined>(undefined);
  const [자녀, set자녀] = useState<number | undefined>(undefined);
  // 급여관련
  const { 급여세부내역, set급여세부내역, handle급여세부내역 } =
    useSalaryDetail();

  const 총급여 = (급여세부내역?.연봉 || 0) - (급여세부내역?.비과세 || 0);
  const 최종근로소득공제 = 근로소득공제(총급여);
  const 최종연금보험공제 = 연금보험료공제({
    월국민연금: 급여세부내역.국민연금 || 0,
  });
  const 최종인적공제 = (부양가족수 || 0) * 1500000;
  const 최종주택청약공제 = 주택청약소득공제(주택청약 || 0);
  const 최종카드공제 = 카드소득공제(
    총급여,
    카드.신용카드 || 0,
    카드.체크카드_현금영수증 || 0,
    카드.대중교통 || 0,
    카드.전통시장 || 0,
    카드.문화생활 || 0
  );
  const 최종중소기업취업자소득감면 = 중소기업취업자소득감면(총급여);
  const 최종소득공제 =
    최종근로소득공제 +
    최종연금보험공제 +
    최종인적공제 +
    최종주택청약공제 +
    최종카드공제 +
    (중소기업감면적용 ? 최종중소기업취업자소득감면 : 0);
  const 과세표준 = 총급여 - 최종소득공제;
  const 최종산출세액 = 산출세액(과세표준);
  const 최종근로소득세액공제 =
    총급여 === 0 ? 0 : 근로소득세액공제(최종산출세액);
  const 최종연금저축세액공제 = 연금저축세액공제(
    연금저축 || 0,
    irpDc || 0,
    총급여
  );
  const 최종보장성보험세액공제 = 보험료세액공제(
    보험료.보장성보험 || 0,
    보험료.장애인전용보장성보험 || 0
  );
  const 최종의료비세액공제 = 의료비세액공제(
    총급여,
    의료비.일반 || 0,
    의료비.취약계층 || 0,
    의료비.미숙아 || 0,
    의료비.난임 || 0,
    의료비.산후조리원 || 0
  );
  const 최종교육비세액공제 = 교육비세액공제(
    교육비.본인 || 0,
    교육비.아동_초_중_고등학생 || 0,
    교육비.대학생 || 0,
    교육비.장애인 || 0
  );
  const 최종월세액공제 = 월세세액공제(연간월세 || 0, 총급여, 0);
  const 최종고향사랑기부공제 = 고향사랑기부금세액공제(기부금.고향사랑 || 0);
  const 최종정치기부공제 = 정치기부금(기부금.정치 || 0);
  const 최종출산입양세액공제 = 출산입양공제(출산입양 || 0);
  const 최종자녀세액공제 = 자녀세액공제(자녀 || 0);
  const 최종세액공제 =
    최종근로소득세액공제 +
    최종연금저축세액공제 +
    최종보장성보험세액공제 +
    최종의료비세액공제 +
    최종교육비세액공제 +
    최종월세액공제 +
    최종고향사랑기부공제 +
    최종정치기부공제 +
    최종출산입양세액공제 +
    최종자녀세액공제 +
    (결혼 ? 500_000 : 0);

  const 최종결정세액 = Math.max(0, 최종산출세액 - 최종세액공제);
  const 최종기납부세액 = 기납부세액({
    소득세: (급여세부내역.소득세 || 0) + (급여세부내역.지방소득세 || 0),
  });

  const 고정소득공제 = [
    {
      title: "근로 소득 공제",
      amount: 최종근로소득공제,
      limit: 20000000,
      url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6592&cntntsId=7871",
    },
    { title: "연금보험료 소득 공제", amount: 최종연금보험공제 },
  ];

  const 고정세액공제 = [
    { title: "근로소득 세액공제", amount: 최종근로소득세액공제 },
  ];

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  // 자동 제안 버튼
  const autofillIns = () => {
    const { 국민연금, 고용보험 } = 사대보험자동계산(총급여);
    set급여세부내역((prev) => ({
      ...prev,
      국민연금,
      고용보험,
    }));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadState = <T,>(
      key: string,
      setter: Dispatch<SetStateAction<T>>
    ) => {
      const item = localStorage.getItem(key);
      if (
        item === null ||
        item === "undefined" ||
        item === "null" ||
        item === ""
      ) {
        return;
      }

      try {
        setter(JSON.parse(item) as T);
      } catch (e) {
        console.error(`${key} 값 파싱 실패:`, e, item);
      }
    };

    loadState("카드", set카드);
    loadState("부양가족수", set부양가족수);
    loadState("주택청약", set주택청약);
    loadState("중소기업감면적용", set중소기업감면적용);
    loadState("결혼", set결혼);
    loadState("연금저축", set연금저축);
    loadState("irpDc", setIrpDc);
    loadState("보험료", set보험료);
    loadState("의료비", set의료비);
    loadState("교육비", set교육비);
    loadState("연간월세", set연간월세);
    loadState("기부금", set기부금);
    loadState("출산입양", set출산입양);
    loadState("자녀", set자녀);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 모든 상태를 localStorage에 저장
    localStorage.setItem("카드", JSON.stringify(카드));
    localStorage.setItem("부양가족수", JSON.stringify(부양가족수));
    localStorage.setItem("주택청약", JSON.stringify(주택청약));
    localStorage.setItem("중소기업감면적용", JSON.stringify(중소기업감면적용));
    localStorage.setItem("결혼", JSON.stringify(결혼));
    localStorage.setItem("연금저축", JSON.stringify(연금저축));
    localStorage.setItem("irpDc", JSON.stringify(irpDc));
    localStorage.setItem("보험료", JSON.stringify(보험료));
    localStorage.setItem("의료비", JSON.stringify(의료비));
    localStorage.setItem("교육비", JSON.stringify(교육비));
    localStorage.setItem("연간월세", JSON.stringify(연간월세));
    localStorage.setItem("기부금", JSON.stringify(기부금));
    localStorage.setItem("출산입양", JSON.stringify(출산입양));
    localStorage.setItem("자녀", JSON.stringify(자녀));
  }, [
    카드,
    부양가족수,
    주택청약,
    중소기업감면적용,
    결혼,
    연금저축,
    irpDc,
    보험료,
    의료비,
    교육비,
    연간월세,
    기부금,
    출산입양,
    자녀,
  ]);

  const resetSalaryDetail = () => {
    if (typeof window !== "undefined") {
      const keys = [
        "급여세부내역",
        "카드",
        "부양가족수",
        "주택청약",
        "중소기업감면적용",
        "결혼",
        "연금저축",
        "irpDc",
        "보험료",
        "의료비",
        "교육비",
        "연간월세",
        "기부금",
        "출산입양",
        "자녀",
      ];
      keys.forEach((key) => localStorage.removeItem(key));

      set급여세부내역(초기급여세부내역);
      set카드(초기카드);
      set부양가족수(1);
      set주택청약(undefined);
      set중소기업감면적용(false);
      set결혼(false);
      set연금저축(undefined);
      setIrpDc(undefined);
      set보험료(초기보험료);
      set의료비(초기의료비);
      set교육비(초기교육비);
      set연간월세(undefined);
      set기부금(초기기부금);
      set출산입양(undefined);
      set자녀(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header onClickReset={resetSalaryDetail} />

      <main className="max-w-5xl mx-auto px-4 py-6 grid gap-6">
        {/* 결과 섹션 */}
        {Number(String(최종기납부세액).replace(/,/g, "")) > 0 && (
          <TaxResult
            차감징수액={
              최종결정세액 - Number(String(최종기납부세액).replace(/,/g, ""))
            }
            최종결정세액={최종결정세액}
            최종기납부세액={최종기납부세액}
          />
        )}

        <section className="grid md:grid-cols-1 gap-6">
          {/* 급여 입력 필드 */}
          <Card>
            <section className="mb-6">
              <Category
                title="기납부세액"
                tooltipContent={`원천징수로 월급을 받으면서 미리 떼간 세금을 말해요.
                연말 정산 시 최대로 돌려받을 수 있는 금액을 뜻하기도해요!
              💡 아래 내용은 급여명세서에서 확인할 수 있어요.
              `}
              />

              <Result
                amount={최종기납부세액}
                message="은 최대로 돌려받을 수 있는 금액이에요."
              />
            </section>
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <InputNumber
                  label="총급여(연)"
                  placeholder="연간 총 급여액을 입력합니다."
                  value={급여세부내역.연봉}
                  onChange={(value) => handle급여세부내역("연봉", value)}
                  hint="상여금을 포함합니다."
                />

                <InputNumber
                  label="비과세 소득(연)"
                  placeholder="연간 총 비과세 소득을 입력합니다."
                  value={급여세부내역.비과세}
                  onChange={(value) => handle급여세부내역("비과세", value)}
                  hint="식대를 포함합니다."
                />
              </div>
              <div>
                <div className="flex items-center justify-end">
                  <button
                    onClick={autofillIns}
                    disabled={!급여세부내역.연봉 || 급여세부내역.연봉 === 0}
                    className={`px-2 py-1 rounded-lg border text-xs
    ${
      !급여세부내역.연봉 || 급여세부내역.연봉 === 0
        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
        : "border-gray-300 hover:bg-gray-100"
    }`}
                  >
                    자동 채우기
                  </button>
                </div>
                <div className="grid  grid-cols-1 md:grid-cols-2 gap-3">
                  {/* 한달 입력하면 자동계산 vs 매달 다르게 입력 가능 */}
                  <InputNumber
                    label="국민연금(월)"
                    placeholder="월 국민연금을 입력합니다."
                    value={급여세부내역.국민연금}
                    onChange={(value) => handle급여세부내역("국민연금", value)}
                  />
                  <InputNumber
                    label="고용보험(월)"
                    placeholder="월 고용보험을 입력합니다."
                    value={급여세부내역.고용보험}
                    onChange={(value) => handle급여세부내역("고용보험", value)}
                  />
                  <InputNumber
                    label="소득세(월)"
                    placeholder="월 소득세를 입력합니다."
                    value={급여세부내역.소득세}
                    onChange={(value) => handle급여세부내역("소득세", value)}
                  />
                  <InputNumber
                    label="지방소득세(월)"
                    placeholder="월 지방소득세를 입력합니다."
                    value={급여세부내역.지방소득세}
                    onChange={(value) =>
                      handle급여세부내역("지방소득세", value)
                    }
                  />
                </div>
              </div>
            </section>
          </Card>

          {/* 소득공제 : 총 공제 금액 합계 계산  */}
          <Card>
            <ComputedDeductionResult
              title="소득 공제"
              tooltipContent={`소득 공제는 내 소득을 깍아주는 거에요.
                나의 과세표준(총급여-소득공제)을 계산할 때 사용돼요.`}
              amount={최종소득공제}
              message="소득공제를 받을 것으로 예상돼요🥳"
              limit={25_000_000}
            />

            <SubCard>
              {/* 고정 공제 전체 카드 */}
              <ComputedDeductionFix items={고정소득공제} />

              <section className="grid grid-cols-1 gap-6">
                <Tag title="유동" />
                {/* 중소기업 취업자 소득세 감면 */}
                <CheckBox
                  id="중소기업감면적용"
                  checked={중소기업감면적용}
                  onChange={(e) => set중소기업감면적용(e.target.checked)}
                  amount={중소기업취업자소득감면(총급여)}
                  label="중소기업 취업자 소득세 감면 적용"
                  tooltipContent={`조건:
- 15세~34세 이하 근로자 (군복무 기간 제외)
- 감면 기간: 5년
- 감면율: 90%
- 연간 최대 200만원 한도

신청 방법:
- 근로자: 중소기업 취업자 소득세 감면 신청서를 회사에 제출
- 회사: 중소기업 취업자 소득세 감면명세서를 세무서에 제출

참고 링크:
- https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=40611&cntntsId=239023
`}
                />

                {/* 카드 소득 공제 */}
                <ComputedDeductionForm
                  title="카드 소득 공제"
                  공제금액={최종카드공제}
                  공제한도={3000000}
                  tooltipContent={`총급여액의 25% 초과 사용분부터 공제가 시작돼요.
- 신용카드: 15%
- 체크카드/현금영수증: 30%
- 전통시장/대중교통: 40%
- 도서·공연·박물관·미술관: 30%

☑️ 제외 항목 (공제 불가)
보험료, 기부금, 자동차 구입, 리스료, 해외결제, 상품권,
국세/지방세, 공과금, 월세, 면세물품 구입비용 등`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputNumber
                      label="신용카드 사용액"
                      placeholder="연간 신용카드 사용액"
                      value={카드.신용카드}
                      onChange={(value) =>
                        set카드((prev) => ({
                          ...prev,
                          신용카드: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="체크카드·현금영수증"
                      placeholder="연간 체크카드·현금영수증 사용액"
                      value={카드.체크카드_현금영수증}
                      onChange={(value) =>
                        set카드((prev) => ({
                          ...prev,
                          체크카드_현금영수증: value,
                        }))
                      }
                    />
                  </div>
                  <Toggle title="추가 공제">
                    <InputNumber
                      label="대중교통 사용액"
                      placeholder="연간 대중교통 사용액"
                      value={카드.대중교통}
                      onChange={(value) =>
                        set카드((prev) => ({
                          ...prev,
                          대중교통: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="전통시장 사용액"
                      placeholder="연간 전통시장 사용액"
                      value={카드.전통시장}
                      onChange={(value) =>
                        set카드((prev) => ({
                          ...prev,
                          전통시장: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="도서·공연·박물관·미술관"
                      placeholder="연간 문화생활 사용액"
                      value={카드.문화생활}
                      onChange={(value) =>
                        set카드((prev) => ({
                          ...prev,
                          문화생활: value,
                        }))
                      }
                    />
                  </Toggle>
                </ComputedDeductionForm>

                {/* 인적 소득 공제 */}
                <ComputedDeductionForm
                  title="인적 소득 공제"
                  공제금액={최종인적공제}
                  tooltipContent={`부양가족은 소득이 없는 사람을 뜻합니다.
                      년 소득이 100만원 미만이거나 근로소득만 있을 경우 500만원 미만입니다.
                      
                      [나이 조건]
                      - 본인과 배우자는 나이 상관없음
                      - 60세 이상 부모
                      - 20세 이하 자녀
                      - 20세 이하 60세 이상 형제 자매`}
                >
                  <InputNumber
                    label="부양가족 수(본인 포함)"
                    placeholder="본인을 포함한 부양가족 수를 작성합니다."
                    value={부양가족수}
                    onChange={(v) =>
                      set부양가족수(v !== undefined ? clamp(v, 1, 20) : 0)
                    }
                  />
                </ComputedDeductionForm>

                {/* 주택 청약 소득 공제 */}
                {총급여 < 70_000_000 && (
                  <ComputedDeductionForm
                    title="주택 청약 소득 공제"
                    공제금액={최종주택청약공제}
                    공제한도={3000000}
                    tooltipContent={`2015년 1월 1일 이후 납입한 경우 총급여액 7천만원 이하의 근로소득이 있어야해요.
                      💡무주택 세대주 요건이 필요해요!
                    `}
                    url="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=40610&cntntsId=239022"
                  >
                    <InputNumber
                      label="주택 청약(연)"
                      placeholder="1년동안 납부한 주택청약 비용을 작성합니다."
                      value={주택청약}
                      onChange={set주택청약}
                    />
                  </ComputedDeductionForm>
                )}
              </section>
            </SubCard>
          </Card>

          {/* 세액공제 : 총 공제 금액 합계 계산*/}
          <Card>
            <ComputedDeductionResult
              title="세액 공제"
              tooltipContent="내야할 세금을 깍아주는 것을 말해요."
              amount={최종세액공제}
              message="세액공제를 받을 것으로 예상돼요🥳"
            />

            <SubCard>
              {/* 고정 공제 전체 카드 */}
              <ComputedDeductionFix items={고정세액공제} />

              <section className="grid grid-cols-1 gap-6">
                <Tag title="유동" />
                {/* 결혼 세액공제 */}
                <CheckBox
                  id="결혼세액공제"
                  checked={결혼}
                  onChange={(e) => set결혼(e.target.checked)}
                  amount={500000}
                  label="이번년도에 결혼을 하셨나요?"
                  tooltipContent={`[조건]
- 혼인신고를 한 해에 생애 1회만 적용됩니다
- 2024년~2026년 사이의 혼인신고만 적용됩니다.

[💡 준비 서류]
연말정산 시 회사에 제출해야 해요.
- 혼인관계증명서
- 주민등록등본 `}
                />

                {/* 연금저축 */}
                <ComputedDeductionForm
                  title="연금저축 세액공제"
                  공제금액={최종연금저축세액공제}
                  tooltipContent={`납입한도는 600만원입니다. \n총 급여 5500만원 이하는 16.5%, 초과는 13.2% 공제됩니다.\n ⚠️ 만 55세 이후 수령 가능하기 때문에 신중하게 납입해야해요! \n 만 55세 이전 해지 시 세액공제 금액을 다시 납부해야해요.`}
                >
                  <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
                    <InputNumber
                      label="연금 저축(연)"
                      placeholder="1년동안 납부한 연금 저축을 작성합니다."
                      value={연금저축}
                      onChange={set연금저축}
                    />
                    <InputNumber
                      label="IRP+DC(연)"
                      placeholder="1년동안 납부한 IRP+DC를 작성합니다."
                      value={irpDc}
                      onChange={setIrpDc}
                    />
                  </div>
                </ComputedDeductionForm>

                {/* 보험 */}
                <ComputedDeductionForm
                  title="보장성 보험 세액공제"
                  공제금액={최종보장성보험세액공제}
                  공제한도={270000}
                  url="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7874"
                  tooltipContent={`간단 계산!\n월 보험료 83,000원 이상 납부하고 있다면 최대치인 120,000원 세액 공제돼요.`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputNumber
                      label="보장성보험(연)"
                      hint="최대 공제 한도 120,000원"
                      placeholder="생명보험, 상해보험 등의 보장성 보험료를 작성합니다."
                      value={보험료.보장성보험}
                      onChange={(value) =>
                        set보험료((prev) => ({
                          ...prev,
                          보장성보험: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="장애인전용 보장성보험(연)"
                      hint="최대 공제 한도 150,000원"
                      placeholder="장애인을 피보험자 또는 수익자로 하는 장애인전용 보장성보험료를 작성합니다."
                      value={보험료.장애인전용보장성보험}
                      onChange={(value) =>
                        set보험료((prev) => ({
                          ...prev,
                          장애인전용보장성보험: value,
                        }))
                      }
                    />
                  </div>
                </ComputedDeductionForm>

                {/* 의료비 */}
                <ComputedDeductionForm
                  title="의료비 세액공제"
                  공제금액={최종의료비세액공제}
                  tooltipContent={`내가 낸 의료비 중 총급여의 3%를 넘는 금액부터 세액공제를 받을 수 있어요.
- 일반 의료비: 연 700만원까지 15%
- 본인·6세 이하·65세 이상·장애인: 한도 없음, 15%
- 미숙아·선천성이상아: 한도 없음, 20%
- 난임 시술비: 한도 없음, 30%
※ 산후조리원 비용은 출산 1회당 200만원 한도로 공제 가능해요.`}
                >
                  <InputNumber
                    label="일반 의료비(연)"
                    hint="총급여액의 3% 초과분만 세액공제 가능, 연 700만원 한도"
                    placeholder="본인과 가족을 위해 지출한 일반 의료비를 작성합니다."
                    value={의료비.일반}
                    onChange={(value) =>
                      set의료비((prev) => ({
                        ...prev,
                        일반: value,
                      }))
                    }
                  />
                  {/* 특별 의료비 토글 */}
                  <Toggle title="특별 의료비">
                    <InputNumber
                      label="본인·6세 이하·65세 이상·장애인 의료비(연)"
                      hint="세액공제 한도 없음, 15% 공제"
                      placeholder="해당되는 의료비 지출액을 작성합니다."
                      value={의료비.취약계층}
                      onChange={(value) =>
                        set의료비((prev) => ({
                          ...prev,
                          취약계층: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="미숙아·선천성이상아 의료비(연)"
                      hint="세액공제 한도 없음, 20% 공제"
                      placeholder="해당되는 의료비 지출액을 작성합니다."
                      value={의료비.미숙아}
                      onChange={(value) =>
                        set의료비((prev) => ({
                          ...prev,
                          미숙아: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="난임 시술비(연)"
                      hint="세액공제 한도 없음, 30% 공제"
                      placeholder="난임 시술을 위해 지출한 금액을 작성합니다."
                      value={의료비.난임}
                      onChange={(value) =>
                        set의료비((prev) => ({
                          ...prev,
                          난임: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="산후조리원 비용"
                      hint="출산 1회당 200만원 한도"
                      placeholder="출산 후 산후조리원 비용을 작성합니다."
                      value={의료비.산후조리원}
                      onChange={(value) =>
                        set의료비((prev) => ({
                          ...prev,
                          산후조리원: value,
                        }))
                      }
                    />
                  </Toggle>
                </ComputedDeductionForm>

                {/* 교육비 */}
                <ComputedDeductionForm
                  title="교육비 세액공제"
                  공제금액={최종교육비세액공제}
                  url="https://help.3o3.co.kr/hc/ko/articles/15023134887321-%ED%95%99%EC%9E%90%EA%B8%88-%EB%8C%80%EC%B6%9C-%EC%97%B0%EB%A7%90%EC%A0%95%EC%82%B0-%EA%B3%B5%EC%A0%9C%EB%B0%9B%EB%8A%94-%EB%B0%A9%EB%B2%95-%EA%B5%90%EC%9C%A1%EB%B9%84-%EA%B3%B5%EC%A0%9C"
                  tooltipContent={`학자금대출은 전액 세액 공제됩니다.\n⚠️생활비 학자금대출은 민간 자금 학자금대출이기 때문에 공제되지않습니다.`}
                >
                  <InputNumber
                    label="본인"
                    placeholder="1년동안 납부한 본인의 교육비를 작성합니다."
                    value={교육비.본인}
                    onChange={(value) =>
                      set교육비((prev) => ({
                        ...prev,
                        본인: value,
                      }))
                    }
                  />
                  <Toggle title="가족 교육비">
                    <InputNumber
                      label="아동·초·중·고등학생"
                      hint="1명당 300만원 한도(공제율 15%)"
                      placeholder="1년동안 납부한 아동·초·중·고등학생의 교육비를 작성합니다."
                      value={교육비.아동_초_중_고등학생}
                      onChange={(value) =>
                        set교육비((prev) => ({
                          ...prev,
                          아동_초_중_고등학생: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="대학생 (대학원생은 공제 대상이 아닙니다.)"
                      hint="1명당 900만원 한도(공제율 15%)"
                      placeholder="1년동안 납부한 대학생의 교육비를 작성합니다."
                      value={교육비.대학생}
                      onChange={(value) =>
                        set교육비((prev) => ({
                          ...prev,
                          대학생: value,
                        }))
                      }
                    />
                    <InputNumber
                      label="장애인 특수교육비 (직계존속 포함)"
                      placeholder="1년동안 납부한 장애인 특수교육비를 작성합니다."
                      value={교육비.장애인}
                      onChange={(value) =>
                        set교육비((prev) => ({
                          ...prev,
                          장애인: value,
                        }))
                      }
                    />
                  </Toggle>
                </ComputedDeductionForm>

                {/* 월세 */}
                <ComputedDeductionForm
                  title="월세 세액공제"
                  공제금액={최종월세액공제}
                  tooltipContent={`연간 월세액에 대해 세액공제를 받을 수 있어요.

[한도]
- 연 1,000만원까지 공제 가능

[공제율 조건]
- 총급여 5,500만원 이하 & 종합소득금액 4,500만원 이하 → 17%
- 총급여 5,500만원 초과 ~ 8,000만원 이하 & 종합소득금액 7,000만원 이하 → 15%
- 그 외 → 공제 없음

[💡 준비 서류]
연말정산 시 회사에 제출해야 해요.
- 주민등록표등본
- 임대차 계약 증서 사본
- 계좌이체 영수증 및 무통장입금증 등 월세액 지급 증빙 서류`}
                >
                  <InputNumber
                    label=""
                    hint="최대 1,000만원까지 공제 가능"
                    placeholder="1년간 납부한 월세 총액을 입력하세요."
                    value={연간월세}
                    onChange={(value) => set연간월세(value)}
                  />
                </ComputedDeductionForm>

                {/* 기부금 */}
                <ComputedDeductionForm
                  title="지정기부금 (아름다운가게 등)"
                  공제금액={지정기부금세액공제(기부금.지정 || 0)}
                  tooltipContent={`사회복지법인, 공익법인 등 지정된 기관에 기부한 금액에 대해 세액공제를 받을 수 있어요.
- 세액공제율: 15%
- 현금 또는 물품 기부 모두 가능 (평가액 기준)`}
                >
                  <InputNumber
                    label=""
                    placeholder="올해 납부한 지정기부금 총액을 입력하세요."
                    hint="사회복지법인, 공익법인 등"
                    value={기부금.지정}
                    onChange={(value) =>
                      set기부금((prev) => ({
                        ...prev,
                        지정: value,
                      }))
                    }
                  />
                </ComputedDeductionForm>
                <ComputedDeductionForm
                  title="고향사랑기부금"
                  공제금액={고향사랑기부금세액공제(기부금.고향사랑 || 0)}
                  tooltipContent={`고향사랑e음(정부 공식 플랫폼)을 통해 기부한 금액에 대해 세액공제를 받을 수 있어요.

                  [공제율 조건]
                  - 10만원까지 전액(100%) 세액공제돼요.
                  - 기부액의 30% 상당이 기부 포인트로 들어와요.

                  [주의]
                  - 본인의 주민등록등본 상 거주지를 제외한 지역자치단체에 기부할 수 있습니다.
                  - 즉, 내가 살고있지 않는 곳에만 기부할 수 있어요.`}
                  url="https://ilovegohyang.go.kr/main.html"
                >
                  <InputNumber
                    label=""
                    hint="10만원까지 100% 세액공제 가능"
                    placeholder="올해 납부한 고향사랑기부금 총액을 입력하세요."
                    value={기부금.고향사랑}
                    onChange={(value) =>
                      set기부금((prev) => ({
                        ...prev,
                        고향사랑: value,
                      }))
                    }
                  />
                </ComputedDeductionForm>
                <ComputedDeductionForm
                  title="정치기부금"
                  공제금액={정치기부금(기부금.정치 || 0)}
                  tooltipContent={`정치후원금센터 등을 통해 기부한 정치후원금에 대해 세액공제를 받을 수 있어요.

[공제율 조건]
- 10만원 이하: 기부금액의 100/110 (약 90.9%)
- 10만원 초과 ~ 3,000만원 이하: 초과분의 15%
- 3,000만원 초과분: 25%
※ 근로소득금액의 100% 한도 내에서만 공제 가능`}
                >
                  <InputNumber
                    label=""
                    hint="10만원까지 약 90.9%, 초과분 15~25% 세액공제"
                    placeholder="올해 납부한 정치기부금 총액을 입력하세요."
                    value={기부금.정치}
                    onChange={(value) =>
                      set기부금((prev) => ({
                        ...prev,
                        정치: value,
                      }))
                    }
                  />
                </ComputedDeductionForm>

                {/* 출산/입양 세액공제 */}
                <ComputedDeductionForm
                  title="출산/입양 세액공제"
                  공제금액={최종출산입양세액공제}
                  tooltipContent={`해당 과세기간에 출산하거나 입양 신고한 공제대상 자녀가 있는 경우을 말합니다.`}
                >
                  <InputNumber
                    label=""
                    placeholder="출산하거나 입양 신고한 자녀의 수를 작성합니다."
                    value={출산입양}
                    onChange={(v) => set출산입양(v)}
                  />
                </ComputedDeductionForm>

                {/* 자녀 세액공제 */}
                <ComputedDeductionForm
                  title="자녀 세액공제 (8세 이상)"
                  공제금액={최종자녀세액공제}
                  url="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6596&cntntsId=7875"
                >
                  <InputNumber
                    label=""
                    placeholder="8세이상 자녀의 수를 작성합니다."
                    value={자녀}
                    onChange={(v) => set자녀(v)}
                  />
                </ComputedDeductionForm>
              </section>
            </SubCard>
          </Card>
        </section>

        {/* 참고/도움말 */}
        <section>
          <Card>
            <Category title="참고 및 면책" />
            <ul className="mt-3 text-sm space-y-2 text-gray-600">
              <li>
                - 본 도구는 <b>참고용</b>입니다. 실제 연말정산은 국세청 고지 및
                회사 원천징수 내역을 따릅니다.
              </li>
              <li>
                - 세법은 매년 변경될 수 있습니다. 정확한 기준은 국세청 자료를
                확인하세요.
              </li>
            </ul>
          </Card>
        </section>
      </main>

      <Footer />

      {/* 광고 배너 */}
      <AdFitBannerWrapper />
    </div>
  );
}
