import { useTransactionContext } from "../../../api/transaction";
import { CardTypeSwitch } from "../../atoms/cards/card.manage.tx";
import { ManageTransactionLayout } from "../../layouts/layout.manage";
import _ from "lodash";
export const ManageTransaction = () => {
  const { pending } = useTransactionContext();

  return (
    <ManageTransactionLayout title="Manage Transactions">
      {CardGrid(pending)}
      {/* {pending.transfer.map((d, index) => {
        return <ManageTransactionCard data={d} key={index} />;
      })} */}
      {
        <div className="dark:text-gray-300">
          {_.isEmpty(pending.transfer) && _.isEmpty(pending.burn)
            ? "No Pending Transactions"
            : ""}
        </div>
      }
    </ManageTransactionLayout>
  );
};

function CardGrid(pending) {
  return (
    <>
      {_.concat(pending.burn, pending.transfer).map((d, index) => {
        return <CardTypeSwitch data={d} key={index} type="pending" />;
      })}
    </>
  );
}
