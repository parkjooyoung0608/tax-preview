import Home from "@components/Home";
import Head from "next/head";

export default function IndexPage() {
  const siteUrl = "https://tax-preview.web.app/"; // 실제 도메인
  const ogImage = `${siteUrl}/og-image.png`; // 1200x630px 권장
  const twitterImage = `${siteUrl}/twitter-image.png`;

  return (
    <>
      <Head>
        <title>연말정산 미리보기</title>
        <meta
          name="description"
          content="연봉과 공제 항목을 입력하면 예상 세금을 계산하고 연말정산 환급 또는 추가 납부 금액을 미리 확인할 수 있습니다."
        />
        <meta
          name="keywords"
          content="연말정산, 세금 계산기, 소득공제, 세액공제, 환급"
        />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="연말정산 미리보기" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta
          property="og:description"
          content="연말정산 예상 환급금을 쉽고 빠르게 확인해보세요."
        />
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
      </Head>
      <Home />
    </>
  );
}
