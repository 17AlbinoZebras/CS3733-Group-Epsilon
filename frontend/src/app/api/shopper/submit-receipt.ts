import { ReceiptItem } from "@/app/(protected)/receipt-add/page";
import { instance, mock } from "../axios";

// mock.onPost("/submit-receipt").reply(200, {
//     statusCode: 200,
//     body: JSON.stringify({
//         message: "Receipt Saved"
//     })
// });

interface payloadInterface {
    items: ReceiptItem[]
    store_id: string
    shopper_id: string
    receipt_datetime: string
}

export async function submitReceipt(payload : payloadInterface) {
    const response = await instance.post("submit-receipt", payload);
    let status = response.data.statusCode;
    if (status != 200) return response.data;
    let vals = JSON.parse(response.data.body);
    return vals;
}