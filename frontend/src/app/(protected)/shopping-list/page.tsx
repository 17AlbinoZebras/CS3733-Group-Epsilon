"use client";

import { useEffect, useState } from "react";
import { getShoppingLists } from "../../api/shopper/get-shopping-lists";
import { createShoppingList } from "../../api/shopper/create-shopping-list";
import { AuthContextProps, useAuth } from "react-oidc-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ShoppingListInterface } from "../../../../models/interfaces";
import NavBar from "../../../../components/Navbar";
import styles from "./ShoppingList.module.css";
import { deleteShoppingList } from "@/app/api/shopper/delete-shopping-list";

function NewShoppingList({auth}: {auth: AuthContextProps}) {
  const router = useRouter()
  const [newListName, setListName] = useState<string>("");

  async function makeNewList(listName: string, shopperID: string) {
    if (listName.trim() == "") {
      listName = "New List";
    }
    let returnedShoppingList = await createShoppingList({
      listName,
      shopperID,
    });
    if (returnedShoppingList != null && returnedShoppingList.length > 0) {
      router.push(`shopping-list/edit/${new URLSearchParams({id: returnedShoppingList[0].shopping_list_id, name: listName}).toString()}`)
    }
  }

  return (
    <div className={styles.newListSection}>
      <input
        id="list-name-input"
        value={newListName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="Enter list name"
        className={styles.formInput}
      />
      <button
        onClick={() => {
          if (auth.user) {
            makeNewList(newListName, auth.user!.profile.sub);
            setListName("");
          }
        }}
        className={`${styles.button} ${styles.addButton}`}
      >
        Create New List
      </button>
    </div>
  );
}


// Main Function:
export default function ShoppingList() {
  const auth = useAuth();

  const [allShoppingLists, setShoppingLists] = useState<ShoppingListInterface[]>([]);

  useEffect(()=>{
    if(auth.user == undefined) return
    const getall = async () => {
      let lists = await getShoppingLists(auth.user!.profile.sub)
      setShoppingLists(lists)
    }
    getall()
  }, [auth.user])


  const deleteList = async (list: ShoppingListInterface) => {
    let lists = await deleteShoppingList({listID: list.shopping_list_id, shopperID: auth.user!.profile.sub})
    setShoppingLists(lists)
  }

  function ShoppingLists ({allShoppingLists}: {allShoppingLists: ShoppingListInterface[]}) {
    const handleCreateList = (list : ShoppingListInterface) => {
      const h = new URLSearchParams({id: list.shopping_list_id, name: list.list_name})
      window.location.href = `shopping-list/edit/${h.toString()}`
    }
    return (
      <div className={styles.listContainer}>
        {allShoppingLists.length === 0 ? (
          <div className={styles.emptyState}>
            No shopping lists yet. Create one to get started!
          </div>
        ) : (
          <ul className={styles.shoppingList}>
            {allShoppingLists.map((list: ShoppingListInterface) => (
              <li key={list.shopping_list_id} className={styles.listItem}>
                <button
                  onClick={() => handleCreateList(list)}
                  className={styles.listLink}
                >
                  <div className={styles.listCard}>
                    <div className={styles.listIcon}>📋</div>
                    <div className={styles.listName}>{list.list_name}</div>
                    <div className={styles.listDelete}>
                      <a
                      onClick={(e) => {
                          e.stopPropagation()
                          deleteList(list)
                        }}>Delete</a>
                    </div>
                    <div className={styles.listArrow}>→</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <>
      <NavBar/>
      {auth.isLoading ? (
        <div className={styles.loadingText}>Loading...</div>
      ) : (
        <div className={styles.pageContainer}>
          <div className={styles.contentWrapper}>
            <div className={styles.header}>
              <h1 className={styles.title}>My Shopping Lists</h1>
            </div>
            
            <NewShoppingList auth={auth} />
            <ShoppingLists allShoppingLists={allShoppingLists} />
          </div>
        </div>
      )}
    </>
  );
}