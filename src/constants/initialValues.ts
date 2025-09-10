import {
  T급여세부내역,
  T보장성보험,
  T의료비,
  T교육비,
  T카드,
  T기부금,
} from "@interface";

const 초기급여세부내역: T급여세부내역 = {
  연봉: undefined,
  비과세: undefined,
  국민연금: undefined,
  고용보험: undefined,
  소득세: undefined,
  지방소득세: undefined,
};

const 초기보험료: T보장성보험 = {
  보장성보험: undefined,
  장애인전용보장성보험: undefined,
};

const 초기의료비: T의료비 = {
  일반: undefined,
  취약계층: undefined,
  미숙아: undefined,
  난임: undefined,
  산후조리원: undefined,
};

const 초기교육비: T교육비 = {
  본인: undefined,
  아동_초_중_고등학생: undefined,
  대학생: undefined,
  장애인: undefined,
};

const 초기카드: T카드 = {
  신용카드: undefined,
  체크카드_현금영수증: undefined,
  대중교통: undefined,
  전통시장: undefined,
  문화생활: undefined,
};

const 초기기부금: T기부금 = {
  고향사랑: undefined,
  정치: undefined,
  지정: undefined,
};

export {
  초기급여세부내역,
  초기보험료,
  초기의료비,
  초기교육비,
  초기카드,
  초기기부금,
};
