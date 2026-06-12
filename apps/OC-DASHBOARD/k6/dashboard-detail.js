import http from "k6/http";
import { sleep } from "k6";

export const options = {
  iterations: 10,
  stages: [
    { duration: "5s", target: 10 },
    { duration: "10s", target: 50 },
    { duration: "15s", target: 1000 },
  ],
};

export default function () {
  http.get("http://localhost:3000/dashboard");

  sleep(1);
}
