const isProd = !(process.env.NODE_ENV === 'production');

const config = {
    BASE_URL: "base+url",
    dev: isProd
}
export default config;