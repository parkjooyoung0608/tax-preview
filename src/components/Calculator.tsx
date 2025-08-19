import React, { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";

/**
 * 연말정산 미리보기 — MVP 단일 파일 React 앱
 * - 세션 저장/리셋
 * - 기본 입력 → 결과/그래프 실시간
 * - 시뮬레이션(슬라이더)
 * - 수식 토글 & 참고 링크
 * - 카카오 애드핏 영역(샘플)
 *
 * ⚠️ 면책: 본 계산기는 참고용(시범)입니다. 실제 세액은 국세청 기준과 회사 원천징수 내역, 연말정산 간소화 자료에 따라 달라질 수 있습니다.
 */

// ---- 유틸 & 상수 -----------------------------------------------------------
const SESSION_KEY = "tax-preview-state-v1";

// 한국 종합소득세 누진세율 표 (간략화, 2025 기준 추정 — 참고용)
// 구간 상한(원), 세율, 누진공제(원). 실제 정책 변화 가능성 있음.
const TAX_BRACKETS = [
  { limit: 12_000_000, rate: 0.06, quick: 0 },
  { limit: 46_000_000, rate: 0.15, quick: 1_080_000 },
  { limit: 88_000_000, rate: 0.24, quick: 5_220_000 },
  { limit: 150_000_000, rate: 0.35, quick: 14_900_000 },
  { limit: 300_000_000, rate: 0.38, quick: 19_400_000 },
  { limit: 500_000_000, rate: 0.4, quick: 25_400_000 },
  { limit: 1_000_000_000, rate: 0.42, quick: 35_400_000 },
  { limit: Infinity, rate: 0.45, quick: 65_400_000 },
];

const currency = (n: number) =>
  new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }).format(
    Math.max(0, Math.round(n || 0))
  );

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// ---- 근로소득공제(간이 버전, 참고용) ---------------------------------------
/**
 * 사용자 제공 예시 문구에 맞춘 설명용 수식 토글에 쓰이는 식.
 * 실제 계산은 아래 simpleLaborIncomeDeduction 으로 처리(간이화).
 */
const laborFormulaBlocks = [
  {
    title: "1,500만원 초과 4,500만원 이하",
    formula:
      "750만원 + (총급여액 - 1,500만원) x 15% = 총급여액 x 15% + 525만원",
  },
  {
    title: "4,500만원 초과 1억원 이하",
    formula: "1,200만원 + 4,500만원 초과액의 5% = 총급여액 x 5% + 975만원",
  },
];

/**
 * 간이 근로소득공제 — 실제 제도와 다를 수 있음. 참고용(보수적) 추정치.
 * 매우 대략적으로, 총급여 구간별 공제율/정액을 단순화.
 */
function simpleLaborIncomeDeduction(totalSalary: number) {
  if (totalSalary <= 15_000_000) return totalSalary * 0.55; // 아주 대략적
  if (totalSalary <= 45_000_000) return totalSalary * 0.15 + 5_250_000;
  if (totalSalary <= 100_000_000) return totalSalary * 0.05 + 9_750_000;
  return 14_000_000; // 상한을 보수적으로 제한(참고용)
}

// ---- 4대 보험 자동 제안(참고용 비율) --------------------------------------
function suggestSocialInsurances(annualSalary: number) {
  // 월 환산
  const monthly = annualSalary / 12;
  // 참고용 비율(변동 가능): 국민연금 4.5%, 건강보험 3.5% 추정, 요양 12% of 건강, 고용 0.9%
  const pension = monthly * 0.045;
  const health = monthly * 0.035;
  const ltc = health * 0.12;
  const employment = monthly * 0.009;
  return {
    pension: Math.round(pension),
    health: Math.round(health),
    ltc: Math.round(ltc),
    employment: Math.round(employment),
  };
}

// 과세표준 → 산출세액(간이 누진세)
function calcIncomeTax(taxBase: number) {
  // 누진세 간이: 세율*과세표준 - 누진공제
  for (const b of TAX_BRACKETS) {
    if (taxBase <= b.limit) {
      return taxBase * b.rate - b.quick;
    }
  }
  return 0;
}

