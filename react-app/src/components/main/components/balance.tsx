import { BalanceWrapper } from "../styled";
import { useAppSelector } from "../../../store";

export const Balance = () => {
  const accounts = useAppSelector((state) => state.account.accounts);

  const select = useAppSelector((state) => state.account.selectedAccounts);

  const currentBalance = select?.balance ? select.balance : accounts[0].balance;

  return (
    <BalanceWrapper>
      <h1>{currentBalance} BTC</h1>
    </BalanceWrapper>
  );
};
