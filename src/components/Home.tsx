import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center w-full h-screen bg-neutral-900 text-center text-white">
      <div>
        <h1 className="md:text-3xl text-2xl font-bold md:mb-4 mb-2">
          연말정산 미리보기
        </h1>
        <p className="mb-6 text-gray-300 md:text-lg text-sm">
          복잡한 연말정산을 간단한 입력만으로 쉽게 확인하세요
        </p>
        <div className="relative flex items-center md:w-[240px] md:h-[240px] w-[200px] h-[200px] mx-auto mb-6">
          <Image
            src="/images/moneybag.png"
            alt="돈주머니"
            width={240}
            height={240}
            className="animate-float [animation-delay:1.5s] absolute right-[30%] top-0 z-10"
          />
          <Image
            src="/images/calculator.png"
            alt="계산기"
            width={240}
            height={240}
            className="animate-float absolute left-[30%] top-0"
          />
        </div>

        <Link
          href="/calculator"
          className="inline-block text-lg text-neutral-900 p-4 bg-white rounded-full font-semibold hover:bg-neutral-900 hover:text-white border border-transparent hover:border-white transition-colors"
        >
          시작하기
        </Link>
      </div>
    </main>
  );
}