// ---- 앱 ---------------------------------------------------------------------
export default function Calculator() {
  // 상태
  const [salary, setSalary] = useState<number>(40_000_000);
  const [nonTaxable, setNonTaxable] = useState<number>(0); // 비과세 포함시 분리 입력용

  // 4대보험(월)
  const [pension, setPension] = useState<number>(0);
  const [health, setHealth] = useState<number>(0);
  const [ltc, setLtc] = useState<number>(0);
  const [employment, setEmployment] = useState<number>(0);

  // 기타 공제(간단화)
  const [dependents, setDependents] = useState<number>(1); // 본인 1 기본
  const [cardSpend, setCardSpend] = useState<number>(12_000_000);
  const [medical, setMedical] = useState<number>(1_000_000);
  const [education, setEducation] = useState<number>(500_000);
  const [pensionSavings, setPensionSavings] = useState<number>(1_200_000); // 연금저축/IRP 납입

  // 원천징수/기납부세액(사용자 입력)
  const [withheld, setWithheld] = useState<number>(2_500_000);

  // UI
  const [showFormula, setShowFormula] = useState<boolean>(false);
  const [dark, setDark] = useState<boolean>(true);

  // 세션 로드
  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      setSalary(s.salary ?? 40_000_000);
      setNonTaxable(s.nonTaxable ?? 0);
      setPension(s.pension ?? 0);
      setHealth(s.health ?? 0);
      setLtc(s.ltc ?? 0);
      setEmployment(s.employment ?? 0);
      setDependents(s.dependents ?? 1);
      setCardSpend(s.cardSpend ?? 12_000_000);
      setMedical(s.medical ?? 1_000_000);
      setEducation(s.education ?? 500_000);
      setPensionSavings(s.pensionSavings ?? 1_200_000);
      setWithheld(s.withheld ?? 2_500_000);
      setDark(s.dark ?? true);
    } else {
      // 최초 로드시 4대보험 자동 제안
      const sug = suggestSocialInsurances(40_000_000);
      setPension(sug.pension);
      setHealth(sug.health);
      setLtc(sug.ltc);
      setEmployment(sug.employment);
    }
  }, []);

  // 세션 저장
  useEffect(() => {
    const state = {
      salary,
      nonTaxable,
      pension,
      health,
      ltc,
      employment,
      dependents,
      cardSpend,
      medical,
      education,
      pensionSavings,
      withheld,
      dark,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  }, [
    salary,
    nonTaxable,
    pension,
    health,
    ltc,
    employment,
    dependents,
    cardSpend,
    medical,
    education,
    pensionSavings,
    withheld,
    dark,
  ]);

  // 리셋(세션 제거 + 기본값)
  const resetAll = () => {
    sessionStorage.removeItem(SESSION_KEY);
    const sug = suggestSocialInsurances(40_000_000);
    setSalary(40_000_000);
    setNonTaxable(0);
    setPension(sug.pension);
    setHealth(sug.health);
    setLtc(sug.ltc);
    setEmployment(sug.employment);
    setDependents(1);
    setCardSpend(12_000_000);
    setMedical(1_000_000);
    setEducation(500_000);
    setPensionSavings(1_200_000);
    setWithheld(2_500_000);
  };

  // 자동 제안 버튼
  const autofillIns = () => {
    const sug = suggestSocialInsurances(salary);
    setPension(sug.pension);
    setHealth(sug.health);
    setLtc(sug.ltc);
    setEmployment(sug.employment);
  };

  // ---- 간이 계산 로직 --------------------------------------------------------
  const monthlyInsTotal = (pension + health + ltc + employment) * 12; // 연환산

  // 인적공제 간이: 1인당 150만원 가정(참고용). 본인 포함.
  const personalDeduction = dependents * 1_500_000;

  // 근로소득공제(간이)
  const laborDeduction = simpleLaborIncomeDeduction(salary);

  // 신용/체크카드 등 간이 공제: 총사용액의 15% 가정(상한 미적용, 참고용)
  const cardDeduction = cardSpend * 0.15;

  // 의료비/교육비 간이 공제(참고용): 일부 비율 적용(보수적)
  const medicalDeduction = Math.max(0, medical - salary * 0.03) * 0.15; // 자기부담 초과분 15% 가정
  const educationDeduction = education * 0.15;

  // 연금저축/IRP 세액공제(간이): 16.5% 가정, 상한 미적용(참고)
  const pensionTaxCredit = pensionSavings * 0.165;

  // 과세표준(간이): 총급여 - 비과세 - 근로소득공제 - 인적공제 - 4대보험 등 (보수적)
  const taxBase = Math.max(
    0,
    salary -
      nonTaxable -
      laborDeduction -
      personalDeduction -
      monthlyInsTotal -
      cardDeduction -
      medicalDeduction -
      educationDeduction
  );

  // 산출세액
  const calculatedTax = Math.max(0, calcIncomeTax(taxBase));

  // 세액공제(간이): 연금저축 세액공제만 반영(간단화)
  const taxAfterCredits = Math.max(0, calculatedTax - pensionTaxCredit);

  // 결정세액(지방소득세 제외)
  const finalTax = Math.max(0, taxAfterCredits);

  // 예상 환급/추징 = 기납부세액 - 결정세액
  const refund = withheld - finalTax;

  const pieData = [
    { name: "결정세액(추정)", value: Math.max(0, finalTax) },
    { name: "기납부세액", value: Math.max(0, withheld) },
  ];

  const barData = [
    { name: "총급여", 금액: salary },
    { name: "근로소득공제", 금액: laborDeduction },
    { name: "인적공제", 금액: personalDeduction },
    { name: "4대보험(연)", 금액: monthlyInsTotal },
    { name: "카드 등 간이", 금액: cardDeduction },
    { name: "의료비 간이", 금액: medicalDeduction },
    { name: "교육비 간이", 금액: educationDeduction },
  ];

  // 시뮬레이션용 메모
  const simText = useMemo(() => {
    const delta100 = 100_000; // 10만원 추가 사용 가정
    const moreCard = (cardSpend + delta100) * 0.15 - cardDeduction;
    const newTaxBase = Math.max(0, taxBase - moreCard);
    const newTax = Math.max(0, calcIncomeTax(newTaxBase) - pensionTaxCredit);
    const diff = finalTax - newTax;
    return `카드 사용을 10만원 더 하면 결정세액이 약 ${currency(
      diff
    )}원 감소(환급 증가)할 수 있어요 (참고용).`;
  }, [cardSpend, cardDeduction, taxBase, finalTax, pensionTaxCredit]);

  // 다크모드 클래싱
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // 카카오 애드핏(샘플) — 실제 운용 시 본인 광고단위로 교체 필요
  useEffect(() => {
    // 주석 처리: 샌드박스 환경에서는 외부 스크립트 로드를 하지 않습니다.
    // const s = document.createElement('script');
    // s.async = true;
    // s.src = 'https://t1.daumcdn.net/kas/static/ba.min.js';
    // s.onload = () => {
    //   try {
    //     // @ts-ignore
    //     window.Kakao?.AdFit?.renderAd && window.Kakao.AdFit.renderAd();
    //   } catch {}
    // };
    // document.body.appendChild(s);
    // return () => { document.body.removeChild(s); };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">연말정산 미리보기</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              MVP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((v) => !v)}
              className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {dark ? "라이트" : "다크"} 모드
            </button>
            <button
              onClick={resetAll}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm shadow"
            >
              리셋(세션 초기화)
            </button>
          </div>
        </div>
      </header>

      {/* 광고 배너(샘플) */}
      <div className="max-w-5xl mx-auto px-4 mt-4">
        <div className="w-full h-20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-sm text-gray-500">
          카카오 애드핏 영역 (실 서비스에서 광고 단위 코드로 교체)
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 grid gap-6">
        {/* 입력 섹션 */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card
            title="기본 정보 입력"
            subtitle="필수: 총급여(비과세 제외). 모든 값은 원(₩) 기준입니다."
          >
            <div className="grid grid-cols-1 gap-4">
              <InputNumber
                label="총급여(연)"
                value={salary}
                onChange={setSalary}
                hint="예: 40,000,000"
              />
              <InputNumber
                label="비과세 소득(연)"
                value={nonTaxable}
                onChange={setNonTaxable}
                hint="식대 비과세 등 (없으면 0)"
              />
              <Divider />
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  4대 보험(월) — 자동 제안 사용 후 수정 가능
                </div>
                <button
                  onClick={autofillIns}
                  className="px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  자동 채우기
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputNumber
                  label="국민연금(월)"
                  value={pension}
                  onChange={setPension}
                />
                <InputNumber
                  label="건강보험(월)"
                  value={health}
                  onChange={setHealth}
                />
                <InputNumber
                  label="장기요양(월)"
                  value={ltc}
                  onChange={setLtc}
                />
                <InputNumber
                  label="고용보험(월)"
                  value={employment}
                  onChange={setEmployment}
                />
              </div>
              <Divider />
              <div className="grid grid-cols-2 gap-3">
                <InputNumber
                  label="부양가족 수(본인 포함)"
                  value={dependents}
                  onChange={(v) => setDependents(clamp(v, 1, 20))}
                />
                <InputNumber
                  label="기납부세액(원천징수 합계)"
                  value={withheld}
                  onChange={setWithheld}
                />
              </div>
            </div>
          </Card>

          <Card
            title="소득/세액 공제 (간단)"
            subtitle="간이 계산이며 실제와 다를 수 있습니다. 상세 모드는 추후 추가."
          >
            <div className="grid grid-cols-1 gap-4">
              <LabeledWithInfo
                title="소득 공제"
                desc="최대 한도 2,500만원 (참고). 내 노력으로 줄일 수 있는 소득 총액 상한을 가리킵니다."
              >
                <ToggleFormula
                  show={showFormula}
                  setShow={setShowFormula}
                  blocks={laborFormulaBlocks}
                  linkHref="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6592&cntntsId=7871"
                />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <InputNumber
                    label="신용/체크/현금 사용액(연)"
                    value={cardSpend}
                    onChange={setCardSpend}
                    hint="간이 공제=사용액의 15% 가정"
                  />
                  <InputNumber
                    label="의료비(연)"
                    value={medical}
                    onChange={setMedical}
                    hint="자기부담 초과분 15% 가정"
                  />
                  <InputNumber
                    label="교육비(연)"
                    value={education}
                    onChange={setEducation}
                  />
                  <InputNumber
                    label="연금저축/IRP 납입(연)"
                    value={pensionSavings}
                    onChange={setPensionSavings}
                    hint="세액공제 16.5% 가정"
                  />
                </div>
              </LabeledWithInfo>
            </div>
          </Card>
        </section>

        {/* 결과 섹션 */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card
            title="예상 결과"
            subtitle="실제 연말정산 결과와 다를 수 있습니다 (참고용)."
          >
            <div className="grid gap-2 text-sm">
              <Row label="근로소득공제(간이)">{currency(laborDeduction)}원</Row>
              <Row label="인적공제(간이)">{currency(personalDeduction)}원</Row>
              <Row label="4대보험 합계(연)">{currency(monthlyInsTotal)}원</Row>
              <Row label="과세표준(간이)">{currency(taxBase)}원</Row>
              <Row label="산출세액(간이)">{currency(calculatedTax)}원</Row>
              <Row label="세액공제(연금저축 등)">
                {currency(pensionTaxCredit)}원
              </Row>
              <Row label="결정세액(추정)">
                <strong className="text-rose-600 dark:text-rose-400">
                  {currency(finalTax)}원
                </strong>
              </Row>
              <Row label="기납부세액(입력)">{currency(withheld)}원</Row>
              <Row label="예상 환급(+)/추징(-)">
                <strong
                  className={
                    refund >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }
                >
                  {currency(refund)}원
                </strong>
              </Row>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              ※ 지방소득세, 농어촌특별세 등은 미포함(간이).
            </p>
          </Card>

          <Card title="시각화">
            <div className="grid gap-4">
              <div className="w-full h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <ReTooltip formatter={(v: number) => `${currency(v)}원`} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full h-56">
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ReTooltip formatter={(v: number) => `${currency(v)}원`} />
                    <Legend />
                    <Bar dataKey="금액" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </section>

        {/* 시뮬레이션 */}
        <section>
          <Card
            title="시뮬레이션"
            subtitle="입력값을 조정하면 결과가 실시간으로 반영됩니다."
          >
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="grid gap-4">
                <Slider
                  label="카드/현금영수증 사용액"
                  value={cardSpend}
                  onChange={setCardSpend}
                  min={0}
                  max={50_000_000}
                  step={100_000}
                />
                <Slider
                  label="의료비"
                  value={medical}
                  onChange={setMedical}
                  min={0}
                  max={50_000_000}
                  step={100_000}
                />
                <Slider
                  label="교육비"
                  value={education}
                  onChange={setEducation}
                  min={0}
                  max={30_000_000}
                  step={100_000}
                />
                <Slider
                  label="연금저축/IRP 납입"
                  value={pensionSavings}
                  onChange={setPensionSavings}
                  min={0}
                  max={7_000_000}
                  step={100_000}
                />
              </div>
              <div className="text-sm p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
                <p className="font-medium mb-2">무엇이 유의미하게 바뀔까요?</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                  <li>{simText}</li>
                  <li>
                    연금저축 납입액을 늘리면 세액공제(간이)가 증가하여
                    결정세액이 내려갑니다.
                  </li>
                  <li>
                    4대보험 입력은{" "}
                    <span className="font-semibold">월 금액</span> 기준입니다.
                    자동 제안 후 회사 실제 금액으로 수정하세요.
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* 참고/도움말 */}
        <section>
          <Card title="참고 및 면책">
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                본 도구는 <b>예상치(참고용)</b>를 제공합니다. 실제 연말정산은
                국세청 고지 및 회사 원천징수 내역을 따릅니다.
              </li>
              <li>
                세법은 매년 변경될 수 있습니다. 정확한 기준은 국세청 자료를
                확인하세요.
              </li>
              <li>
                SEO를 위해 정적 메타 태그/OG 태그를 페이지별 설정하시고(Next.js
                권장), 광고는 카카오 애드핏 정책에 맞게 삽입하세요.
              </li>
            </ul>
          </Card>
        </section>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-xs text-gray-500">
        © {new Date().getFullYear()} tax-preview — 연말정산 미리보기. 모든
        계산은 참고용입니다.
      </footer>
    </div>
  );
}

// ---- 재사용 컴포넌트 -------------------------------------------------------
function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5 bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-2" />
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-gray-600 dark:text-gray-300">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

function InputNumber({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        inputMode="numeric"
        className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        value={value}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.-]/g, "");
          onChange(Number(raw || 0));
        }}
      />
      {hint && <span className="text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-gray-500">{currency(value)}원</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </label>
  );
}

