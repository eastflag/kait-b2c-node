const jwtOptions  = {
  secretKey : 'kait_b2c', // 원하는 시크릿 키
  options : {
    algorithm : "HS256", // 해싱 알고리즘
    expiresIn : "1440m",  // 토큰 유효 기간
    issuer : "kait" // 발행자
  }
}

export default jwtOptions;