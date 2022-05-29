import { LocalStorage } from "node-localstorage";
import { USER_DATA } from "../../util/constant";
var localstorage = new LocalStorage("./tmp");

export class User {
    constructor(responseData) {
        this.responseData = responseData;
    }

    save() {
        let { data } = this.responseData;
        let { user } = data;
        let { account } = data;
        let { likes } = data;

        let userData = new UserData(
            user._id,
            user.name,
            account.account_email,
            account.account_phone_number,
            likes.likes_remaining,
            user.birth_date,
            user.create_date,
            user.gender === 0 ? "male" : "female",
            user.ping_time,
            user.pos.lat,
            user.pos.lon
        );

        localstorage.setItem(USER_DATA, JSON.stringify(userData));
    }

    get() {
        let currentUserData = localstorage.getItem(USER_DATA);

        if (currentUserData === null) {
            return null;
        }

        let {
            id,
            name,
            email,
            phone,
            likes_remaining,
            dob,
            created_at,
            gender,
            ping,
            lat,
            lon,
        } = JSON.parse(currentUserData);

        return new UserData(
            id,
            name,
            email,
            phone,
            likes_remaining,
            dob,
            created_at,
            gender,
            ping,
            lat,
            lon
        );
    }
}

export class UserData {
    constructor(
        id,
        name,
        email,
        phone,
        likes_remaining,
        dob,
        created_at,
        gender,
        ping,
        lat,
        lon
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.likes_remaining = likes_remaining;
        this.dob = dob;
        this.created_at = created_at;
        this.gender = gender;
        this.ping = ping;
        this.lat = lat;
        this.lon = lon;
    }
}
