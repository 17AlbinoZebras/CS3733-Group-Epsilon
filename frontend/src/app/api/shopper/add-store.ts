import { instance, mock } from "../axios";

// mock.onPost("/add-store").reply(200, {
//   statusCode: 200,
//   body: JSON.stringify([
//     { "chain-id": "new-123", address: "123 Main St", name: "store" },
//   ]),
// });

export async function addStore(chainID: string, name: string, address: string) {
  const response = await instance.post("add-store", { chainID, address, name });
  let status = response.data.statusCode;
  if (status != 200) return response.data;
  let vals = JSON.parse(response.data.body);
  return vals;
}
