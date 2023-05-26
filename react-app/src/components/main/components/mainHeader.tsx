import { useAppDispatch, useAppSelector } from "../../../store";
import { AccountList, MainHeaderWrapper, MyAccount } from "../styled";
import { MainMenuButton } from "../../../common/button/styled";
import { useEffect } from "react";
import { fetchSelectedAccount } from "../../../store/accountSlice";

export const MainHeader = () => {
  const accounts = useAppSelector((state) => state.account.accounts);
  const selectedAccounts = useAppSelector(
    (state) => state.account.selectedAccounts
  );
  const dispatch = useAppDispatch();
  const selectedAccount = selectedAccounts?.account;
  const account = accounts[0].account;
  const 디스플레이계좌원본 = selectedAccount ? selectedAccount : account;
  console.log("111", 디스플레이계좌원본);

  const maxLength = 5;
  const displayAccount = `${account.slice(0, maxLength)}...${account.slice(
    -4
  )}`;

  const displaySelectAccount = selectedAccount
    ? `${selectedAccount?.slice(0, maxLength)}...${selectedAccount?.slice(-4)}`
    : undefined;

  const accountToDisplay = displaySelectAccount
    ? displaySelectAccount
    : displayAccount;

  useEffect(() => {
    dispatch(fetchSelectedAccount(디스플레이계좌원본));
  }, []);

  return (
    <MainHeaderWrapper>
      <MyAccount>Account: {accountToDisplay}</MyAccount>
      <AccountList>
        <MainMenuButton>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-card-list"
            viewBox="0 0 16 16"
            color="pink"
          >
            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
            <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
          </svg>
        </MainMenuButton>
      </AccountList>
    </MainHeaderWrapper>
  );
};