function LabeledWithInfo({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-start gap-2">
        <h3 className="font-semibold">{title}</h3>
      </div>
      {desc && <p className="text-sm text-gray-500 mt-1">{desc}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ToggleFormula({
  show,
  setShow,
  blocks,
  linkHref,
}: {
  show: boolean;
  setShow: (b: boolean) => void;
  blocks: { title: string; formula: string }[];
  linkHref: string;
}) {
  return (
    <div className="mt-2">
      <button
        onClick={() => setShow(!show)}
        className="text-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {show ? "수식 숨기기" : "계산식 보기"}
      </button>
      {show && (
        <div className="mt-2 rounded-xl border border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/icons/mathematics_gray.svg"
              alt="math"
              width={24}
              height={24}
            />
            <span className="text-sm text-gray-500">참고용 수식입니다.</span>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {blocks.map((b, i) => (
              <li key={i}>
                <div className="font-medium">{b.title}</div>
                <pre className="text-xs whitespace-pre-wrap bg-white/60 dark:bg-gray-800 rounded-lg p-2 mt-1 overflow-x-auto">
                  {b.formula}
                </pre>
              </li>
            ))}
          </ul>
          <a
            className="inline-block mt-2 text-xs underline text-emerald-600 dark:text-emerald-400"
            href={linkHref}
            target="_blank"
            rel="noreferrer"
          >
            국세청 참고 링크
          </a>
        </div>
      )}
    </div>
  );
}
