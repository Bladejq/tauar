import React, { useContext, useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import orderService from "../services/order.service";
import OrderCard from "../components/OrderCard";
function Purchases() {
  const [purchases, setPurchases] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrders()
      .then((res) => res.data)
      .then((data) => {
        setPurchases(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 w-full h-max flex justify-center my-4 ">
      <div className="w-[70%] h-max flex flex-col space-y-4 items-center">
        <h1 className="text-center font-bold text-2xl ">Тапсырыстар тарихы</h1>
        <div className="flex flex-col space-y-4 h-max flex-1 w-full">
          {loading && (
            <Stack
              direction={"row"}
              spacing={1}
              className="w-full py-6 h-[600px] flex justify-center items-start"
            >
              <Skeleton
                variant="rounded"
                height={200}
                width={200}
                className="w-[40%]"
              />

              <Stack spacing={1}>
                <Skeleton variant="rounded" height={30} width={500} />
                <Skeleton variant="rounded" width={200} height={30} />
                <Skeleton variant="rounded" width={150} height={30} />
              </Stack>

              <Stack spacing={1}>
                <Skeleton variant="rounded" width={200} height={40} />
                <Skeleton variant="rounded" width={200} height={40} />
                <Skeleton variant="rounded" width={200} height={40} />
              </Stack>
            </Stack>
          )}
            {purchases &&
            purchases.map((purchase) => <OrderCard order={purchase} />)}
         
        </div>
      </div>
    </div>
  );
}

export default Purchases;

