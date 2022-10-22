import http from "k6/http";
import { check, sleep } from "k6";

const email = "superadmin@gmail.com";
const password = "password";

export const options = {
    vus: 2,
    duration: "5s",
    // stages: [
    //     { duration: "10s", target: 1 }, // normal load
    //     { duration: '1m', target: 100 },
    //     { duration: "0.2m", target: 0 }, // scale down. Recovery stage.
    // ],
};

const BASE_URL = "http://127.0.0.1:8000";
const EMAIL = "superadmin@gmail.com";
const PASSWORD = "password";
const SLEEP_DURATION = 1;

export default function () {
    //
    const url = "http://127.0.0.1:8000/auth/login";

    const body = JSON.stringify({
        email: EMAIL,
        password: PASSWORD,
    });

    const params = {
        headers: {
            "Content-Type": "application/json",
        },
        tags: {
            name: "login", // first request
        },
    };

    console.debug(params);

    const login_response = http.post(
        "http://127.0.0.1:8000/api/auth/login",
        body,
        params
    );

    console.log(login_response.cookies["XSRF-TOKEN"]);

    check(login_response, {
        "Login status 200": (r) => r.status === 200,
        // "is api key present": (r) => r.json().hasOwnProperty("tokenapi"),
    });
    params.headers["token"] = login_response.cookies["XSRF-TOKEN"];

    // Get user profile request

    // Logout request
    params.tags.name = "logout";
    const logout_response = http.get(
        "http://127.0.0.1:8000/api/auth/logout",
        params
    );
    check(logout_response, {
        "Logout status 200": (r) => r.status === 200,
    });

    sleep(1);
}
