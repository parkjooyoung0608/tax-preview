import Head from "next/head";
import CalculatorScreen from "./../components/CalculatorScreen";

export default function Calculator() {
  const siteUrl = "https://tax-preview.web.app/";
  const ogImage = `/og-image.png`;
  const twitterImage = `${siteUrl}/twitter-image.png`;

  return (
    <>
      <Head>
        <title>연말정산 계산기 | 무료 세금 미리보기 - Tax Preview</title>
        <meta
          name="description"
          content="무료 연말정산 계산기로 내 예상 세금을 미리 확인하세요. 교육비, 보험료, 카드 사용액 등 공제 항목을 입력하면 환급액 또는 추가 납부 세액을 계산할 수 있습니다."
        />
        {/* Open Graph */}
        <meta
          property="og:title"
          content="연말정산 계산기 - 무료 세금 미리보기"
        />
        <meta
          property="og:description"
          content="연말정산 환급액이 궁금하다면? 무료 계산기로 바로 확인해보세요."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://tax-preview.web.app/calculator"
        />
        <meta property="og:site_name" content="Tax Preview" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="연말정산 미리보기" />
        <meta
          name="twitter:description"
          content="연말정산 예상 환급금을 쉽고 빠르게 확인해보세요."
        />
        <meta name="twitter:image" content={twitterImage} />

        {/* Keywords (네이버 대비용) */}
        <meta
          name="keywords"
          content="연말정산 계산기, 연말정산 미리보기, 세금 계산, 환급액, 추가납부, 교육비 공제, 보험 공제, 카드 공제"
        />
      </Head>

      <CalculatorScreen />
    </>
  );
}
