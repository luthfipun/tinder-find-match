import { LocalStorage } from "node-localstorage";
import { User } from "../../domain/data/user";
import { logInfo, logWarning } from "../../domain/util/logs";
import { Main } from "../main";
var localstorage = new LocalStorage("./tmp");
import readlineSync from "readline-sync";
import moment from "moment";
import { Liked } from "../../domain/data/likes_you";
import { LikesYou } from "../likes_you";
import { LOGIN_SESSION } from "../../domain/util/constant";
import { likesYouGenerators } from "../../view/likes_you_generators.js";
import path from "path";

const backToMenu = async () => {
    let msgBackMenu = "Back to the menu?";
    if (readlineSync.keyInYN(msgBackMenu)) {
        await new Main().route();
    } else {
        process.exit(0);
    }
};

export const menu_profile = async () => {
    let user = new User().get();

    if (user === null) {
        logWarning("User not found please try re-login");
        process.exit(0);
    }

    let msg = `\n
            Your Profile
            ==========================
            id : ${user.id}
            name : ${user.name}
            email : ${user.email}
            phone : ${user.phone}
            gender : ${user.gender}
            date of birth : ${moment(user.dob).format("LL")}
            likes remaining : ${user.likes_remaining}
            joined : ${moment(user.created_at).format("llll")}
            last login : ${moment(user.ping).format("llll")}
            location : https://www.google.com/search?q=${user.lat},${user.lon}
        `;
    logInfo(msg);
    backToMenu();
};

export const menu_likes_you = async () => {
    let likedDatas = new Liked().get();

    if (likedDatas === null) {
        let token = localstorage.getItem(LOGIN_SESSION);
        let likesYou = new LikesYou(token);
        let isLikesYou = await likesYou.findLikesYou();

        if (!isLikesYou) {
            backToMenu();
        }
        await menu_likes_you();
    }

    await likesYouGenerators();

    let msg = `\n
        Who Liks You
        ==========================
        congrat's you have ${likedDatas.length} people who likes you
        you can show theirs photos with this links open with browser file://${process.cwd()}/view/liked.html
        `;

    logInfo(msg);
    backToMenu();
};
