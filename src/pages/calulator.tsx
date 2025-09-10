import Head from "next/head";
import Calculator from "@components/Calculator";

export default function CalculatorPage() {
  return (
    <>
      <Head>
        <title>연말정산 세금 계산기 | Tax Preview</title>
        <meta
          name="description"
          content="연봉과 공제 항목을 입력하면 예상 세금을 계산하고 연말정산 환급 또는 추가 납부 금액을 미리 확인할 수 있습니다."
        />
        <meta
          name="keywords"
          content="연말정산, 세금 계산기, 소득공제, 세액공제, 환급"
        />
        <meta property="og:title" content="연말정산 세금 계산기" />
        <meta
          property="og:description"
          content="연봉과 공제 정보를 입력해 예상 세금을 계산해보세요. 환급 또는 추가 납부 금액을 쉽게 확인할 수 있습니다."
        />
        <meta property="og:url" content="https://your-domain.com/calculator" />
        <meta property="og:site_name" content="Tax Preview" />
        <meta
          property="og:image"
          content="https://your-domain.com/og-image.png"
        />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="연말정산 세금 계산기" />
        <meta
          name="twitter:description"
          content="연봉과 공제 정보를 입력해 예상 세금을 계산해보세요. 환급 또는 추가 납부 금액을 쉽게 확인할 수 있습니다."
        />
        <meta
          name="twitter:image"
          content="https://your-domain.com/og-image.png"
        />
      </Head>
      <Calculator />
    </>
  );
}
