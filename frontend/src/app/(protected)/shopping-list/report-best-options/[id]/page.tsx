"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingListEntries,
  ShoppingListInterface,
  ShoppingListDeal
} from "../../../../../../models/interfaces";
import { getShoppingListEntries } from "@/app/api/shopper/get-shopping-list-entries";
import { reportShoppingListOptions } from "@/app/api/shopper/report-shopping-list-options";
import NavBar from "../../../../../../components/Navbar";
import styles from "./ReportBestOptions.module.css";

export default function ShoppingListDeals() {
  const router = usePathname().split("/");
  let args = new URLSearchParams(router[router.length - 1])

  const id = args.get('id')!.toString()
  const list_name = args.get('name')!.toString()

  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListEntries[]>([]);
  const [bestDeals, setBestDeals] = useState<ShoppingListDeal[]>([]);

  useEffect(() => {
    if (router == undefined || id == "") return;

    const getListItems = async () => {
      let items = await getShoppingListEntries(id);
      setShoppingListItems(items);
      console.log(shoppingListItems)
    };

    const getBestDeals = async () => {
      console.log("finding deals!")
      let deals = await reportShoppingListOptions(id, 1)
      setBestDeals(deals)
      console.log(bestDeals)
    }

    getListItems();
    getBestDeals();
  }, [id, router]);

  function findBestDeal(entryName: string, entryQuantity: number) {
    let itemFound = false
    entryName = entryName.toLowerCase()
    let dealMessage = (
      <div className={styles.noDealMessage}>
        <span>We do not have enough data on {entryName}. To help, please <a href="../../receipt-add" className={styles.link}>submit your receipt</a> after you purchase this item.</span>
      </div>)
      
    bestDeals.forEach ( (deal : ShoppingListDeal) => {
      console.log(deal.item_category)
      console.log(entryName)
      console.log(deal.item_category == entryName)
      if (deal.item_category == entryName) {
        itemFound = true
        console.log(deal.unit_price)
        dealMessage = (
          <div className={styles.dealCard}>
            <div className={styles.dealInfo}>
              <span className={styles.dealLabel}>Unit Price:</span>
              <span className={styles.dealValue}>${ deal.unit_price.toFixed(2) }</span>
            </div>
            <div className={styles.dealInfo}>
              <span className={styles.dealLabel}>Total Price:</span>
              <span className={styles.dealValue}>${ (deal.unit_price * entryQuantity).toFixed(2) }</span>
            </div>
            <div className={styles.dealInfo}>
              <span className={styles.dealLabel}>Store:</span>
              <span className={styles.dealValue}>{ deal.store_name }</span>
            </div>
            <div className={styles.dealInfo}>
              <span className={styles.dealLabel}>Address:</span>
              <span className={styles.dealValue}>{ deal.store_address }</span>
            </div>
          </div>
        )
      }
    })
    return dealMessage
  }

  return (
    <>
      <NavBar/>
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>{list_name}</h1>
          </div>

          <div className={styles.itemsContainer}>
            {shoppingListItems
              ?.sort((item1: ShoppingListEntries, item2: ShoppingListEntries) => {
                return (
                  new Date(item1.datetime_edited).getTime() -
                  new Date(item2.datetime_edited).getTime()
                );
              })
              .map((item: ShoppingListEntries) => (
                <div key={item.list_entry_id} className={styles.itemCard}>
                  <div className={styles.itemHeader}>
                    <span className={styles.itemName}>{item.list_entry_name}</span>
                    <span className={styles.itemQuantity}>Qty: {item.list_entry_quantity}</span>
                  </div>
                  <div className={styles.dealSection}>
                    { findBestDeal(item.list_entry_name, item.list_entry_quantity) }
                  </div>
                </div>
              ))}
          </div>

          <div className={styles.actionSection}>
            <form>
              <button 
                formAction={ `../edit/${new URLSearchParams({id: id, name: list_name}).toString()}` }
                className={`${styles.button} ${styles.editButton}`}
              >
                Edit Shopping List
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}