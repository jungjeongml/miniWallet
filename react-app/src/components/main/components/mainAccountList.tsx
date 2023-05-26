import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchSelectedAccount } from "../../../store/accountSlice";
import { MainAccountWrapper, TextAccount, CopyButton } from "../styled";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CopyButtonImg } from "../../svg";

export const MainAccountList = () => {
  const accounts = useAppSelector((state) => state.account.accounts);
  const accountList = accounts.map((v) => v.account);
  const dispatch = useAppDispatch();

  const accountClick = (e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.target as HTMLLIElement;
    const clickAccount = target.textContent;
    if (clickAccount) {
      dispatch(fetchSelectedAccount(clickAccount));
    }
    return;
  };

  return (
    <>
      <MainAccountWrapper>
        {accountList.map((account, index) => (
          <TextAccount key={index} onClick={(e) => accountClick(e)}>
            {account}
            <CopyToClipboard
              text={account}
              onCopy={() => {
                alert("Your account has been copied!!");
              }}
            >
              <CopyButton>
                <CopyButtonImg />
              </CopyButton>
            </CopyToClipboard>
          </TextAccount>
        ))}
      </MainAccountWrapper>
    </>
  );
};
