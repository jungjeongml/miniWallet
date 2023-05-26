import { useState } from "react";
import {
  MainEventForm,
  MainEventWrap,
  InfoText,
  Input,
  InputBox,
  TransmitButton,
  LoadingWrap,
} from "../styled";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchSubmit } from "../../../store/accountSlice";
import { DotSpinner } from "@uiball/loaders";

export const MainEvent = () => {
  const [received, setReceived] = useState("");
  const [amount, setAmount] = useState("");
  const select = useAppSelector((state) => state.account.selectedAccounts);
  const sender = select?.account;
  const loading = useAppSelector((state) => state.account.isLoading);
  const dispatch = useAppDispatch();

  const submitHandler = async () => {
    if (sender) {
      dispatch(fetchSubmit({ received, amount, sender }));
    }
  };

  return (
    <>
      <MainEventForm
        onSubmit={() => {
          submitHandler();
        }}
      >
        {loading ? (
          <LoadingWrap>
            <DotSpinner size={40} speed={0.9} color="pink" />
          </LoadingWrap>
        ) : (
          <MainEventWrap>
            <InputBox>
              <InfoText>Received Account</InfoText>
              <Input
                value={received}
                onChange={(e) => {
                  setReceived(e.target.value);
                }}
              ></Input>
            </InputBox>
            <InputBox>
              <InfoText>Amount</InfoText>
              <Input
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              ></Input>
            </InputBox>
            <TransmitButton>Transmit</TransmitButton>
          </MainEventWrap>
        )}
      </MainEventForm>
    </>
  );
};
