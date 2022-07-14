import * as React from "react";
import { useNotificationContext } from "../../api/notification";

export const NotificationContainer = ({ card }) => {
  const { cardDispatch } = useNotificationContext();

  const reversed = card.reverse();

  function renderItem(i) {
    if (typeof i.content === "function") {
      return i.content({ ...i });
    } else {
      return <pre>{JSON.stringify(i.content, null, 2)}</pre>;
    }
  }

  return (
    <div className="fixed bottom-[46px] left-0 z-[100]">
      {reversed.map((i) => {
        return (
          <div
            key={i.id}
            className={"container relative mb-2 left-[10px] ".concat(
              i.out ? "animate-slide-out-to-left" : "animate-slide-in-from-left"
            )}
          >
            {renderItem({ ...i, dispatch: cardDispatch })}
          </div>
        );
      })}
    </div>
  );
};
