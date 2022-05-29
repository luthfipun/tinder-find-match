const BASE_URL = "https://api.gotinder.com/v2/";

const LOGIN = `${BASE_URL}profile?include=account,feature_access,tappy_content,super_likes,likes,user`;
const CORE = `${BASE_URL}recs/core?locale=en`;
const LIKED = `${BASE_URL}fast-match/teasers?locale=en`;
const LIKES = `${BASE_URL}like/`;
const PASS = `${BASE_URL}pass/`;

export { LOGIN, CORE, LIKED, LIKES, PASS };
