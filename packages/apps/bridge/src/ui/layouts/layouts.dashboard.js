import { NavigationTopBar } from "../molecules/navigation/navigation.topbar";
import { BridgeModule } from "../organisms/bridge.module";
import { LayoutSidebarNavigation } from "./layout.sidebar.nav";
import { MobileNavigationSidebar } from "../molecules/navigation/navigation.sidebar.mobile";
import { useActiveModuleSwitcher } from "../../api/global/interfaces/interfaces.active.module";
import { useCheckWalletConnected } from "../../api/global/interfaces/interfaces.wallet";
import { useBridgePage } from "../../api/global/interfaces/interface.bridge";
import { ManageTransaction } from "../molecules/manage/manage.request";
import { TransactionHistory } from "../molecules/history/history.request";
import { Navigate, Route, Routes } from "react-router-dom";

export const DashboardLayout = () => {
  const { changeActiveModule, isLoading, currentModule } =
    useActiveModuleSwitcher();
  const { getWalletConnectionProps } = useCheckWalletConnected();
  const { getBridgePageProps } = useBridgePage();

  return (
    <>
      <div className="grid grid-rows-11 grid-flow-cols h-full w-full">
        <div className="row-span-1" id="navigation">
          <NavigationTopBar />
          <div className="w-1/2 md:w-1/4 right-0 absolute mx-2">
            <LayoutSidebarNavigation
              changeModule={changeActiveModule}
              module={currentModule}
            >
              <MobileNavigationSidebar changeModule={changeActiveModule} />
            </LayoutSidebarNavigation>
          </div>
        </div>
        <div className="flex flex-col w-fit min-w-[350px] md:min-w-[460px] md:max-w-full ml-auto mr-auto">
          {isLoading ? (
            <>Loading</>
          ) : (
            <>
              <Routes>
                <Route
                  path="*"
                  element={
                    <BridgeModule
                      {...getWalletConnectionProps()}
                      {...getBridgePageProps()}
                    />
                  }
                />
                <Route path="/manage" element={<ManageTransaction />} />
                <Route path="/history" element={<TransactionHistory />} />
                <Route path="/" element={<Navigate replace to="/release" />} />
              </Routes>
            </>
          )}
        </div>

        <div className="footer row-span-2 flex mt-8 flex-col-reverse text-[13px] md:text-md">
          <p className="text-gray-400 ml-2">
            Powered By{" "}
            <a href="https://zerodao.com" target="_blank" rel="noreferrer">
              zeroDAO
            </a>
            - Copyright &copy; 2022 Z DAO LLC
          </p>
        </div>
      </div>
    </>
  );
};
