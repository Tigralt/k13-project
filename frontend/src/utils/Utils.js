export const formURLEncode = dict => {
    var formBody = [];
    for (var key in dict) {
        let encodedKey = encodeURIComponent(key);
        let encodedValue = encodeURIComponent(dict[key]);
        formBody.push(encodedKey + '=' + encodedValue);
    }

    return formBody.join('&');
};
