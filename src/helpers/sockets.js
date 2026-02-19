import { io } from "socket.io-client";

// 1. Revert to hardcoded URL to confirm connectivity
export const socket = io("http://localhost:2111");
// 2. The previous logic might have stripped the port or base incorrectly.
// const URL = process.env.REACT_APP_HUMINER_API
//     ? process.env.REACT_APP_HUMINER_API.replace("/api", "")
//     : "http://localhost:2111";
// export const socket = io(URL);
