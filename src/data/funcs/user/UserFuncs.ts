import axiosClient from "@/lib/axios";

async function validateUser() {
  return axiosClient.post("/protected/user/retrieve");
}

export { validateUser };
