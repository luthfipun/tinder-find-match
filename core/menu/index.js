import {
    logInfo,
    logLoading,
    logWarning,
} from "../../domain/util/logs/index.js";
import moment from "moment";
import { LocalStorage } from "node-localstorage";
import readlineSync from "readline-sync";
import { Liked } from "../../domain/data/likes_you/index.js";
import { User } from "../../domain/data/user/index.js";
import { LIKED_DATA, LOGIN_SESSION } from "../../domain/util/constant/index.js";
import { likesYouGenerators } from "../../view/likes_you_generators.js";
import { FindMatch } from "../find_match/index.js";
import { LikesYou } from "../likes_you/index.js";
import { Main } from "../main/index.js";
import cliProgress from "cli-progress";
import chalk from "chalk";
import { matchesGenerator } from "../../view/matces_generators.js";
import { Matching } from "../matching/index.js";
import { sleep } from "../../domain/util/helper/index.js";
var localstorage = new LocalStorage("./tmp");
let matchesCollection = [];

const backToMenu = async () => {
    let msgBackMenu = "Back to the menu?";
    if (readlineSync.keyInYN(msgBackMenu)) {
        matchesCollection = [];
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
    let token = localstorage.getItem(LOGIN_SESSION);
    let likesYou = new LikesYou(token);
    let isLikesYou = await likesYou.findLikesYou();

    if (!isLikesYou) {
        backToMenu();
    }

    await likesYouGenerators();

    let likedDatas = new Liked().get();
    let msg = `\n
        Who Likes You
        ==========================
        congrat's you have ${likedDatas.length} people who likes you
        you can show theirs photos with this links open with browser : file://${process.cwd()}/view/liked.html
        `;

    logInfo(msg);
    backToMenu();
};

export const menu_find_match = async () => {
    let currentLikedData = localstorage.getItem(LIKED_DATA);
    if (currentLikedData === null) {
        logWarning(
            "Oops! You must find who likes you first before find matches.."
        );
        backToMenu();
    }

    let token = localstorage.getItem(LOGIN_SESSION);
    let findMatch = new FindMatch(token);
    let response = await findMatch.findMatchPeople();

    if (response === null || response === undefined) {
        backToMenu();
    }

    let results = response.data.results;

    if (results.length === 0) {
        logWarning("Hmm, can't find any people here, please try again...");
        backToMenu();
    }

    let likedData = JSON.parse(currentLikedData).map((e) => e.identifier);
    let parseResults = results.map((e) => {
        return {
            id: e.user._id,
            name: e.user.name,
            photos: e.user.photos.map((x) => x.id),
            content_hash: e.content_hash,
            s_number: e.s_number,
            url: e.user.photos[0].processedFiles[0].url,
            birth_date: e.user.birth_date,
            online_now: e.user.online_now,
            distance: e.distance_mi,
        };
    });

    let findProgress = new cliProgress.SingleBar(
        {
            format:
                `Scanning... |` +
                chalk.magenta("{bar}") +
                "| {percentage}% || {value}/{total} people",
        },
        cliProgress.Presets.shades_classic
    );

    findProgress.start(results.length, 0);

    let i = 0;
    const interval = await setInterval(async () => {
        if (i === results.length) {
            findProgress.stop();
            clearInterval(interval);
            if (matchesCollection.length > 0) {
                pickMatches();
            } else {
                if (readlineSync.keyInYN("Next scan?")) {
                    await menu_find_match();
                } else {
                    backToMenu();
                }
            }
        }

        if (parseResults[i] === undefined) {
            return;
        }

        let findMatchPeople = await matchesPeople(likedData, parseResults[i]);
        if (findMatchPeople !== null) {
            matchesCollection.push(findMatchPeople);
        }

        findProgress.increment();
        i++;
    }, 200);
};

const pickMatches = async () => {
    await matchesGenerator(matchesCollection);

    let msg = `
        Found matches who likes you
        ===============================
        Yay, we found ${matchesCollection.length} people matches who likes you
        you can see their profile, open with browser this link : file://${process.cwd()}/view/matched.html
    `;

    logInfo(msg);

    let pickMenu = matchesCollection.map((e) => e.name);
    pickMenu.push("Back to Menu?");

    let index = readlineSync.keyInSelect(
        pickMenu,
        "Choose someone for like or pass"
    );

    if (index === pickMenu.length - 1) {
        backToMenu();
    } else {
        await prompMatching(matchesCollection[index]);
    }
};

const matchesPeople = async (likes, people) => {
    let { photos } = people;

    let find = likes.filter((e) => photos.indexOf(e) != -1);

    if (find.length === 0) {
        return null;
    }
    return people;
};

const prompMatching = async (data) => {
    if (
        readlineSync.keyInYN(
            `Input Y for Like or N for Pass with ${data.name}?`
        )
    ) {
        await likePeople(data);
    } else {
        await passPeople(data);
    }
};

const likePeople = async (data) => {
    let token = localstorage.getItem(LOGIN_SESSION);
    let matching = new Matching(token, data);
    let isLikes = await matching.like();

    if (isLikes) {
        matchesCollection = matchesCollection.filter((e) => e.id != data.id);
        await pickMatches();
    } else {
        backToMenu();
    }
};

const passPeople = async (data) => {
    let token = localstorage.getItem(LOGIN_SESSION);
    let matching = new Matching(token, data);
    let isPass = await matching.pass();

    if (isPass) {
        matchesCollection = matchesCollection.filter((e) => e.id != data.id);
        await pickMatches();
    } else {
        backToMenu();
    }
};

export const menu_logout = async () => {
    let loading = logLoading("Logout and clear all data...");
    loading.start();
    localstorage.clear();
    await sleep();
    loading.success("Logout");
    process.exit(0);
};
