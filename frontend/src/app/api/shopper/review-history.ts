import { instance, mock } from "../axios";

export async function reviewHistory(sub: string) {
    const response = await instance.get("review-history", {
        params: {
            'shopperID': sub
        },
    });

    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}