"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingListEntries,
  ShoppingListInterface,
} from "../../../../../../models/interfaces";
import { getShoppingListEntries } from "@/app/api/shopper/get-shopping-list-entries";
import { addToShoppingList } from "@/app/api/shopper/add-to-shopping-list";
import { removeFromShoppingList } from "@/app/api/shopper/remove-from-shopping-list";
import NavBar from "../../../../../../components/Navbar";
import styles from "./EditShoppingList.module.css";
import { editShoppingListEntry } from "@/app/api/shopper/edit-shopping-list-entry";

export default function EditShoppingList() {
  let router = usePathname().split("/");
  let args = new URLSearchParams(router[router.length - 1])

  const id = args.get('id')!.toString()
  const list_name = args.get('name')!.toString()

  const [shoppingListItems, setShoppingListItems] = useState<
    ShoppingListEntries[]
  >([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  const [entryEditing, setEntryEditing] = useState<ShoppingListEntries>()
  const [newName, setNewName] = useState("")
  const [newQuantity, setNewQuantity] = useState("")

  useEffect(() => {
    if (router == undefined || id == "") return;

    const getListItems = async () => {
      let items = await getShoppingListEntries(id);
      setShoppingListItems(items);
    };

    getListItems();
  }, [id, router]);

  const insertEntry = async () => {
    if (!name || !quantity) return;
    setName("");
    setQuantity("");
    let items = await addToShoppingList({
      entryName: name,
      entryQuantity: quantity,
      listID: id,
    });
    setShoppingListItems(items);
  };

  const editEntry = async (entry : ShoppingListEntries) => {
    if (!newName || !newQuantity) return;
    setName("");
    setQuantity("");
    let items = await editShoppingListEntry({
      entryID: entry.list_entry_id,
      entryName: newName,
      entryQuantity: newQuantity,
      listID: entry.shopping_list_id
    })
    setEntryEditing(undefined)
    setShoppingListItems(items)
  }

  const updateEntryEditing = async (entry : ShoppingListEntries) => {
    setEntryEditing(entry)
    setNewName(entry.list_entry_name)
    setNewQuantity(entry.list_entry_quantity.toString())
  }

  const removeItem = async (item: ShoppingListEntries) => {
    let items = await removeFromShoppingList({entryID: item.list_entry_id, listID: item.shopping_list_id})
    setShoppingListItems(items)
  }

  return (
    <>
      <NavBar/>
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>{list_name}</h1>
            <form>
              <button className={styles.button} formAction={ `../` }>Return To All Lists</button>
            </form>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>Name</th>
                  <th className={styles.tableHeader}>Quantity</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {shoppingListItems
                  ?.sort((item1: ShoppingListEntries, item2: ShoppingListEntries) => {
                    return (
                      new Date(item1.datetime_edited).getTime() -
                      new Date(item2.datetime_edited).getTime()
                    );
                  })
                  .map((item: ShoppingListEntries) => (
                    !(item == entryEditing) ? (
                      <tr key={item.list_entry_id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{item.list_entry_name}</td>
                        <td className={styles.tableCell}>{item.list_entry_quantity}</td>
                        <td className={styles.tableCell}>
                          <button
                            onClick={() => updateEntryEditing(item)}
                            className={`${styles.button} ${styles.editButton}`}>
                              Edit
                          </button>
                          <button 
                            onClick={() => removeItem(item)}
                            className={`${styles.button} ${styles.removeButton}`}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={item.list_entry_id} className={styles.addRow}>
                        <td className={styles.tableCell}>
                          <input
                            value={newName}
                            onChange={(e) => {
                              setNewName(e.target.value);
                            }}
                            placeholder="Item name"
                            className={styles.formInput}
                          />
                        </td>
                        <td className={styles.tableCell}>
                          <input
                            value={newQuantity}
                            onChange={(e) => {
                              setNewQuantity(e.target.value);
                            }}
                            placeholder="Quantity"
                            type="number"
                            min={1}
                            className={styles.formInput}
                          />
                        </td>
                        <td className={styles.tableCell}>
                          <button 
                            onClick={() => editEntry(item)}
                            className={`${styles.button} ${styles.addButton}`}
                          >
                            Done Editing
                          </button>
                        </td>
                      </tr>
                    )
                  ))}

                <tr className={styles.addRow}>
                  <td className={styles.tableCell}>
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      placeholder="Item name"
                      className={styles.formInput}
                    />
                  </td>
                  <td className={styles.tableCell}>
                    <input
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value);
                      }}
                      placeholder="Quantity"
                      type="number"
                      min={1}
                      className={styles.formInput}
                    />
                  </td>
                  <td className={styles.tableCell}>
                    <button 
                      onClick={insertEntry}
                      className={`${styles.button} ${styles.addButton}`}
                    >
                      Add Item
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className={styles.actionSection}>
            <form>
              <button 
                formAction={`../report-best-options/${new URLSearchParams({id: id, name: list_name}).toString()}`}
                className={`${styles.button} ${styles.submitButton}`}
              >
                Get Best Prices!
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}