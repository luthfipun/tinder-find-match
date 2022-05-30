import { LocalStorage } from "node-localstorage";
import { LIKED_DATA } from "../../util/constant";
var localstorage = new LocalStorage("./tmp");

export class Liked {
    constructor(response) {
        this.response = response;
    }

    save() {
        let data = this.response.data;
        let { results } = data;

        if (results.length === 0) {
            return;
        }

        let likedDatas = [];
        results.forEach((element) => {
            let { user } = element;
            let likedData = new LikedData(
                user._id,
                user.recently_active,
                user.photos[0].id,
                user.photos[0].url,
                user.photos[0].processedFiles[0].url
            );
            likedDatas.push(likedData);
        });

        localstorage.setItem(LIKED_DATA, JSON.stringify(likedDatas));
    }

    get() {
        let currentLikedData = localstorage.getItem(LIKED_DATA);

        if (currentLikedData === null) {
            return null;
        }

        return JSON.parse(currentLikedData).map((el) => {
            return new LikedData(
                el.id,
                el.recently_active,
                el.identifier,
                el.original_photo,
                el.processing_photo
            );
        });
    }
}

class LikedData {
    constructor(
        id,
        recently_active,
        identifier,
        original_photo,
        processing_photo
    ) {
        this.id = id;
        this.recently_active = recently_active;
        this.identifier = identifier;
        this.original_photo = original_photo;
        this.processing_photo = processing_photo;
    }
}
