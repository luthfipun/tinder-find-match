const BASE_URL = "https://api.gotinder.com/";

const LOGIN = `${BASE_URL}v2/profile?include=account,feature_access,tappy_content,super_likes,likes,user`;
const CORE = `${BASE_URL}v2/recs/core?locale=en`;
const LIKED = `${BASE_URL}v2/fast-match/teasers?locale=en`;
const LIKES = `${BASE_URL}like/`;
const PASS = `${BASE_URL}pass/`;

export { LOGIN, CORE, LIKED, LIKES, PASS };
