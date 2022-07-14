import { useTransactionContext } from "../../../api/transaction";
import { CardTypeSwitch } from "../../atoms/cards/card.manage.tx";
import { ManageTransactionLayout } from "../../layouts/layout.manage";
import _ from "lodash";

export const TransactionHistory = () => {
  const { completed } = useTransactionContext();
  return (
    <ManageTransactionLayout title="Transaction History">
      {CardGrid(completed)}
      {
        <div className="dark:text-gray-300">
          {_.isEmpty(completed.transfer) ? "No Transactions" : ""}
        </div>
      }
    </ManageTransactionLayout>
  );
};

function CardGrid(completed) {
  return (
    <>
      {_.concat(completed.burn, completed.transfer).map((d, index) => {
        return <CardTypeSwitch data={d} key={index} type="completed" />;
      })}
    </>
  );
}
