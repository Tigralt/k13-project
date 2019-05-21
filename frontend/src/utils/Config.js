const dev = {
    API_URL: "http://localhost:8080/api/v1/"
};

const prod = {
    API_URL: "http://api.cabanes.me/api/"
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;
export default {
    ...config,
};