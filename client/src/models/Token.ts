export default class Token {

    name;
    collection_name
    creator_address
    property_version
    img_uri

    constructor(name,collection_name, creator_address, property_version, img_uri) {
        this.name = name;
        this.collection_name = collection_name;
        this.creator_address = creator_address;
        this.property_version = property_version;
        this.img_uri = img_uri;
    }
}