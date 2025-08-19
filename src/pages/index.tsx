import { useRouter } from "next/router";
import Home from "@components/Home";
import Head from "next/head";

export default function IndexPage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>연말정산 미리보기</title>
        <meta
          name="description"
          content="쉽고 빠른 연말정산 예상 환급금 계산 서비스"
        />
        {/* TODO: 파비콘 적용하기 */}
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        {/* TODO: utl 변경하기 */}
        <meta property="og:title" content="연말정산 미리보기" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta
          property="og:image"
          content="https://yourdomain.com/og-image.png"
        />

        {/* Twitter Card */}
        {/* TODO: image 변경하기 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="연말정산 미리보기" />
        <meta
          name="twitter:description"
          content="쉽고 빠른 연말정산 예상 환급금 계산 서비스"
        />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/twitter-image.png"
        />
      </Head>
      <Home onStart={() => router.push("/calulator")} />
    </>
  );
}
