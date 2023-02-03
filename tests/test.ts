interface UserInfo {
  sdt?: any;
  pass?: any;
  result?: any;
  id?: any;
}

export const searchQueries = [
  {
    search: "bún",
    searchQuerie: 10,
  },
  {
    search: "cá",
    searchQuerie: 10,
  },
  {
    search: "@#@#",
    searchQuerie: "Không tìm thấy sản phẩm nào",
  },
  {
    search: "giò lụa",
    searchQuerie: 3,
  },
];

export const useNamePassCase: UserInfo[] = [
  {
    id: 1,
    sdt: "0854328940",
    pass: "123456",
    result: "Gửi phản hồi",
  },
  {
    id: 2,
    sdt: "2342412312",
    pass: "123456",
    result: "Số điện thoại 2342412312 không hợp lệ",
  },
  {
    id: 3,
    sdt: "0854328940",
    pass: "123",
    result: "Mật khẩu không hợp lệ",
  },
  {
    id: 4,
    sdt: "0854328940",
    pass: "123",
    result: "Mật khẩu không hợp lệ 1234",
  },
];

export async function setCookieVals() {
  const cookies = [
    { name: "ACCESS_TOKEN", value: "33b3dc0b-81f5-4ba8-bbe5-e8b94fc71312" },
  ];

  return cookies;
}
